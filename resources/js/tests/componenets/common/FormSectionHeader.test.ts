import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormSectionHeader from '@/components/FormSectionHeader.vue';
import MutedText from '@/components/MutedText.vue';

describe('FormSectionHeader', () => {
    it('renders the heading and description', () => {
        const wrapper = mount(FormSectionHeader, {
            props: {
                heading: 'Update password',
                description: 'Use a long, random password.',
            },
        });

        expect(wrapper.find('h2').text()).toBe('Update password');
        expect(wrapper.findComponent(MutedText).text()).toBe(
            'Use a long, random password.',
        );
    });

    it('does not render a description when none is provided', () => {
        const wrapper = mount(FormSectionHeader, {
            props: { heading: 'Update password' },
        });

        expect(wrapper.findComponent(MutedText).exists()).toBe(false);
    });
});
