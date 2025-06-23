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
    // console.log("Response:", result);
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
  doc.text("Dettagli Prenotazione MG Transfer", 20, 20);

  doc.setFontSize(12);
  doc.text(`Codice Prenotazione: ${details.code}`, 20, 30);
  doc.text(`Nome: ${details.name} ${details.surname}`, 20, 40);
  doc.text(`Email: ${details.email}`, 20, 50);
  doc.text(`Telefono: ${details.phone}`, 20, 60);
  doc.text(`Note: ${details.message}`, 20, 65);

  let currentY = 75;

  if (details.type === "transfer") {
    doc.text(`Tratta: ${details.route}`, 20, currentY);
    currentY += 10;
    doc.text(
      `Data Partenza: ${details.dateStart} alle ${details.timeStart}`,
      20,
      currentY
    );
    currentY += 10;

    if (details.dateReturn && details.timeReturn) {
      doc.text(
        `Data Ritorno: ${details.dateReturn} alle ${details.timeReturn}`,
        20,
        currentY
      );
      currentY += 10;
    }
  } else if (details.type === "escursione") {
    doc.text(`Escursione a: ${details.excursion}`, 20, currentY);
    currentY += 10;
    doc.text(`Luogo di partenza: ${details.departureLocation}`, 20, currentY);
    currentY += 10;
    doc.text(
      `Data Partenza: ${details.dateStart} alle ${details.timeStart}`,
      20,
      currentY
    );
    currentY += 10;
  }

  // Dati volo
  if (
    details.flightNumber ||
    details.departureAirport ||
    details.arrivalAirport
  ) {
    doc.text("Dati volo:", 20, currentY);
    currentY += 10;

    if (details.flightNumber) {
      doc.text(`Numero Volo: ${details.flightNumber}`, 20, currentY);
      currentY += 10;
    }
    if (details.departureAirport && details.departureTime) {
      doc.text(
        `Aeroporto di partenza: ${details.departureAirport} ore: ${details.departureTime}`,
        20,
        currentY
      );
      currentY += 10;
    }
    if (details.arrivalAirport && details.arrivalTime) {
      doc.text(
        `Aeroporto di arrivo: ${details.arrivalAirport} ore: ${details.arrivalTime}`,
        20,
        currentY
      );
      currentY += 10;
    }
  }

  currentY += 10;
  doc.text(`Passeggeri: ${details.passengers}`, 20, currentY);
  currentY += 10;
  doc.text(`Prezzo: ${details.price}€`, 20, currentY);

  console.log("Generating PDF:", details);
  doc.save(`Prenotazione-${details.type}-${details.code}.pdf`);
}

// Funzione per inviare l'email
function sendBookingEmail(details) {
  emailjs.init(emailJSPublicKey);
  const serviceID = emailJSServiceID;
  const templateID = "template_ztva4m8";

  // Inietto l'HTML dinamico
  details.bookingData = generateBookingHtml(details);

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

function generateBookingHtml(details) {
  const data = details;
  const type = data.type;

  let html = `<p>Tipo: ${type}</p>`;

  if (type === "transfer") {
    html += `
      <p><strong>Tratta:</strong> ${data.route}</p>
      <p><strong>Andata:</strong> ${data.dateStart} <strong>ore:</strong> ${data.timeStart}</p>
      <p><strong>Ritorno:</strong> ${data.dateReturn} <strong>ore:</strong> ${data.timeReturn}</p>
      <p><strong>Durata:</strong> ${data.duration} minuti (circa)</p>
    `;
  } else if (type === "escursione") {
    html += `
      <p><strong>Escursione a:</strong> ${data.excursion} <strong>Partenza da:</strong> ${data.departureLocation}</p>
      <p><strong>Data:</strong> ${data.dateStart} <strong>ore:</strong> ${data.timeStart}</p>
      <p><strong>Durata:</strong> ${data.duration} ore (circa)</p>
    `;
  }

  if (data.flightNumber) {
    html += `
      <p><strong>Numero Volo:</strong> ${data.flightNumber}</p>
      <p><strong>Aeroporto di partenza:</strong> ${data.departureAirport} <strong>ore:</strong> ${data.departureTime}</p>
      <p><strong>Aeroporto di arrivo:</strong> ${data.arrivalAirport} <strong>ore:</strong> ${data.arrivalTime}</p>
    `;
  }

  return html;
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

async function testBookingFlow() {
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
}

export {
  generateBookingCode,
  sendEncryptedBookingData,
  sendBookingEmail,
  generateAndDownloadPDF,
  testBookingFlow,
};
