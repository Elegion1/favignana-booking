import emailjs from "@emailjs/browser";
import { jsPDF } from "jspdf";

const apiUrl = import.meta.env.VITE_EXTERNAL_API_URL;
const emailJSPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const emailJSServiceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const encriptionSecretKey = import.meta.env.VITE_ENCRYPTION_SECRET_KEY;

const generateBookingCode = async () => {
  console.log("Generazione del codice di prenotazione...");

  try {
    const response = await fetch(
      `${apiUrl}/dashboard/bookingfromreact/getBookingCode`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    console.log("Response:", result);
    return result.code;
  } catch (error) {
    console.error(
      "Errore nella generazione del codice di prenotazione:",
      error
    );
  }
};

// Funzione per generare e scaricare il PDF
function generateAndDownloadPDF(details) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Dettagli Prenotazione", 20, 20);

  doc.setFontSize(12);
  doc.text(`Codice Prenotazione: ${details.code}`, 20, 30);
  doc.text(`Nome: ${details.name} ${details.surname}`, 20, 40);
  doc.text(`Email: ${details.email}`, 20, 50);
  doc.text(`Telefono: ${details.phone}`, 20, 60);
  doc.text(`Note: ${details.message}`, 20, 65);

  if (details.type == "transfer") {
    doc.text(`Tratta: ${details.route}`, 20, 70);
    doc.text(
      `Data Partenza: ${details.dateStart} alle ${details.timeStart}`,
      20,
      80
    );

    if (details.dateReturn && details.timeReturn) {
      doc.text(
        `Data Ritorno: ${details.dateReturn} alle ${details.timeReturn}`,
        20,
        90
      );
    }

  } else if (details.type == "escursione") {

    doc.text(`Escursione a: ${details.excursion}`, 20, 70);
    doc.text(`Luogo di partenza: ${departureLocation}`, 20, 75);
    doc.text(
      `Data Partenza: ${details.dateStart} alle ${details.timeStart}`,
      20,
      80
    );
  }

  doc.text(`Passeggeri: ${details.passengers}`, 20, 100);
  doc.text(`Prezzo: ${details.price}€`, 20, 110);

  console.log("Generating PDF:", details);

  // Scarica il PDF
  doc.save(`Prenotazione-${details.code}.pdf`);
}

// Funzione per inviare l'email
function sendBookingEmail(details) {
  emailjs.init(emailJSPublicKey);
  const serviceID = emailJSServiceID;
  const templateID = "template_ztva4m8";
  console.log("Sto inviando la mail", details);
  emailjs
    .send(serviceID, templateID, details)
    .then((response) => {
      console.log("Email inviata con successo!", response);
      alert("Dettagli prenotazione inviati via email!");
    })
    .catch((error) => {
      console.error("Errore nell'invio dell'email:", error);
    });
}

function encryptData(bookingData, secretKey) {
  // Convertiamo l'oggetto in stringa JSON
  const jsonData = JSON.stringify(bookingData);

  // Criptiamo la stringa usando Base64 (usiamo un segreto per migliorare la sicurezza)
  const encryptedData = btoa(jsonData);

  // Restituiamo i dati criptati
  return encryptedData;
}

function sendEncryptedBookingData(bookingData) {
  const secretKey = encriptionSecretKey;

  // Cripta i dati
  const encryptedBookingData = encryptData(bookingData, secretKey);

  // Crea l'URL con i dati criptati
  const url = new URL(`${apiUrl}/dashboard/bookingfromreact/getBookingData`);
  url.searchParams.append("encryptedData", encryptedBookingData);

  // Esegui la richiesta GET con i dati criptati nell'URL
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log("Success:", data))
    .catch((error) => console.error("Error:", error));
}

async function testBookingFlow () {
  console.log("Simulazione del flusso di prenotazione...");

  // Genera un codice di prenotazione
  const bookingCode = await generateBookingCode();

  // Crea i dettagli della prenotazione simulati
  const bookingDetails = {
      ...formData,

      code: bookingCode,
      paymentID: "TEST_PAYMENT_ID",
      paymentStatus: "COMPLETED",
  };

  console.log("Dettagli della prenotazione simulati:", bookingDetails);

  sendEncryptedBookingData(bookingDetails);

  // Aggiorna lo stato del pagamento
  setPaymentStatus("COMPLETED");

  alert("Flusso di prenotazione completato con successo (simulazione).");
  generateAndDownloadPDF(bookingDetails);
};


export {
  generateBookingCode,
  sendEncryptedBookingData,
  sendBookingEmail,
  generateAndDownloadPDF,
  testBookingFlow
};
