import common from './locales/en/common';
import shop from './locales/en/shop';
import auth from './locales/en/auth';
import profile from './locales/en/profile';
import account from './locales/en/account';

export const translations = {
    en: {
        common,
        shop,
        auth,
        profile,
        account,
    },
} as const;

export type LocaleKey = keyof typeof translations;
export type TranslationDictionary = typeof translations.en;

export function t(path: string, locale: LocaleKey = 'en'): string {
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
