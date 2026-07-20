import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProductFilters from '@/components/shop/ProductFilters.vue';

describe('ProductFilters', () => {
    const categories = [
        { id: 1, name: 'Accessories', slug: 'accessories' },
        { id: 2, name: 'Headphones', slug: 'headphones' },
    ];

    it('renders category options and default values', () => {
        const wrapper = mount(ProductFilters, {
            props: {
                categories,
                filters: {
                    search: 'keyboard',
                    category_id: 2,
                    min_price: 20,
                    max_price: 80,
                },
            },
        });

        const options = wrapper.findAll('option');

        expect(options[1].text()).toBe('Accessories');
        expect(options[2].text()).toBe('Headphones');
        expect(wrapper.get('input[type="text"]').element).toHaveProperty('value', 'keyboard');
        expect((wrapper.get('select').element as HTMLSelectElement).value).toBe('2');
    });

    it('emits apply with null values when fields are empty', async () => {
        const wrapper = mount(ProductFilters, {
            props: {
                categories,
                filters: {
                    search: '',
                    category_id: null,
                    min_price: null,
                    max_price: null,
                },
            },
        });

        await wrapper.get('form').trigger('submit.prevent');

        expect(wrapper.emitted('apply')).toBeTruthy();
        expect(wrapper.emitted('apply')?.[0][0]).toEqual({
            search: null,
            category_id: null,
            min_price: null,
            max_price: null,
        });
    });

    it('emits apply with current filter values when form is submitted', async () => {
        const wrapper = mount(ProductFilters, {
            props: {
                categories,
                filters: {
                    search: '',
                    category_id: null,
                    min_price: null,
                    max_price: null,
                },
            },
        });

        await wrapper.get('input[type="text"]').setValue('earbuds');
        await wrapper.get('select').setValue('1');
        const numberInputs = wrapper.findAll('input[type="number"]');
        await numberInputs[0].setValue('10');
        await numberInputs[1].setValue('99');
        await wrapper.get('form').trigger('submit.prevent');

        expect(wrapper.emitted('apply')?.[0][0]).toEqual({
            search: 'earbuds',
            category_id: 1,
            min_price: 10,
            max_price: 99,
        });
    });
});
