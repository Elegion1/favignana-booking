
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Layout from './pages/Layout';

import Home from './pages/Home';
import Transfer from './pages/Transfer';
import Contact from './pages/Contact';


export default function App() {
  const basename = import.meta.env.VITE_APP_BASENAME || '/';

  return (
    <>

      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>

      </BrowserRouter>

    </>

  );
}
