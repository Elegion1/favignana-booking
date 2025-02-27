export default function Footer() {
    const contacts = [
        {
            image: "./people.png",
            class: "text-4xl",
            title: "Contatti",
            body: "",
        },
        {
            image: "./phone.png",
            class: "text-2xl",
            title: "Telefono:",
            body: "0123456789",
        },
        {
            image: "./whatsapp.png",
            class: "text-2xl",
            title: "WhatsApp:",
            body: "0123456789",
        },
        {
            image: "./email.png",
            class: "text-2xl",
            title: "Email:",
            body: "favignanatravel@info.it",
        },

    ]
    return (
        <>
            <div id="footer" className="bg-b py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
                    <div className="flex flex-col justify-center md:items-start items-center">
                        <h5 className="text-2xl uppercase mb-3">Lorem ipsum dolor</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatem aut fuga numquam, illum quaerat itaque accusantium pariatur esse temporibus porro nemo? Magnam doloribus blanditiis possimus dolore quidem, in commodi. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro nisi, explicabo temporibus commodi ut repellat quasi corporis dolores doloribus? Eaque optio, sint eligendi earum ipsam iste odit sequi a et!</p>
                    </div>
                    <div className="flex flex-col justify-center items-start mx-auto">
                        {contacts.map((contact, index) => (
                            <div key={index} className="flex items-center justify-center mb-5">
                                <img src={contact.image} alt="" className="w-12" />
                                <p className={`ms-10 ${contact.class}`}>{contact.title} {contact.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-center">All rights reserved</p>
            </div>
        </>
    );
}