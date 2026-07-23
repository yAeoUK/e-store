import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import Card from '@/components/Card.vue';
import LabelText from '@/components/LabelText.vue';
import MutedText from '@/components/MutedText.vue';
import PageContainer from '@/components/PageContainer.vue';
import SuccessText from '@/components/SuccessText.vue';

describe('presentational components', () => {
    it.each([
        ['Card', Card],
        ['PageContainer', PageContainer],
        ['LabelText', LabelText],
        ['MutedText', MutedText],
        ['SuccessText', SuccessText],
    ] as const)('%s mounts and renders its default slot', (_name, component) => {
        const wrapper = mount(component, {
            slots: { default: 'Slot content' },
        });

        expect(wrapper.text()).toContain('Slot content');
    });

    it('ApplicationLogo mounts without error and renders an svg', () => {
        const wrapper = mount(ApplicationLogo);

        expect(wrapper.find('svg').exists()).toBe(true);
    });
});
