import { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { getLabel } from '../utils/labels';
import ErrorMessage from './ErrorMessage';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { generateBookingCode, sendEncryptedBookingData, sendBookingEmail, generateAndDownloadPDF } from '../utils/api';

const TransferBookingForm = forwardRef((props, ref) => {
    const apiUrl = import.meta.env.VITE_EXTERNAL_API_URL;

    const transferBookingFormRef = ref || useRef(null);
    const [showReturn, setShowReturn] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [dataToSubmit, setDataToSubmit] = useState(null);
    const [transferType, setTransferType] = useState('collective');
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        type: 'transfer',
        name: '',
        surname: '',
        email: '',
        phone: '',
        route: '',
        dateStart: '',
        timeStart: '',
        dateReturn: '',
        timeReturn: '',
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

    const routes = [
        {
            id: 1,
            departure: "Aeroporto Trapani Birgi V. Florio",
            arrival: "Trapani Porto",
            collective: {
                price: 10,
                minimumPassengers: 3,
            },
            individual: {
                price: 30,
                priceIncrement: 5,
                minimumPassengers: 1,
            },
            duration: 30,
        },
        {
            id: 3,
            departure: "Aeroporto Palermo Falcone Borsellino",
            arrival: "Trapani Porto",
            collective: {
                price: 25,
                minimumPassengers: 4,
            },
            individual: {
                price: 100,
                priceIncrement: 10,
                minimumPassengers: 1,
            },
            duration: 60,
        },
        {
            id: 2,
            arrival: "Aeroporto Trapani Birgi V. Florio",
            departure: "Trapani Porto",
            collective: {
                price: 10,
                minimumPassengers: 3,
            },
            individual: {
                price: 30,
                priceIncrement: 5,
                minimumPassengers: 1,
            },
            duration: 30,
        },
        {
            id: 4,
            arrival: "Aeroporto Palermo Falcone Borsellino",
            departure: "Trapani Porto",
            collective: {
                price: 25,
                minimumPassengers: 4,
            },
            individual: {
                price: 100,
                priceIncrement: 10,
                minimumPassengers: 1,
            },
            duration: 60,
        },

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

    const handleTransferTypeChange = (type) => {
        setTransferType(type);

        const selectedRoute = routes.find(route => `${route.departure} - ${route.arrival}` === formData.route);

        if (selectedRoute) {
            setFormData((prevData) => ({
                ...prevData,
                price: selectedRoute[type].price,
                minimumPassengers: selectedRoute[type].minimumPassengers,
                passengers: Math.max(prevData.passengers, selectedRoute[type].minimumPassengers), // Imposta i passeggeri al minimo se necessario
            }));
        }
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

    const handleRouteChange = (e) => {
        const selectedRoute = routes.find(route => `${route.departure} - ${route.arrival}` === e.target.value);

        if (selectedRoute) {
            setFormData((prevData) => ({
                ...prevData,
                route: e.target.value,
                duration: selectedRoute.duration,
                price: selectedRoute[transferType].price,
                minimumPassengers: selectedRoute[transferType].minimumPassengers,
                passengers: Math.max(prevData.passengers, selectedRoute[transferType].minimumPassengers),
            }));
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            route: '',
        }));
    };

    const validate = () => {
        const newErrors = {};
        const now = new Date(); // Ottieni la data e l'ora attuali

        if (!formData.name) newErrors.name = 'Nome è richiesto';
        if (!formData.surname) newErrors.surname = 'Cognome è richiesto';
        if (!formData.email) newErrors.email = 'Email è richiesta';
        if (!formData.phone) newErrors.phone = 'Telefono è richiesto';
        if (!formData.route) newErrors.route = 'Tratta è richiesta';
        if (!formData.dateStart) {
            newErrors.dateStart = 'Data Partenza è richiesta';
        } else {
            const selectedDate = new Date(`${formData.dateStart}T${formData.timeStart || '00:00'}`);
            if (selectedDate <= now) {
                newErrors.dateStart = 'La data non può essere nel passato';
            }
        }
        if (!formData.timeStart) newErrors.timeStart = 'Orario Partenza è richiesto';

        if (showReturn) {
            if (!formData.dateReturn) {
                newErrors.dateReturn = 'Data Ritorno è richiesta';
            } else {
                const returnDate = new Date(`${formData.dateReturn}T${formData.timeReturn || '00:00'}`);
                if (returnDate <= now) {
                    newErrors.dateReturn = 'La data e l\'ora di ritorno devono essere future';
                }
                if (formData.dateReturn <= formData.dateStart) {
                    newErrors.dateReturn = 'La data di ritorno deve essere successiva alla data di partenza';
                }
            }
            if (!formData.timeReturn) newErrors.timeReturn = 'Orario Ritorno è richiesto';
        }

        return newErrors;
    };

    const calculatePrice = () => {
        const selectedRoute = routes.find(route => `${route.departure} - ${route.arrival}` === formData.route);
        if (!selectedRoute) return 0;

        const DISCOUNT = 0.1; // 10% di sconto

        const returnPrice = (price) => {
            if (showReturn) {
                price *= 2; // Raddoppia il prezzo per il ritorno
                price *= (1 - DISCOUNT); // Applica lo sconto
            }
            return price; // Restituisce il prezzo aggiornato
        };

        if (transferType === 'collective') {
            const { price: basePrice } = selectedRoute.collective;
            const passengers = formData.passengers;

            let totalPrice = basePrice * passengers;

            totalPrice = returnPrice(totalPrice);

            return totalPrice;
        } else if (transferType === 'individual') {
            const { price: basePrice, priceIncrement } = selectedRoute.individual;
            const passengers = formData.passengers;
            let totalPrice = 0;

            // Calcolo passeggeri per veicolo (max 8)
            const passengersPerVehicle = 8;
            const fullVehicles = Math.floor(passengers / passengersPerVehicle);
            const remainingPassengers = passengers % passengersPerVehicle;

            const calculateVehiclePrice = (p) => {
                console.log('Calculating price for:', p);
                console.log('Base Price:', basePrice);
                console.log('Price Increment:', priceIncrement);
                if (p <= 4) return basePrice;
                return basePrice + (priceIncrement * (p - 4));
            };

            // Prezzo per i veicoli pieni
            totalPrice += fullVehicles * calculateVehiclePrice(passengersPerVehicle);

            // Prezzo per i passeggeri rimanenti
            if (remainingPassengers > 0) {
                totalPrice += calculateVehiclePrice(remainingPassengers);
            }

            console.log('Total Price:', totalPrice);
            totalPrice = returnPrice(totalPrice);

            return totalPrice;
        }

        return 0; // In caso di errore o nessuna corrispondenza
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const bookingData = { ...formData };
        if (!showReturn) {
            delete bookingData.dateReturn;
            delete bookingData.timeReturn;
        }
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
                transferType: transferType,
                paymentID: details.id,
                paymentStatus: details.status,
            };

            sendEncryptedBookingData(bookingDetails);
            sendBookingEmail(bookingDetails);
            generateAndDownloadPDF(bookingDetails);
            setShowPayment(false);
            alert("Prenotazione completata con successo!");
        } catch (error) {
            console.error("Errore durante l'approvazione del pagamento:", error);
            alert("Errore durante l'elaborazione della prenotazione. Riprova più tardi.");
        }
    };

    return (
        <div id='formTop' ref={transferBookingFormRef} className='bg-white/90 rounded-md p-5 shadow'>
            <form onSubmit={handleSubmit}>

                {step === 1 && (
                    <>
                        <p className='text-center text-xl mb-3 uppercase'>{getLabel('selectTransferType')}</p>
                        <div className='flex items-center justify-center mb-5'>
                            <button
                                className={`p-2 rounded-xl uppercase me-5 ${transferType === 'collective' ? 'bg-c text-white' : 'bg-b text-black'}`}
                                type='button'
                                onClick={() => handleTransferTypeChange('collective')}
                            >
                                {getLabel('collective')}
                            </button>

                            <button
                                className={`p-2 rounded-xl uppercase ${transferType === 'individual' ? 'bg-c text-white' : 'bg-b text-black'}`}
                                type='button'
                                onClick={() => handleTransferTypeChange('individual')}
                            >
                                {getLabel('individual')}
                            </button>
                        </div>

                        <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                            <div className='flex justify-between'>
                                <label htmlFor="route">{getLabel("route")}</label>
                                {formData.duration && (
                                    <label htmlFor="route">{getLabel("duration")}: {formData.duration} Min</label>
                                )}
                            </div>
                            <select className={classes} name="route" id="route" value={formData.route} onChange={handleRouteChange}>
                                <option value="">{getLabel("selectRoute")}</option>
                                {routes.map((route, index) => (
                                    <option key={index} value={`${route.departure} - ${route.arrival}`}>{`${route.departure} - ${route.arrival}`}</option>
                                ))}
                            </select>
                            {errors.route && <ErrorMessage message={errors.route} />}
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

                        {
                            !showReturn && (
                                <button
                                    type="button"
                                    className="bg-white rounded-md flex justify-center items-center p-3 border-2 w-full mb-5 uppercase"
                                    onClick={() => setShowReturn(true)}
                                >
                                    {getLabel("addReturn")}
                                </button>
                            )
                        }

                        {
                            showReturn && (
                                <div className="relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div className="bg-b rounded-md flex flex-col p-3">
                                            <label htmlFor="dateReturn">{getLabel("dateReturn")}</label>
                                            <input className={classes} id="dateReturn" type="date" min={formData.dateStart || today} value={formData.dateReturn} onChange={handleChange} />
                                            {errors.dateReturn && <ErrorMessage message={errors.dateReturn} />}
                                        </div>
                                        <div className="bg-b rounded-md flex flex-col p-3">
                                            <label htmlFor="timeReturn">{getLabel("timeReturn")}</label>
                                            <input className={classes} id="timeReturn" type="time" value={formData.timeReturn} onChange={handleChange} />
                                            {errors.timeReturn && <ErrorMessage message={errors.timeReturn} />}
                                        </div>
                                    </div>
                                    <button type="button" className="absolute -top-3 right-0 w-8 h-8 bg-gray-500 text-white rounded-full flex justify-center items-center" onClick={() => setShowReturn(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L7.293 8z" />
                                        </svg>
                                    </button>
                                </div>
                            )
                        }

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
                                            <p><strong>{getLabel("transferType")}:</strong> {getLabel(transferType)}</p>
                                            <p><strong>{getLabel("route")}: <br /></strong> {formData.route}</p>
                                            <p>
                                                <strong>
                                                    {formData.dateReturn ? getLabel("roundTrip") : getLabel("oneWay")}
                                                </strong>
                                            </p>
                                            <p><strong>{getLabel("dateStart")}:</strong> {formData.dateStart} {formData.timeStart}</p>
                                            {formData.dateReturn && (
                                                <p><strong>{getLabel("dateReturn")}:</strong> {formData.dateReturn} {formData.timeReturn}</p>
                                            )}
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
                    </>
                )}

            </form >

            {paymentStatus === 'COMPLETED' ? (
                <></>
            ) : (
                showPayment && (
                    <>
                        <div className="d-flex items-center justify-center">
                            <button
                                type="button"
                                className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full mt-5 uppercase"
                                onClick={() => setShowPayment(false)}
                            >
                                {getLabel("back")}
                            </button>
                        </div>
                        <div className="d-flex items-center justify-center mt-5">
                            <div className="checkout">
                                {isPending ? (
                                    <p className='uppercase'>{getLabel("loading")}</p>
                                ) : (
                                    <PayPalButtons
                                        style={{ layout: "vertical" }}
                                        createOrder={(data, actions) => onCreateOrder(data, actions)}
                                        onApprove={(data, actions) => onApproveOrder(data, actions)}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )
            )}

            {paymentStatus && (
                <div className="bg-b rounded-md flex flex-col p-3">
                    {paymentStatus === 'COMPLETED' ? (
                        <div className="text-green-600">
                            <h2>{getLabel("payment")}</h2>
                            <p>{getLabel("thankYouBooking")}</p>
                        </div>
                    ) : (
                        <div className="text-red-600">
                            <h2>{getLabel("paymentError")}</h2>
                            <p>{getLabel("paymentErrorDescription")}</p>
                        </div>
                    )}
                    <button type="button" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full mt-5" onClick={() => window.location.reload()}>{getLabel("backHome")}</button>
                </div>
            )
            }
        </div >
    );
});

export default TransferBookingForm;
