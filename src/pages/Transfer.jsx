import { useState, useEffect, useRef } from "react";
import BookingForm from "../components/BookingForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Transfer() {
    const [bookingFormHeight, setBookingFormHeight] = useState(0);
    const bookingFormRef = useRef(null);

    const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    const initialOptions = {
        "client-id": clientID,
        currency: "EUR",
        intent: "capture",
    };

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setBookingFormHeight(entry.contentRect.height);
            }
        });

        if (bookingFormRef.current) {
            observer.observe(bookingFormRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div id="transferInfo" className="p-10">
                <h2 className="text-4xl text-center mb-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit</h2>
                <p className="px-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam vel quo error quibusdam praesentium omnis necessitatibus
                </p>
            </div>
            <div id="space" style={{ height: bookingFormHeight - 1000 }}></div>
            <div id="transferForm" style={{ height: bookingFormHeight + 100 }} className="w-full flex items-center justify-center relative">
                <div className="w-full md:w-1/2 p-1 absolute -top-20">
                    <PayPalScriptProvider options={initialOptions}>
                        <BookingForm ref={bookingFormRef} />
                    </PayPalScriptProvider>
                </div>
            </div>

        </>
    )
}