import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CartIndexPage from '@/pages/Cart/Index.vue';
import { routeMock } from '../../setup';
import { expectRendersPageTitle } from '../../utils';

const cart = {
    id: 1,
    order_items: [
        {
            id: 1,
            quantity: 2,
            unit_price: 9.99,
            product: { id: 1, name: 'Wireless Mouse', slug: 'wireless-mouse' },
            product_variant: null,
        },
    ],
};

beforeEach(() => {
    routeMock.mockClear();
    vi.mocked(router.patch).mockClear();
});

function openQuantityDialog(wrapper: ReturnType<typeof mount>) {
    return wrapper
        .findAll('button')
        .find((button) => button.text() === 'shop.cart.editQuantity')
        ?.trigger('click');
}

describe('Cart index page', () => {
    it('renders the page title via Head', () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        expectRendersPageTitle(wrapper, 'shop.cart.pageTitle');
    });

    it('shows the empty state when the cart has no items', () => {
        const wrapper = mount(CartIndexPage, {
            props: { cart: { id: 1, order_items: [] } },
        });

        expect(wrapper.text()).toContain('shop.cart.empty');
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('opens the quantity dialog pre-filled with the item quantity', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);
        expect(
            (dialog.find('input[type="number"]').element as HTMLInputElement)
                .value,
        ).toBe('2');
    });

    it('saves a valid quantity via the cart.items.update route', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);
        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        await dialog.find('input[type="number"]').setValue(5);
        await dialog.vm.$emit('confirm');

        expect(routeMock).toHaveBeenCalledWith('cart.items.update', 1);
        expect(vi.mocked(router.patch)).toHaveBeenCalledWith(
            'cart.items.update',
            { quantity: 5 },
            expect.objectContaining({ preserveScroll: true }),
        );
    });

    it('blocks saving and shows a required error when the quantity is cleared', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);
        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        await dialog.find('input[type="number"]').setValue('');
        await dialog.vm.$emit('confirm');

        expect(router.patch).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain('validation.required');
        expect(dialog.props('show')).toBe(true);
    });

    it('blocks saving and shows a min error when the quantity is zero', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);
        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        await dialog.find('input[type="number"]').setValue(0);
        await dialog.vm.$emit('confirm');

        expect(router.patch).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain('validation.min');
    });

    it('blocks saving and shows an integer error when the quantity is a decimal', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);
        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        await dialog.find('input[type="number"]').setValue(1.5);
        await dialog.vm.$emit('confirm');

        expect(router.patch).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain('validation.integer');
    });

    it('increments and decrements the quantity, never going below 1', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);
        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });

        await dialog.find('input[type="number"]').setValue(1);
        await wrapper
            .findAll('button')
            .find(
                (button) =>
                    button.attributes('aria-label') ===
                    'shop.cart.decreaseQuantity',
            )
            ?.trigger('click');

        expect(
            (dialog.find('input[type="number"]').element as HTMLInputElement)
                .value,
        ).toBe('1');

        await wrapper
            .findAll('button')
            .find(
                (button) =>
                    button.attributes('aria-label') ===
                    'shop.cart.increaseQuantity',
            )
            ?.trigger('click');

        expect(
            (dialog.find('input[type="number"]').element as HTMLInputElement)
                .value,
        ).toBe('2');
    });

    it('resets the validation error state when the dialog is cancelled and reopened', async () => {
        const wrapper = mount(CartIndexPage, { props: { cart } });

        await openQuantityDialog(wrapper);
        let dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        await dialog.find('input[type="number"]').setValue('');
        await dialog.vm.$emit('confirm');
        expect(wrapper.text()).toContain('validation.required');

        await dialog.vm.$emit('cancel');
        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);

        await openQuantityDialog(wrapper);
        dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(wrapper.text()).not.toContain('validation.required');
    });
});
