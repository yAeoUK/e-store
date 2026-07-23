import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormActions from '@/components/FormActions.vue';

describe('FormActions', () => {
    it('renders the default slot content', () => {
        const wrapper = mount(FormActions, {
            slots: { default: '<button>Save</button>' },
        });

        expect(wrapper.text()).toContain('Save');
    });
});
