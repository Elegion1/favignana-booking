import { useState, useEffect, useMemo } from 'react';
import ErrorMessage from './ErrorMessage';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export default function BookingForm() {
    const [showReturn, setShowReturn] = useState(false);
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
        passengers: 1
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
            departure: "Aeroporto Trapani Birgi V. Florio",
            arrival: "Favignana",
            price: 100,
            incrementPrice: 5,
        },
        // Aggiungi qui altre rotte manualmente
    ];

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
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
        if (showReturn) {
            if (!formData.dateReturn) newErrors.dateReturn = 'Data Ritorno è richiesta';
            if (!formData.timeReturn) newErrors.timeReturn = 'Orario Ritorno è richiesto';
        }
        return newErrors;
    };

    const calculatePrice = () => {
        const selectedRoute = routes.find(route => `${route.departure} - ${route.arrival}` === formData.route);
        if (!selectedRoute) return 0;

        const { price: basePrice, incrementPrice } = selectedRoute;
        const passengers = formData.passengers;

        if (passengers <= 4) {
            return basePrice;
        } else if (passengers <= 8) {
            return basePrice + incrementPrice * (passengers - 4);
        } else if (passengers <= 12) {
            return (basePrice * 2) + incrementPrice * 4;
        } else {
            return (basePrice * 2) + incrementPrice * 4 + incrementPrice * (passengers - 12);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const dataToSubmit = { ...formData };
            if (!showReturn) {
                delete dataToSubmit.dateReturn;
                delete dataToSubmit.timeReturn;
            }
            dataToSubmit.price = calculatePrice();
            console.log('Form Data:', dataToSubmit);
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
        return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;
            alert(`Transaction completed by ${name}`);
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-a rounded-md p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="bg-b rounded-md flex flex-col p-3">
                        <label htmlFor="name">Nome</label>
                        <input className={classes} id="name" type="text" placeholder="Mario" value={formData.name} onChange={handleChange} />
                        {errors.name && <ErrorMessage message={errors.name} />}
                    </div>
                    <div className="bg-b rounded-md flex flex-col p-3">
                        <label htmlFor="surname">Cognome</label>
                        <input className={classes} id="surname" type="text" placeholder="Rossi" value={formData.surname} onChange={handleChange} />
                        {errors.surname && <ErrorMessage message={errors.surname} />}
                    </div>
                </div>

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <label htmlFor="email">Email</label>
                    <input className={classes} id="email" type="email" placeholder="mariorossi@mail.com" value={formData.email} onChange={handleChange} />
                    {errors.email && <ErrorMessage message={errors.email} />}
                </div>

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <label htmlFor="phone">Telefono</label>
                    <input className={classes} id="phone" type="phone" placeholder="3495678922" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <ErrorMessage message={errors.phone} />}
                </div>

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <label htmlFor="route">Tratta</label>
                    <select className={classes} name="route" id="route" value={formData.route} onChange={handleChange}>
                        <option value="">Seleziona una tratta</option>
                        {routes.map((route, index) => (
                            <option key={index} value={`${route.departure} - ${route.arrival}`}>{`${route.departure} - ${route.arrival}`}</option>
                        ))}
                    </select>
                    {errors.route && <ErrorMessage message={errors.route} />}
                </div>

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <label htmlFor="passengers">Numero di passeggeri</label>
                    <input className={classes} id="passengers" type="number" min="1" max="16" value={formData.passengers} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="bg-b rounded-md flex flex-col p-3">
                        <label htmlFor="dateStart">Data Partenza</label>
                        <input className={classes} id="dateStart" type="date" min={today} value={formData.dateStart} onChange={handleChange} />
                        {errors.dateStart && <ErrorMessage message={errors.dateStart} />}
                    </div>
                    <div className="bg-b rounded-md flex flex-col p-3">
                        <label htmlFor="timeStart">Orario Partenza</label>
                        <input className={classes} id="timeStart" type="time" value={formData.timeStart} onChange={handleChange} />
                        {errors.timeStart && <ErrorMessage message={errors.timeStart} />}
                    </div>
                </div>

                {!showReturn && (
                    <button
                        type="button"
                        className="bg-white rounded-md flex justify-center items-center p-3 border-2 w-full mb-5"
                        onClick={() => setShowReturn(true)}
                    >
                        AGGIUNGI RITORNO
                    </button>
                )}

                {showReturn && (
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="dateReturn">Data Ritorno</label>
                                <input className={classes} id="dateReturn" type="date" min={today} value={formData.dateReturn} onChange={handleChange} />
                                {errors.dateReturn && <ErrorMessage message={errors.dateReturn} />}
                            </div>
                            <div className="bg-b rounded-md flex flex-col p-3">
                                <label htmlFor="timeReturn">Orario Ritorno</label>
                                <input className={classes} id="timeReturn" type="time" value={formData.timeReturn} onChange={handleChange} />
                                {errors.timeReturn && <ErrorMessage message={errors.timeReturn} />}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="absolute -top-3 right-0 w-8 h-8 bg-gray-500 text-white rounded-full flex justify-center items-center"
                            onClick={() => setShowReturn(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                    <label>Prezzo Totale: {calculatePrice()} €</label>
                </div>

                <button type="submit" className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full mb-5">PRENOTA</button>
                <div className="d-flex items-center justify-center">

                    <div className="checkout">
                        {isPending ? <p>LOADING...</p> : (
                            <>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => onCreateOrder(data, actions)}
                                    onApprove={(data, actions) => onApproveOrder(data, actions)}
                                />
                            </>
                        )}
                    </div>

                </div>
            </form>
        </>
    );
}

