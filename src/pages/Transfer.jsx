import BookingForm from "../components/BookingForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Transfer() {
    const clientID = "AY8h-ZfG6mLJSJgCOItHQs9SfixKHtLsmCkjQQ5th_abrx0W84F2765VAAt8GzHAc7Cs-EhHHBRkNkFS";

    const initialOptions = {
        "client-id": clientID,
        currency: "EUR",
        intent: "capture",
    };

    return (
        <>
            <div className="transferInfo p-10">
                <h2 className="text-4xl text-center mb-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit</h2>
                <p className="px-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam vel quo error quibusdam praesentium omnis necessitatibus
                </p>
            </div>

            <div>

                <div className="flex items-center justify-center">
                    <PayPalScriptProvider options={initialOptions}>
                        <BookingForm />
                    </PayPalScriptProvider>
                </div>

            </div>

        </>
    )
}