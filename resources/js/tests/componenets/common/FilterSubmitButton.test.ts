import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FilterSubmitButton from '@/components/FilterSubmitButton.vue';
import IconLabel from '@/components/IconLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';

describe('FilterSubmitButton', () => {
    it('renders a submit button', () => {
        const wrapper = mount(FilterSubmitButton, {
            slots: { default: 'Apply filters' },
        });

        expect(wrapper.findComponent(PrimaryButton).attributes('type')).toBe(
            'submit',
        );
    });

    it('renders the slot content via IconLabel with a funnel icon', () => {
        const wrapper = mount(FilterSubmitButton, {
            slots: { default: 'Apply filters' },
        });

        const iconLabel = wrapper.findComponent(IconLabel);
        expect(iconLabel.exists()).toBe(true);
        expect(iconLabel.props('icon')).toBeTruthy();
        expect(wrapper.text()).toBe('Apply filters');
    });
});
