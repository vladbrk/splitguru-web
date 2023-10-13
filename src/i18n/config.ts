import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from 'i18next-xhr-backend';
import { baseUrl } from '../settings/index'


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(backend)
    .init({
        resources: {},
        lng: "ru",
        fallbackLng: "en",
        keySeparator: false,
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: baseUrl + '/api/lang?locale={{lng}}&bundles=o',
            crossDomain: true,
            withCredentials: false,
        },
        partialBundledLanguages: true
    });


export default i18n;