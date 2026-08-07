import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CategorySelectField from '@/components/admin/CategorySelectField.vue';
import SelectField from '@/components/SelectField.vue';
import { adminCategoryRefs } from '../../utils';

describe('CategorySelectField', () => {
    it('renders a none option followed by an option per category', () => {
        const wrapper = mount(CategorySelectField, {
            props: {
                label: 'Parent',
                noneLabel: 'No category',
                categories: adminCategoryRefs,
                modelValue: '',
            },
        });

        const options = wrapper.findAll('option');
        expect(options).toHaveLength(3);
        expect(options[0].text()).toBe('No category');
        expect(options[1].text()).toBe('Electronics');
        expect(options[2].text()).toBe('Furniture');
    });

    it('renders only the none option when categories is empty', () => {
        const wrapper = mount(CategorySelectField, {
            props: {
                label: 'Parent',
                noneLabel: 'No category',
                categories: [],
                modelValue: '',
            },
        });

        const options = wrapper.findAll('option');
        expect(options).toHaveLength(1);
        expect(options[0].text()).toBe('No category');
    });

    it('forwards the label to SelectField', () => {
        const wrapper = mount(CategorySelectField, {
            props: {
                label: 'Parent',
                noneLabel: 'No category',
                categories: adminCategoryRefs,
                modelValue: '',
            },
        });

        expect(wrapper.findComponent(SelectField).props('label')).toBe(
            'Parent',
        );
    });

    it('renders the modelValue as the select value and emits updates', async () => {
        const wrapper = mount(CategorySelectField, {
            props: {
                label: 'Parent',
                noneLabel: 'No category',
                categories: adminCategoryRefs,
                modelValue: 1,
            },
        });

        expect((wrapper.get('select').element as HTMLSelectElement).value).toBe(
            '1',
        );

        await wrapper.get('select').setValue('2');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    });
});
