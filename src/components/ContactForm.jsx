import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { getLabel } from '../utils/labels';

export default function ContactForm() {
    const emailJSPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const emailJSServiceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;

    const form = useRef();
    const [loading, setLoading] = useState(false);
    const classes = "border-t border-gray-400 pt-1";

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs.sendForm(
            emailJSServiceID,   // Sostituisci con il tuo Service ID
            'template_oj1l972',  // Sostituisci con il tuo Template ID
            form.current,
            emailJSPublicKey  // Sostituisci con la tua Public Key
        )
            .then((result) => {
                console.log('Email inviata:', result.text);
                alert('Messaggio inviato con successo!');
                form.current.reset();
            })
            .catch((error) => {
                console.error('Errore invio email:', error.text);
                alert('Errore nell’invio del messaggio. Riprova!');
            })
            .finally(() => {
                setLoading(false); // Nascondi lo spinner dopo l'invio
            });
    };

    return (
        <>
            <div className='bg-a rounded-md p-5 shadow w-full'>
                <form ref={form} onSubmit={sendEmail}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="bg-b rounded-md flex flex-col p-3">
                            <label htmlFor="name">{getLabel("name")}</label>
                            <input className={classes} id="name" name="name" type="text" placeholder="Mario" required />
                        </div>
                        <div className="bg-b rounded-md flex flex-col p-3">
                            <label htmlFor="surname">{getLabel("surname")}</label>
                            <input className={classes} id="surname" name="surname" type="text" placeholder="Rossi" required />
                        </div>
                    </div>

                    <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                        <label htmlFor="email">{getLabel("email")}</label>
                        <input className={classes} id="email" name="email" type="email" placeholder="mariorossi@mail.com" required />
                    </div>

                    <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                        <label htmlFor="phone">{getLabel("phone")}</label>
                        <input className={classes} id="phone" name="phone" type="tel" placeholder="+39 349 567 8922" required />
                    </div>

                    <div className="bg-b rounded-md flex flex-col p-3 mb-5">
                        <label htmlFor="message">{getLabel("message")}</label>
                        <textarea className={classes} id="message" name="message" rows={4} placeholder={getLabel("insertMessage")} required></textarea>
                    </div>
                    <div className='mb-5'>
                        <label className='flex items-center justify-center'>
                            <input required type="checkbox" id="acceptTerms" className="form-checkbox h-5 w-5 text-blue-600" />
                            <span className="ml-2 text-gray-700">{getLabel("iAccept")} <a className='capitalize underline' href="/terms-and-conditions">{getLabel("termsConditions")}</a></span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-c text-white rounded-md flex justify-center items-center p-3 w-full disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                                </svg>
                                <span className='uppercase'>
                                    {getLabel("sending")}
                                </span>
                            </>
                        ) : (
                            <span className='uppercase'>
                                {getLabel("send")}
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}