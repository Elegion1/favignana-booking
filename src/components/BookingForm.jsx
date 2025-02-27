import { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { getLabel } from '../utils/labels';
import ErrorMessage from './ErrorMessage';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';

const BookingForm = forwardRef((props, ref) => {
    const apiUrl = import.meta.env.VITE_EXTERNAL_API_URL;
    const emailJSPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const emailJSServiceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const encriptionSecretKey = import.meta.env.VITE_ENCRYPTION_SECRET_KEY;

    const bookingFormRef = ref || useRef(null);
    const [showReturn, setShowReturn] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [dataToSubmit, setDataToSubmit] = useState(null);
    const [formData, setFormData] = useState({
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
            arrival: "Favignana",
            price: 100,
            incrementPrice: 5,
            duration: 1,
        },
        // Aggiungi qui altre rotte manualmente
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
            passengers: Math.max(prevData.passengers - 1, 1)
        }));
    };

    const handlePassengerChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setFormData((prevData) => ({
                ...prevData,
                passengers: Math.min(Math.max(value, 1), 16)
            }));
        }
    };

    const handleRouteChange = (e) => {
        const selectedRoute = routes.find(route => `${route.departure} - ${route.arrival}` === e.target.value);

        setFormData((prevData) => ({
            ...prevData,
            route: e.target.value,
            duration: selectedRoute ? selectedRoute.duration : 0, // Imposta la durata se esiste
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            route: ''
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Nome è richiesto';
        if (!formData.surname) newErrors.surname = 'Cognome è richiesto';
        if (!formData.email) newErrors.email = 'Email è richiesta';
        if (!formData.phone) newErrors.phone = 'Telefono è richiesto';
        if (!formData.route) newErrors.route = 'Tratta è richiesta';
        if (!formData.dateStart) newErrors.dateStart = 'Data Partenza è richiesta';
        if (!formData.timeStart) newErrors.timeStart = 'Orario Partenza è richiesto';
        if (!formData.message) newErrors.message = 'Le note sono richieste';
        if (showReturn) {
            if (!formData.dateReturn) newErrors.dateReturn = 'Data Ritorno è richiesta';
            if (!formData.timeReturn) newErrors.timeReturn = 'Orario Ritorno è richiesto';
            if (formData.dateReturn <= formData.dateStart) {
                newErrors.dateReturn = 'La data di ritorno deve essere successiva alla data di partenza';
            }
        }
        return newErrors;
    };

    const calculatePrice = () => {
        const selectedRoute = routes.find(route => `${route.departure} - ${route.arrival}` === formData.route);
        if (!selectedRoute) return 0;

        const { price: basePrice, incrementPrice } = selectedRoute;
        const passengers = formData.passengers;
        const extraPassengers = Math.max(0, passengers - 4); // Usa Math.max per trovare il numero di passeggeri extra

        let totalPrice = basePrice; // Inizializza il prezzo totale con il prezzo base

        if (passengers > 4 && passengers <= 8) {
            totalPrice += incrementPrice * extraPassengers;
        } else if (passengers > 8 && passengers <= 12) {
            totalPrice = (basePrice * 2) + (incrementPrice * (extraPassengers > 8 ? extraPassengers - 8 : 4));
        } else if (passengers > 12) {
            totalPrice = (basePrice * 2) + (incrementPrice * 4) + (incrementPrice * (extraPassengers > 12 ? extraPassengers - 12 : 4));
        }

        // Se è previsto un ritorno, raddoppia il prezzo
        if (showReturn) {
            totalPrice *= 2;
        }

        return totalPrice;
    };

    const generateBookingCode = async () => {
        console.log("Generazione del codice di prenotazione...");

        try {
            const response = await fetch(`${apiUrl}/dashboard/bookingfromreact/getBookingCode`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const result = await response.json();
            console.log("Response:", result);
            return result.code;
        } catch (error) {
            console.error("Errore nella generazione del codice di prenotazione:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        } else {
            // Crea l'oggetto dataToSubmit
            const bookingData = { ...formData };
            if (!showReturn) {
                delete bookingData.dateReturn;
                delete bookingData.timeReturn;
            }
            bookingData.price = calculatePrice();
            bookingData.code = generateBookingCode();

            // Imposta lo stato dataToSubmit
            setDataToSubmit(bookingData);

            // Mostra la sezione di pagamento
            setShowPayment(true);
            console.log('Form Data:', bookingData);
        }
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
    }

    const onApproveOrder = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            setPaymentStatus(details.status);
            console.log('Payment Details:', details);

            const bookingCode = await generateBookingCode();

            const bookingDetails = {
                ...dataToSubmit,
                code: bookingCode,
                paymentID: details.id,
                paymentStatus: details.status,
            };

            generateAndDownloadPDF(bookingDetails);
            sendBookingEmail(bookingDetails);
            sendEncryptedBookingData(bookingDetails);
        });
    };

    // Funzione per generare e scaricare il PDF
    function generateAndDownloadPDF(details) {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Dettagli Prenotazione", 20, 20);

        doc.setFontSize(12);
        doc.text(`Codice Prenotazione: ${details.code}`, 20, 30);
        doc.text(`Nome: ${details.name} ${details.surname}`, 20, 40);
        doc.text(`Email: ${details.email}`, 20, 50);
        doc.text(`Telefono: ${details.phone}`, 20, 60);
        doc.text(`Tratta: ${details.route}`, 20, 70);
        doc.text(`Data Partenza: ${details.dateStart} alle ${details.timeStart}`, 20, 80);

        if (details.dateReturn && details.timeReturn) {
            doc.text(`Data Ritorno: ${details.dateReturn} alle ${details.timeReturn}`, 20, 90);
        }

        doc.text(`Passeggeri: ${details.passengers}`, 20, 100);
        doc.text(`Prezzo: ${details.price}€`, 20, 110);

        console.log('Generating PDF:', details);

        // Scarica il PDF
        doc.save(`Prenotazione-${details.code}.pdf`);
    }

    // Funzione per inviare l'email
    function sendBookingEmail(details) {
        emailjs.init(emailJSPublicKey);
        const serviceID = emailJSServiceID;
        const templateID = "template_ztva4m8";
        console.log("Sto inviando la mail", details);
        emailjs.send(serviceID, templateID, details)
            .then((response) => {
                console.log("Email inviata con successo!", response);
                alert("Dettagli prenotazione inviati via email!");
            })
            .catch((error) => {
                console.error("Errore nell'invio dell'email:", error);
            });
    }

    function encryptData(bookingData, secretKey) {
        // Convertiamo l'oggetto in stringa JSON
        const jsonData = JSON.stringify(bookingData);

        // Criptiamo la stringa usando Base64 (usiamo un segreto per migliorare la sicurezza)
        const encryptedData = btoa(jsonData);

        // Restituiamo i dati criptati
        return encryptedData;
    }

    function sendEncryptedBookingData(bookingData) {
        const secretKey = encriptionSecretKey;

        // Cripta i dati
        const encryptedBookingData = encryptData(bookingData, secretKey);

        // Crea l'URL con i dati criptati
        const url = new URL(`${apiUrl}/dashboard/bookingfromreact/getBookingData`);
        url.searchParams.append('encryptedData', encryptedBookingData);

        // Esegui la richiesta GET con i dati criptati nell'URL
        fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
    }

    return (
        <div ref={bookingFormRef} className='bg-white/90 rounded-md p-5 shadow'>
            <form onSubmit={handleSubmit}>
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
                    <div className='flex justify-between'>
                        <label htmlFor="route">{getLabel("route")}</label>
                        {formData.duration && (
                            <label htmlFor="route">{getLabel("duration")}: {formData.duration} H</label>
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
                    <label className='pt-1 mb-1' htmlFor="passengers">{getLabel("passengers")}</label>
                    <div className={`flex items-center justify-between ${classes}`}>
                        <button className="border rounded px-3 py-2" type="button" onClick={handleDecrement}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                            </svg>
                        </button>
                        <input
                            className="input-class"
                            id="passengers"
                            type="number"
                            min="1"
                            max="16"
                            readOnly
                            value={formData.passengers}
                            onChange={handlePassengerChange}
                            required
                        />
                        <button className="border rounded px-3 py-2" type="button" onClick={handleIncrement}>
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

                {!showReturn && (
                    <button
                        type="button"
                        className="bg-white rounded-md flex justify-center items-center p-3 border-2 w-full mb-5 uppercase"
                        onClick={() => setShowReturn(true)}
                    >
                        {getLabel("addReturn")}
                    </button>
                )}

                {showReturn && (
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
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <label htmlFor="message">{getLabel("notes")}</label>
                    <input className={classes} id="message" type="text" placeholder={getLabel("messagePlaceholder")} value={formData.message} onChange={handleChange} />
                    {errors.message && <ErrorMessage message={errors.message} />}
                </div>

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <span>{getLabel("price")}</span>
                    <input
                        className={classes}
                        type="text"
                        value={`${calculatePrice()} €`}
                        readOnly
                    />
                </div>

                {!showPayment && (
                    <button type="submit" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full uppercase">{getLabel("goToPayment")}</button>
                )}
            </form>

            {paymentStatus === 'COMPLETED' ? (
                <></>
            ) : (
                showPayment && (
                    <>
                        <div className="d-flex items-center justify-center">
                            <button
                                type="button"
                                className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full my-5 uppercase"
                                onClick={() => setShowPayment(false)}
                            >
                                {getLabel("back")}
                            </button>
                        </div>
                        <div className="d-flex items-center justify-center">
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
            )}
        </div>
    );
});

export default BookingForm;
