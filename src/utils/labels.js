export const getLabel = (id) => {
  return labels.it[id] || "";
};

export const labels = {
  it: {
    name: "Nome",
    surname: "Cognome",
    email: "Email",
    phone: "Telefono",
    route: "Tratta",
    dateStart: "Data Partenza",
    timeStart: "Orario Partenza",
    dateReturn: "Data Ritorno",
    timeReturn: "Orario Ritorno",
    notes: "Note",
    passengers: "Passeggeri",
    duration: "Durata",
    addReturn: "Aggiungi Ritorno",
    messagePlaceholder: "Inserisci qui eventuali richieste speciali",
    goToPayment: "Vai al pagamento",
    back: "Indietro",
    backHome: "Torna alla Home",
    loading: "Caricamento...",
    selectRoute: "Seleziona la tratta",
    price: "Prezzo",
    message: "Messaggio",
    paymentCompleted: "Pagamento completato con successo!",
    thankYouBooking:
      "Grazie per la tua prenotazione! Riceverai una conferma via email.",
    paymentError: "Pagamento non riuscito",
    paymentErrorDescription:
      "Qualcosa è andato storto con il pagamento. Riprova più tardi o contatta l'assistenza.",
    send: "Invia",
    sending: "Invio...",
    insertMessage: "Inserisci qui il tuo messaggio",
    contacts: "Contatti",
    whatsapp: "WhatsApp",
    footerTitle: "Contattaci",
    footerBody: "Per maggiori informazioni o richieste speciali, scrivici!",
    taxiInfoTitle: "Transfer per Favignana",
    taxiInfoBody:
      "Transfer privato o condiviso dagli aeroporti di Trapani e Palermo al porto per Favignana.",
    shipInfoTitle: "Scopri Favignana",
    shipInfoBody:
      "Dalle acque cristalline alle incantevoli calette, dai sentieri panoramici alle tradizioni locali, scopri un angolo di paradiso che ti aspetta.",
    home: "Home",
    transfer: "Transfer",
    contactUs: "Contattaci",
    contactUsTitle: "Contattaci per maggiori informazioni",
    contactUsDescription:
      "Se hai domande o vuoi assistenza con la prenotazione, siamo qui per aiutarti.",
    transferTitle: "Prenota il tuo transfer",
    transferBody:
      "Il nostro servizio di transfer è veloce, sicuro e affidabile, con partenza dagli aeroporti di Palermo e Trapani. Raggiungi facilmente il porto di Trapani, punto di imbarco per il traghetto che ti condurrà verso la splendida isola di Favignana",
    favignanaTitle: "Esplora Favignana",
    favignanaBody:
      "Con le sue acque cristalline, le spiagge incontaminate e il paesaggio mozzafiato, Favignana è la meta ideale per chi cerca relax, avventura e natura. Lasciati incantare dalla bellezza delle calette, immergiti nella storia e nella cultura dell’isola, e vivi un’esperienza unica che rimarrà nel cuore",
    paymentTitle: "Pagamento veloce e sicuro",
    paymentBody:
      "Effettua il tuo pagamento in modo rapido e sicuro grazie alla piattaforma PayPal. Con PayPal i tuoi dati saranno protetti da sistemi di sicurezza avanzati, garantendo una transazione senza preoccupazioni. Scegli la tranquillità di un pagamento facile e veloce in pochi clic!",
    CTAAbstract: "TRANSFER PER FAVIGNANA",
    CTATitle: "Prenota il tuo transfer",
    CTABody:
      "Raggiungi il porto senza stress con il nostro servizio transfer. Scegli il punto di partenza e prenota in pochi clic",
    CTAButton: "Prenota ora",
    descTitle: "Transfer per Favignana",
    descBody:
      "Servizio transfer da e per gli aeroporti di Trapani e Palermo, con arrivo diretto al porto di Trapani per l'imbarco verso Favignana",
    homeMasterTitle: "Favignana Transfer",
    transferMasterTitle: "Prenota il tuo transfer",
    contactMasterTitle: "Contattaci",
    transferDescription:
      "Favignana Transfer offre un servizio taxi privato per raggiungere l’isola di Favignana. Taxi senza condivisione del mezzo. Nessuna attesa. \n La scelta più economica e comoda che in soli 25 minuti collega l’aeroporto di Trapani al porto di Trapani, punto di imbarco per le Isole Egadi. Arrivati in sala arrivi dell’aeroporto, troverai l’autista con il cartello che indica il vostro cognome. \n Percorrendo l'affascinante strada delle saline raggiungerai la città di Trapani.\n I nostri mezzi sono forniti di regolare licenza. I servizi vengono svolti da taxi ufficiali o noleggio con conducente. Disponiamo anche di auto di lusso per esigenze particolari. \n Saremo lieti di rendere la tua vacanza migliore. \n Siamo un’azienda locale, esperti della zona, pronti a soddisfare ogni curiosità della provincia di Trapani. Scegli il meglio per i tuoi spostamenti: professionalità e trasparenza sono il nostro marchio. \n Se possiedi un conto PayPal puoi acquistare i nostri servizi in tre comode rate senza interessi. Per maggiori info visita il sito PayPal. Le tariffe, offerte o scontistiche varie sono soggette a disponibilità e possono subire variazioni in base al periodo. \n Contattaci per ulteriori informazioni o per prenotare il tuo transfer!",
    termsConditions: "Termini e condizioni",
    iAccept: "Accetto i",
  },
  en: {
    name: "Name",
    surname: "Surname",
    email: "Email",
    phone: "Phone",
    route: "Route",
    dateStart: "Departure Date",
    timeStart: "Departure Time",
    dateReturn: "Return Date",
    timeReturn: "Return Time",
    notes: "Notes",
    passengers: "Passengers",
    duration: "Duration",
    addReturn: "Add Return",
    messagePlaceholder: "Enter any special requests here",
    goToPayment: "Go to Payment",
    back: "Back",
    backHome: "Back to Home",
    loading: "Loading...",
    selectRoute: "Select a route",
    price: "Price",
    message: "Message",
    paymentCompleted: "Payment successfully completed!",
    thankYouBooking:
      "Thank you for your booking! You will receive a confirmation email.",
    paymentError: "Payment failed",
    paymentErrorDescription:
      "Something went wrong with the payment. Please try again later or contact support.",
    send: "Send",
    sending: "Sending...",
    insertMessage: "Enter your message here",
    contacts: "Contacts",
    whatsapp: "WhatsApp",
    footerTitle: "Contact us",
    footerBody: "For more information or special requests, write to us!",
    taxiInfoTitle: "Transfer information",
    taxiInfoBody:
      "Private or shared transfer from Trapani and Palermo airports to the port for Favignana.",
    shipInfoTitle: "Ferry information",
    shipInfoBody: "Schedules and connections for ferries to Favignana.",
    home: "Home",
    transfer: "Transfer",
    contactUs: "Contact us",
    contactUsTitle: "Contact us for more information",
    contactUsDescription:
      "If you have questions or need help with your booking, we are here to assist you.",
    transferTitle: "Airport to Port Transfer",
    transferBody:
      "Fast and reliable transfer service from airports to the port for Favignana.",
    favignanaTitle: "Favignana",
    favignanaBody:
      "Discover the stunning island of Favignana and its breathtaking beaches.",
    paymentTitle: "Payment details",
    paymentBody:
      "Check your transfer details and complete the payment securely.",
    CTAAbstract: "Start your journey to Favignana",
    CTATitle: "Book your transfer",
    CTABody:
      "Reach the port without stress with our transfer service. Choose your starting point and book in a few clicks.",
    CTAButton: "Book now",
    descTitle: "Service description",
    descBody:
      "Transfer service to/from Trapani and Palermo airports, with direct arrival at the port for boarding to Favignana.",
    homeMasterTitle: "Welcome to Favignana Transfer",
    transferMasterTitle: "Book your airport-to-port transfer",
    contactMasterTitle: "Contact us for info and bookings",
    transferDescription:
      "Travel stress-free! We offer comfortable and punctual transfers from airports to the port for Favignana.",
  },
};
