import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MutedText from '@/components/MutedText.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SaveButton from '@/components/SaveButton.vue';

describe('SaveButton', () => {
    it('defaults the button label to common.save', () => {
        const wrapper = mount(SaveButton);

        expect(wrapper.findComponent(PrimaryButton).text()).toBe('common.save');
    });

    it('renders custom slot content when provided', () => {
        const wrapper = mount(SaveButton, {
            slots: { default: 'Save changes' },
        });

        expect(wrapper.findComponent(PrimaryButton).text()).toBe(
            'Save changes',
        );
    });

    it('disables the button while processing', () => {
        const wrapper = mount(SaveButton, {
            props: { processing: true },
        });

        expect(
            wrapper.findComponent(PrimaryButton).attributes('disabled'),
        ).not.toBeUndefined();
    });

    it('does not show the saved message by default', () => {
        const wrapper = mount(SaveButton);

        expect(wrapper.findComponent(MutedText).exists()).toBe(false);
    });

    it('shows the saved message when saved is true', () => {
        const wrapper = mount(SaveButton, {
            props: { saved: true },
        });

        expect(wrapper.findComponent(MutedText).text()).toBe('common.saved');
    });
});
