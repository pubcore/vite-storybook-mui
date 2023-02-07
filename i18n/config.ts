import i18n from "i18next";
import translation from "./en/translation.json";
import { initReactI18next } from "react-i18next";
import { i18nextTextEditPlugin } from "../src/components";

export const resources = {
  en: {
    translation,
  },
} as const;

i18n
  .use(initReactI18next)
  .use(i18nextTextEditPlugin)
  .init({
    lng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
    returnNull: false,
    postProcess: ["i18nextTextEditPlugin"],
  });
