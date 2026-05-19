import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLangState] = useState(
    () => localStorage.getItem('trendstock_lang') ?? 'en'
  );

  const setLanguage = useCallback((lang) => {
    localStorage.setItem('trendstock_lang', lang);
    setLangState(lang);
  }, []);

  const t = useCallback((key) => {
    return translations[language]?.[key] ?? translations.en?.[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
