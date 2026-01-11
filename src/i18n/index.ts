import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = {
    en: { translation: en },
    ar: { translation: ar },
    ru: { translation: ru },
    es: { translation: es },
    fr: { translation: fr },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
        detection: {
            order: ['localStorage'],
            caches: ['localStorage'],
        },
    });

export default i18n;

// RTL languages
export const rtlLanguages = ['ar'];
export const isRTL = (lang: string) => rtlLanguages.includes(lang);

// Language options for selector
export const languageOptions = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇴🇲' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];
