import accountAr from './locales/ar/account';
import authAr from './locales/ar/auth';
import commonAr from './locales/ar/common';
import profileAr from './locales/ar/profile';
import shopAr from './locales/ar/shop';
import account from './locales/en/account';
import auth from './locales/en/auth';
import common from './locales/en/common';
import profile from './locales/en/profile';
import shop from './locales/en/shop';

export const translations = {
    en: {
        common,
        shop,
        auth,
        profile,
        account,
    },
    ar: {
        common: commonAr,
        shop: shopAr,
        auth: authAr,
        profile: profileAr,
        account: accountAr,
    },
} as const;

export type LocaleKey = keyof typeof translations;
export type TranslationDictionary = typeof translations.en;

function resolveInitialLocale(): LocaleKey {
    const htmlLang =
        typeof document !== 'undefined'
            ? document.documentElement.lang.split('-')[0]
            : '';

    return htmlLang in translations ? (htmlLang as LocaleKey) : 'en';
}

export const currentLocale: LocaleKey = resolveInitialLocale();

export function t(path: string, locale: LocaleKey = currentLocale): string {
    const segments = path.split('.');
    let value: unknown = translations[locale];

    for (const segment of segments) {
        if (value && typeof value === 'object' && segment in value) {
            value = (value as Record<string, unknown>)[segment];
        } else {
            return path;
        }
    }

    return typeof value === 'string' ? value : path;
}
