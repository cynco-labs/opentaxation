import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false, // Translations are bundled, no async loading
  },
});

export default i18n;
