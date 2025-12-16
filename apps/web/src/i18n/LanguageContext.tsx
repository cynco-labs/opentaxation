import { createContext, useContext, ReactNode } from 'react';

export type Language = 'en';

interface LanguageContextType {
  language: Language;
}

const LanguageContext = createContext<LanguageContextType>({ language: 'en' });

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={{ language: 'en' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
