import ContactForm from "../components/ContactForm"
import { getLabel } from "../utils/labels"
export default function Contact() {

    return (
        <>
            
            <div>
                <h2 className="text-4xl text-center mt-10 mb-5">{getLabel("contactUsTitle")}</h2>
                <p className="text-center">
                    {getLabel("contactUsDescription")}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 mt-5">
                <div id="contactImage" className="w-full h-96 md:h-auto"></div>
                <div className="flex justify-center items-center p-1 md:p-10">
                    <ContactForm />
                </div>
            </div>
        </>
    )
}