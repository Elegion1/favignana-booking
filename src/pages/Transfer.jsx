import { useState, useEffect, useRef } from "react";
import { getLabel } from "../utils/labels";
import TransferBookingForm from "../components/TransferBookingForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Transfer() {
    const [transferBookingFormHeight, setTransferBookingFormHeight] = useState(0);
    const transferBookingFormRef = useRef(null);

    const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    const initialOptions = {
        "client-id": clientID,
        currency: "EUR",
        intent: "capture",
    };

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setTransferBookingFormHeight(entry.contentRect.height);
            }
        });

        if (transferBookingFormRef.current) {
            observer.observe(transferBookingFormRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div id="transferInfo" className="p-10">
                <p className="md:px-30 text-justify mb-5">
                    {getLabel("transferDescription")}
                </p>
                <h6 className="text-3xl text-center mt-5 uppercase text-e">{getLabel("discountPolicy")}</h6>
            </div>

            <div id="transferForm"
                // style={{ height: transferBookingFormHeight + 100 }}
                className="w-full h-dvh flex items-center justify-center">
                <div className="w-full md:w-1/2 p-1 ">
                    <PayPalScriptProvider options={initialOptions}>
                        <TransferBookingForm ref={transferBookingFormRef} />
                    </PayPalScriptProvider>
                </div>
            </div>

        </>
    )
}