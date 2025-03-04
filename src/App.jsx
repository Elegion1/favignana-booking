import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';


import Layout from './pages/Layout';
import Home from './pages/Home';
import Transfer from './pages/Transfer';
import Contact from './pages/Contact';
import TermsAndConditions from "./pages/TermsAndConditions";

function AppContent() {


  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
      </Route>
    </Routes>

  );
}

export default function App() {
  return (

    <BrowserRouter>
      <AppContent /> {/* Usa AppContent per forzare il re-render */}
    </BrowserRouter>

  );
}