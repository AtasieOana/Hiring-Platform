import i18n from 'i18next';
import { initReactI18next } from "react-i18next";

import translationEN from '../locales/en/translation.json';
import translationRO from '../locales/ro/translation.json';

// the translations
const resources = {
    en: {
        translation: translationEN
    },
    ro: {
        translation: translationRO
    }
};
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ro',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;