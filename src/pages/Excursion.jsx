import ExcursionBookingForm from "../components/ExcurisonBookingForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

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
                <p>
                    Vivi un’esperienza unica alla scoperta delle suggestive Saline di Nubia, tra tramonti mozzafiato, natura incontaminata e tradizione siciliana. Prenota la tua escursione scegliendo il punto di partenza più comodo per te: ci occupiamo noi del resto. Lasciati incantare da un paesaggio senza tempo!
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