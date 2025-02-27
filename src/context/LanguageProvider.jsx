import React, { createContext, useContext, useState } from 'react';

// Crea un contesto per la lingua
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'it');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // Salva la lingua nel localStorage
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};