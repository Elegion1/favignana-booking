import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import './App.css';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Transfer from './pages/Transfer';
import Contact from './pages/Contact';
import TermsAndConditions from "./pages/TermsAndConditions";
import Excursion from "./pages/Excursion";


function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("redirect");
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={
          <>
            <Layout />
          </>
        }>
          <Route index element={
            <>
              <Home />
            </>
          }
          />
          <Route path="/transfer" element={
            <>
              <Transfer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Contact />
            </>
          } />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/excursion" element={
            <>
              <Excursion />
            </>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;