import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Transfer from './pages/Transfer';
import Contact from './pages/Contact';
import TermsAndConditions from './pages/TermsAndConditions';

function AppContent() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}