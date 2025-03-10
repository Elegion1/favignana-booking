import { getLabel } from "../utils/labels";

export default function Footer() {
    const contacts = [
        {
            image: "./people.png",
            class: "text-3xl capitalize",
            title: `${getLabel("contacts")}`,
            body: "",
        },
        {
            image: "./whatsapp.png",
            class: "text-xl",
            title: `${getLabel("whatsapp")}:`,
            body: "0123456789",
        },
        {
            image: "./email.png",
            class: "text-xl",
            title: `${getLabel("email")}:`,
            body: "info@favignana-transfer.it",
        },

    ]
    return (
        <>
            <div id="footer" className="bg-b py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
                    <div className="flex flex-col justify-center md:items-start items-center">
                        <h5 className="text-2xl uppercase mb-3">{getLabel("footerTitle")}</h5>
                        <p>{getLabel("footerBody")}</p>
                        <a className="mt-10 text-c" href="/terms-and-conditions">{getLabel("termsConditions")}</a>
                    </div>
                    <div className="flex flex-col justify-center items-start mx-auto">
                        {contacts.map((contact, index) => (
                            <div key={index} className="flex items-center justify-center mb-5">
                                <img src={contact.image} alt="" className="w-12" />
                                <p className={`ms-10 text-wrap ${contact.class}`}>{contact.title} {contact.body}</p>
                            </div>
                        ))}

                    </div>
                </div>
                <p className="text-center text-gray-400">All rights reserved</p>
            </div>
        </>
    );
}