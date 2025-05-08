import ExcursionBookingForm from "../components/ExcurisonBookingForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { getLabel } from "../utils/labels";

export default function Excursion() {
    const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    const initialOptions = {
        "client-id": clientID,
        currency: "EUR",
        intent: "capture",
    };
    return (
        <>
            <div id="excursionInfo" className="p-10">
                <p className="md:px-30 text-justify">
                    {getLabel('excursionDescription')}
                </p>
            </div>

            <div id="excursionForm" className="w-full flex items-center justify-center">

                <div className="w-full md:w-1/2 px-1 py-20">
                    <PayPalScriptProvider options={initialOptions}>
                        <ExcursionBookingForm />
                    </PayPalScriptProvider>
                </div>
            </div>
        </>
    );
}