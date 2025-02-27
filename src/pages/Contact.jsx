import ContactForm from "../components/ContactForm"
export default function Contact() {

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                <div id="contactImage" className="w-full h-96 md:h-auto"></div>
                <div className="flex justify-center items-center p-1 md:p-10">
                    <ContactForm />
                </div>
            </div>
        </>
    )
}