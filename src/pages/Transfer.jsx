import BookingForm from "../components/BookingForm";
import Checkout from "../components/Checkout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Transfer() {
    const initialOptions = {
        "client-id": "AY8h-ZfG6mLJSJgCOItHQs9SfixKHtLsmCkjQQ5th_abrx0W84F2765VAAt8GzHAc7Cs-EhHHBRkNkFS",
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

            <PayPalScriptProvider options={initialOptions}>
                <BookingForm />
            </PayPalScriptProvider>

            <div className="flex justify-center items-center mt-10">
                {/* <PayPalScriptProvider options={initialOptions}>
                    <Checkout price={price}/>
                </PayPalScriptProvider> */}
            </div>

            <div className="h-96"></div>
        </>
    )
}