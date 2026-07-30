import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductVariantManager from '@/components/admin/ProductVariantManager.vue';
import VariantOptionsEditor from '@/components/admin/VariantOptionsEditor.vue';
import Card from '@/components/Card.vue';
import { getMockForm, routeMock } from '../../setup';

const variant = {
    id: 1,
    sku: 'SKU-RED-M',
    options: { color: 'Red', size: 'M' },
    price: 24.99,
    stock: 5,
    is_active: true,
};

function findButton(wrapper: ReturnType<typeof mount>, text: string) {
    return wrapper.findAll('button').find((button) => button.text() === text);
}

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
    vi.mocked(router.delete).mockClear();
    vi.mocked(router.post).mockClear();
});

describe('ProductVariantManager', () => {
    it('shows the empty state when there are no variants', () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [] },
        });

        expect(wrapper.text()).toContain('admin.products.empty');
        expect(wrapper.findAll('li')).toHaveLength(0);
    });

    it('renders one row per variant with its sku, options, price, and stock', () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [variant] },
        });

        const row = wrapper.find('li');
        expect(row.text()).toContain('SKU-RED-M');
        expect(row.text()).toContain('color: Red, size: M');
        expect(row.text()).toContain('$24.99');
        expect(row.text()).toContain('admin.products.stock');
        expect(row.text()).toContain('5');
    });

    it('renders the variant list and add-variant form inside Cards', () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [variant] },
        });

        expect(wrapper.findAllComponents(Card)).toHaveLength(2);
    });

    it('renders the add-variant form heading, fields, and submit button', () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [] },
        });

        const heading = wrapper.find('h3');
        expect(heading.text()).toBe('admin.products.addVariant');

        expect(wrapper.text()).toContain('admin.products.sku');
        expect(wrapper.text()).toContain('admin.products.variantPrice');
        expect(wrapper.text()).toContain('admin.products.variantPriceHint');
        expect(wrapper.text()).toContain('admin.products.options');
        expect(wrapper.text()).toContain('admin.products.isActive');

        const submitButton = findButton(wrapper, 'admin.products.addVariant');
        expect(submitButton?.exists()).toBe(true);
    });

    it('shows an inactive marker for an inactive variant', () => {
        const wrapper = mount(ProductVariantManager, {
            props: {
                productId: 1,
                variants: [{ ...variant, is_active: false }],
            },
        });

        expect(wrapper.text()).toContain('admin.products.isInactive');
    });

    it('submits the add-variant form to the variants.store route', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 7, variants: [] },
        });

        await wrapper.findAll('form')[0].trigger('submit');

        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.variants.store',
            7,
        );
    });

    it('clears the options editor after a successful add submission', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 7, variants: [] },
        });

        const optionsEditor = wrapper.findComponent(VariantOptionsEditor);
        const addOptionButton = optionsEditor
            .findAll('button')
            .find((b) => b.text() === 'admin.products.addOption');
        await addOptionButton?.trigger('click');

        const rowInputs = wrapper
            .findComponent(VariantOptionsEditor)
            .findAll('input');
        await rowInputs[0].setValue('color');
        await rowInputs[1].setValue('Blue');

        expect(
            wrapper
                .findAll('button')
                .filter((b) => b.text() === 'admin.products.removeOption'),
        ).toHaveLength(1);

        await wrapper.findAll('form')[0].trigger('submit');
        await wrapper.vm.$nextTick();

        expect(
            wrapper
                .findAll('button')
                .filter((b) => b.text() === 'admin.products.removeOption'),
        ).toHaveLength(0);
    });

    it('opens the edit modal pre-filled with the variant values', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [variant] },
        });

        await findButton(wrapper, 'admin.actions.edit')?.trigger('click');

        const modal = wrapper.findComponent({ name: 'Modal' });
        expect(modal.props('show')).toBe(true);
        expect(modal.text()).toContain('admin.products.editVariant');
        expect(modal.text()).toContain('admin.products.save');

        const editForm = getMockForm(1);
        expect(editForm.sku).toBe(variant.sku);
        expect(editForm.options).toEqual(variant.options);
        expect(editForm.price).toBe(variant.price);
        expect(editForm.stock).toBe(variant.stock);
        expect(editForm.is_active).toBe(true);
    });

    it('submits the edit form to the variants.update route and closes the modal', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 3, variants: [variant] },
        });

        await findButton(wrapper, 'admin.actions.edit')?.trigger('click');
        await wrapper
            .findComponent({ name: 'Modal' })
            .find('form')
            .trigger('submit');

        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.variants.update',
            [3, variant.id],
        );
        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
    });

    it('closes the edit modal without submitting when cancelled', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [variant] },
        });

        await findButton(wrapper, 'admin.actions.edit')?.trigger('click');
        await findButton(wrapper, 'common.cancel')?.trigger('click');

        expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(
            false,
        );
        expect(routeMock).not.toHaveBeenCalledWith(
            'admin.products.variants.update',
            expect.anything(),
        );
    });

    it('opens the delete confirmation dialog and deletes on confirm', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 9, variants: [variant] },
        });

        await findButton(wrapper, 'admin.actions.delete')?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);
        expect(dialog.props('title')).toBe(
            'admin.products.deleteVariantConfirmTitle',
        );
        expect(dialog.props('message')).toBe(
            'admin.products.deleteVariantConfirmMessage',
        );
        expect(dialog.props('confirmLabel')).toBe('common.delete');

        await dialog.vm.$emit('confirm');

        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.variants.destroy',
            [9, variant.id],
        );
        expect(vi.mocked(router.delete)).toHaveBeenCalled();
    });

    it('does not delete when the dialog is cancelled', async () => {
        const wrapper = mount(ProductVariantManager, {
            props: { productId: 1, variants: [variant] },
        });

        await findButton(wrapper, 'admin.actions.delete')?.trigger('click');
        await wrapper
            .findComponent({ name: 'ConfirmationDialog' })
            .vm.$emit('cancel');

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);
        expect(router.delete).not.toHaveBeenCalled();
    });
});
