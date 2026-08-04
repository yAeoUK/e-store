import accountAr from './locales/ar/account';
import adminAr from './locales/ar/admin';
import authAr from './locales/ar/auth';
import commonAr from './locales/ar/common';
import profileAr from './locales/ar/profile';
import shopAr from './locales/ar/shop';
import validationAr from './locales/ar/validation';
import account from './locales/en/account';
import admin from './locales/en/admin';
import auth from './locales/en/auth';
import common from './locales/en/common';
import profile from './locales/en/profile';
import shop from './locales/en/shop';
import validation from './locales/en/validation';

export const translations = {
    en: {
        common,
        shop,
        auth,
        profile,
        account,
        admin,
        validation,
    },
    ar: {
        common: commonAr,
        shop: shopAr,
        auth: authAr,
        profile: profileAr,
        account: accountAr,
        admin: adminAr,
        validation: validationAr,
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

function resolve(path: string, locale: LocaleKey): string | undefined {
    const segments = path.split('.');
    let value: unknown = translations[locale];

    for (const segment of segments) {
        if (value && typeof value === 'object' && segment in value) {
            value = (value as Record<string, unknown>)[segment];
        } else {
            return undefined;
        }
    }

    return typeof value === 'string' ? value : undefined;
}

export function t(path: string, locale: LocaleKey = currentLocale): string {
    return resolve(path, locale) ?? path;
}

// Same dot-path lookup as t(), plus {token} interpolation from params - kept
// as a separate export (rather than an extra t() argument) because t()'s 2nd
// positional argument is already used as a locale override elsewhere.
export function tp(
    path: string,
    params: Record<string, string | number>,
    locale: LocaleKey = currentLocale,
): string {
    const template = resolve(path, locale) ?? path;

    return template.replace(/\{(\w+)\}/g, (match, token: string) =>
        token in params ? String(params[token]) : match,
    );
}
