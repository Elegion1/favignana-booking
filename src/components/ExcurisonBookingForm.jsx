import { useState, useMemo, useRef, forwardRef } from 'react';
import { getLabel } from '../utils/labels';
import ErrorMessage from './ErrorMessage';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { generateBookingCode, sendEncryptedBookingData, sendBookingEmail, generateAndDownloadPDF, testBookingFlow } from '../utils/api';

const ExcursionBookingForm = forwardRef((props, ref) => {
    const excursionBookingFormRef = ref || useRef(null);

    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [dataToSubmit, setDataToSubmit] = useState(null);

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        type: 'escursione',
        name: '',
        surname: '',
        email: '',
        phone: '',
        excursion: '',
        departureLocation: '',
        dateStart: '',
        timeStart: '',
        passengers: 1,
        message: '',
        code: '',
        price: 0,
        duration: '',
        minimumPassengers: 1,
        flightNumber: '',
        departureAirport: '',
        departureTime: '',
        arrivalAirport: '',
        arrivalTime: '',
    });

    const [errors, setErrors] = useState({});

    const today = useMemo(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    const classes = "border-t border-gray-400 pt-1";

    const excursions = [
        {
            id: 1,
            excursion: "Saline di Nubia",
            departureLocation: {
                trapani: {
                    price: 20,
                    minimumPassengers: 3,
                    duration: 2,
                },
                marsala: {
                    price: 25,
                    minimumPassengers: 3,
                    duration: 2,
                }
            }
        }
    ];

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: ''
        }));
    };

    const handleIncrement = () => {
        setFormData((prevData) => ({
            ...prevData,
            passengers: Math.min(prevData.passengers + 1, 16)
        }));
    };

    const handleDecrement = () => {
        setFormData((prevData) => ({
            ...prevData,
            passengers: Math.max(prevData.passengers - 1, prevData.minimumPassengers),
        }));
    };

    const handlePassengerChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setFormData((prevData) => ({
                ...prevData,
                passengers: Math.max(Math.min(value, 16), prevData.minimumPassengers),
            }));
        }
    };

    const handleExcursionChange = (e) => {
        const selectedExcursion = excursions.find(excursion => excursion.excursion === e.target.value);

        setFormData((prevData) => ({
            ...prevData,
            excursion: e.target.value,
            departureLocation: '',
            duration: '',
            price: '',
            minimumPassengers: '',
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            excursion: '',
            departureLocation: '',
        }));
    };

    const handleDepartureLocationChange = (e) => {
        const location = e.target.value;
        const selectedExcursion = excursions.find(exc => exc.excursion === formData.excursion);
        const locationData = selectedExcursion?.departureLocation[location];

        if (locationData) {
            const { price, minimumPassengers, duration } = locationData;

            setFormData((prev) => ({
                ...prev,
                departureLocation: location,
                price,
                minimumPassengers,
                duration,
                passengers: Math.max(prev.passengers, minimumPassengers),
            }));
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            departureLocation: '',
        }));
    };

    const validate = () => {
        const newErrors = {};
        const now = new Date();

        if (!formData.name) newErrors.name = 'Nome è richiesto';
        if (!formData.surname) newErrors.surname = 'Cognome è richiesto';
        if (!formData.email) newErrors.email = 'Email è richiesta';
        if (!formData.phone) newErrors.phone = 'Telefono è richiesto';
        if (!formData.excursion) newErrors.excursion = 'L\'escursione è richiesta';
        if (!formData.dateStart) {
            newErrors.dateStart = 'Data Partenza è richiesta';
        } else {
            const selectedDate = new Date(`${formData.dateStart}T${formData.timeStart || '00:00'}`);
            if (selectedDate <= now) {
                newErrors.dateStart = 'La data non può essere nel passato';
            }
        }
        if (!formData.timeStart) newErrors.timeStart = 'Orario Partenza è richiesto';

        return newErrors;
    };

    const calculatePrice = () => {
        const selectedExcursion = excursions.find(
            excursion => excursion.excursion === formData.excursion
        );

        if (!selectedExcursion) return 0;

        const departureInfo = selectedExcursion.departureLocation[formData.departureLocation];

        if (!departureInfo) return 0;

        const { price } = departureInfo;
        const passengers = formData.passengers;

        return price * passengers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const bookingData = { ...formData };
        bookingData.price = calculatePrice();
        bookingData.code = await generateBookingCode();

        setDataToSubmit(bookingData);
        setShowPayment(true);
        console.log('Form Data:', bookingData);
    };

    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    const onCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: calculatePrice(),
                    },
                },
            ],
        });
    };

    const onApproveOrder = async (data, actions) => {
        try {
            const details = await actions.order.capture();
            setPaymentStatus(details.status);
            console.log('Payment Details:', details);

            const bookingDetails = {
                ...dataToSubmit,
                paymentID: details.id,
                paymentStatus: details.status,
            };

            sendEncryptedBookingData(bookingDetails);
            alert("Prenotazione completata con successo!");
        } catch (error) {
            console.error("Errore durante l'approvazione del pagamento:", error);
            alert("Errore durante l'elaborazione della prenotazione. Riprova più tardi.");
        }
    };

    return (
        <div id='formTop' ref={excursionBookingFormRef} className='bg-white/90 rounded-md p-5 shadow'>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>

                            <div className="bg-b rounded-md flex flex-col p-3">
                                <div className='flex justify-between'>
                                    <label htmlFor="excursion">{getLabel("excursion")}</label>
                                    {formData.duration && (
                                        <label htmlFor="excursion">{getLabel("duration")}: {formData.duration} Min</label>
                                    )}
                                </div>
                                <select className={classes} name="excursion" id="excursion" value={formData.excursion}
                                    onChange={handleExcursionChange}
                                >
                                    <option value="">{getLabel("selectExcursion")}</option>
                                    {excursions.map((excursion, index) => (
                                        <option key={index} value={`${excursion.excursion}`}>{`${excursion.excursion}`}</option>
                                    ))}
                                </select>
                                {errors.excursion && <ErrorMessage message={errors.excursion} />}
                            </div>

                            <div className="bg-b rounded-md flex flex-col p-3">
                                <div className='flex justify-between'>
                                    <label htmlFor="departureLocation">{getLabel("excursionDepartureLocation")}</label>
                                </div>
                                <select
                                    className={classes}
                                    name="departureLocation"
                                    id="departureLocation"
                                    value={formData.departureLocation}
                                    onChange={handleDepartureLocationChange}
                                >
                                    <option value="">{getLabel("selectLocation")}</option>
                                    {formData.excursion && excursions.find(exc => exc.excursion === formData.excursion)?.departureLocation &&
                                        Object.keys(excursions.find(exc => exc.excursion === formData.excursion).departureLocation).map((location, index) => (
                                            <option key={index} value={location}>
                                                {location.charAt(0).toUpperCase() + location.slice(1)}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.departureLocation && <ErrorMessage message={errors.departureLocation} />}
                            </div>
                        </div>

                        <div className="bg-b rounded-md flex flex-col px-3 py-1 mb-5">
                            <div className='flex justify-between items-center pt-1 mb-1'>
                                <label htmlFor="passengers">
                                    {getLabel("passengers")}
                                </label>
                                <label htmlFor="passengers">
                                    {getLabel("minimumPassengers")}: {formData.minimumPassengers}
                                </label>
                            </div>
                            <div className={`flex items-center justify-between ${classes}`}>
                                <button
                                    className="border rounded px-3 py-2"
                                    type="button"
                                    onClick={handleDecrement}
                                    disabled={formData.passengers <= formData.minimumPassengers}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                </button>
                                <input
                                    className="input-class"
                                    id="passengers"
                                    type="number"
                                    min={formData.minimumPassengers}
                                    max="16"
                                    readOnly
                                    value={formData.passengers}
                                    onChange={handlePassengerChange}
                                    required
                                />
                                <button
                                    className="border rounded px-3 py-2"
                                    type="button"
                                    onClick={handleIncrement}
                                    disabled={formData.passengers >= 16}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="dateStart">{getLabel("dateStart")}</label>
                                <input className={classes} id="dateStart" type="date" min={today} value={formData.dateStart} onChange={handleChange} />
                                {errors.dateStart && <ErrorMessage message={errors.dateStart} />}
                            </div>
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="timeStart">{getLabel("timeStart")}</label>
                                <input className={classes} id="timeStart" type="time" value={formData.timeStart} onChange={handleChange} />
                                {errors.timeStart && <ErrorMessage message={errors.timeStart} />}
                            </div>
                        </div>


                        <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                            <span>{getLabel("price")}</span>
                            <input
                                className={classes}
                                type="text"
                                value={`€ ${calculatePrice()}`}
                                readOnly
                            />
                        </div>

                        <button onClick={() => setStep(2)} type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase">{getLabel("next")}</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="text-center text-xl uppercase">{getLabel('flightInfoTitle')}</p>
                        <p className="text-center text-sm mb-3">{getLabel('flightInfoBody')}</p>
                        <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                            <label htmlFor="flightNumber">{getLabel("flightNumber")}</label>
                            <input className={classes} id="flightNumber" type="text" placeholder="FR1234" value={formData.flightNumber} onChange={handleChange} />
                            {errors.flightNumber && <ErrorMessage message={errors.flightNumber} />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="departureAirport">{getLabel("departureAirport")}</label>
                                <input className={classes} id="departureAirport" type="text" placeholder="Aeroporto di Roma Fiumicino" value={formData.departureAirport} onChange={handleChange} />
                                {errors.departureAirport && <ErrorMessage message={errors.departureAirport} />}
                            </div>
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="departureTime">{getLabel("departureTime")}</label>
                                <input className={classes} id="departureTime" type="time" value={formData.departureTime} onChange={handleChange} />
                                {errors.departureTime && <ErrorMessage message={errors.departureTime} />}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="arrivalAirport">{getLabel("arrivalAirport")}</label>
                                <input className={classes} id="arrivalAirport" type="text" placeholder="Aeroporto di Trapani Birgi" value={formData.arrivalAirport} onChange={handleChange} />
                                {errors.arrivalAirport && <ErrorMessage message={errors.arrivalAirport} />}
                            </div>
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="arrivalTime">{getLabel("arrivalTime")}</label>
                                <input className={classes} id="arrivalTime" type="time" value={formData.arrivalTime} onChange={handleChange} />
                                {errors.arrivalTime && <ErrorMessage message={errors.arrivalTime} />}
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                            <button onClick={() => setStep(1)} type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase me-5">{getLabel("back")}</button>
                            <button onClick={() => setStep(3)} type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase">{getLabel("next")}</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <p className="text-center text-xl uppercase">{getLabel('customerInfoTitle')}</p>
                        <p className="text-center text-sm mb-3">{getLabel('customerInfoBody')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="name">{getLabel("name")}</label>
                                <input className={classes} id="name" type="text" placeholder="Mario" value={formData.name} onChange={handleChange} />
                                {errors.name && <ErrorMessage message={errors.name} />}
                            </div>
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="surname">{getLabel("surname")}</label>
                                <input className={classes} id="surname" type="text" placeholder="Rossi" value={formData.surname} onChange={handleChange} />
                                {errors.surname && <ErrorMessage message={errors.surname} />}
                            </div>
                        </div>

                        <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                            <label htmlFor="email">{getLabel("email")}</label>
                            <input className={classes} id="email" type="email" placeholder="mariorossi@mail.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <ErrorMessage message={errors.email} />}
                        </div>

                        <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                            <label htmlFor="phone">{getLabel("phone")}</label>
                            <input className={classes} id="phone" type="tel" placeholder="+39 349 567 8922" value={formData.phone} onChange={handleChange} />
                            {errors.phone && <ErrorMessage message={errors.phone} />}
                        </div>

                        <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                            <label htmlFor="message">{getLabel("notes")}</label>
                            <input className={classes} id="message" type="text" placeholder={getLabel("messagePlaceholder")} value={formData.message} onChange={handleChange} />
                            {errors.message && <ErrorMessage message={errors.message} />}
                        </div>

                        <div className='flex items-center justify-center'>
                            <button onClick={() => setStep(2)} type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase me-5">{getLabel("back")}</button>
                            <button onClick={() => setStep(4)} type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase">{getLabel("next")}</button>
                        </div>
                    </>
                )}

                {step === 4 && (
                    <>
                        {!showPayment && (
                            <>
                                <div className="bg-b rounded-md flex flex-col p-5 mb-5">
                                    <h2 className="text-xl font-bold mb-3">{getLabel("bookingSummary")}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <p><strong>{getLabel("name")}:</strong> {formData.name} {formData.surname}</p>
                                            <p><strong>{getLabel("email")}:</strong> {formData.email}</p>
                                            <p><strong>{getLabel("phone")}:</strong> {formData.phone}</p>

                                            <p><strong>{getLabel("flightNumber")}:</strong> {formData.flightNumber}</p>
                                            <p><strong>{getLabel("departureAirport")}:</strong> <br />{formData.departureAirport} <strong>{getLabel("time")}</strong>: {formData.departureTime}</p>

                                            <p><strong>{getLabel("arrivalAirport")}:</strong> <br />{formData.arrivalAirport} <strong>{getLabel("time")}</strong>: {formData.arrivalTime}</p>
                                        </div>
                                        <div>

                                            <p><strong>{getLabel("excursion")}: <br /></strong> {formData.excursion}</p>
                                            <p><strong>{getLabel("excursionDepartureLocation")}:</strong> {formData.departureLocation}</p>
                                            <p><strong>{getLabel("dateStart")}:</strong> {formData.dateStart} {formData.timeStart}</p>

                                            <p><strong>{getLabel("passengers")}:</strong> {formData.passengers}</p>
                                            <p><strong>{getLabel("notes")}:</strong> {formData.message || getLabel("noNotes")}</p>
                                            <p><strong>{getLabel("price")}:</strong> {calculatePrice()} €</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-5'>
                                    <label className='flex items-center justify-center'>
                                        <input required type="checkbox" id="acceptTerms" className="form-checkbox h-5 w-5 text-blue-600" />
                                        <span className="ml-2 text-gray-700">{getLabel("iAccept")} <a className='capitalize underline' href="/terms-and-conditions">{getLabel("termsConditions")}</a></span>
                                    </label>
                                </div>

                                <div className='flex items-center justify-center'>
                                    <button onClick={() => setStep(3)} type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase me-5">{getLabel("back")}</button>
                                    <button
                                        type="submit"
                                        className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase"
                                    >
                                        {getLabel("payment")}
                                    </button>
                                </div>
                            </>
                        )}
                        <button
                            type="button"
                            className="bg-gray-500 text-white rounded-md flex justify-center items-center p-3 w-full uppercase mt-5"
                            onClick={() => testBookingFlow()}
                        >
                            Test Flow
                        </button>

                    </>
                )}

            </form>
        </div>
    );
});

export default ExcursionBookingForm;
