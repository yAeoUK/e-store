import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

describe('LanguageSwitcher', () => {
    afterEach(() => {
        document.documentElement.lang = 'en';
    });

    it('renders the current locale as plain text and the other as a link', () => {
        document.documentElement.lang = 'en';

        const wrapper = mount(LanguageSwitcher);

        expect(wrapper.find('span.text-slate-900').text()).toBe('EN');
        expect(wrapper.find('a').text()).toBe('AR');
    });

    it('links the inactive locale to the locale-switch route', () => {
        document.documentElement.lang = 'en';

        const wrapper = mount(LanguageSwitcher);

        expect(wrapper.find('a').attributes('href')).toBe('locale.update');
    });

    it('flips which locale is active when the html lang is arabic', () => {
        document.documentElement.lang = 'ar';

        const wrapper = mount(LanguageSwitcher);

        expect(wrapper.find('span.text-slate-900').text()).toBe('AR');
        expect(wrapper.find('a').text()).toBe('EN');
    });
});
