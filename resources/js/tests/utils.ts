// Shared test helpers for resources/js/tests are added here when multiple test files need the same constants or functions.

import type { FormDataConvertible } from '@inertiajs/core';
import type { InertiaForm } from '@inertiajs/vue3';
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import type { Component } from 'vue';
import SlugField from '@/components/admin/SlugField.vue';
import FormActions from '@/components/FormActions.vue';
import FormField from '@/components/FormField.vue';
import InputLabel from '@/components/InputLabel.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { Address, AddressSnapshot } from '@/types/address';
import type { OrderItem } from '@/types/order';
import { getMockForm, routeMock } from './setup';

export const defaultProducts = {
    data: [],
};

export function defaultAddress(overrides: Partial<Address> = {}): Address {
    return {
        id: 1,
        label: 'Home',
        name: 'Jane Doe',
        line1: '123 Main St',
        line2: null,
        city: 'Springfield',
        state: null,
        postal_code: '62704',
        country: 'US',
        phone: null,
        is_default: false,
        ...overrides,
    };
}

export function defaultAddressSnapshot(
    overrides: Partial<AddressSnapshot> = {},
): AddressSnapshot {
    const {
        label,
        name,
        line1,
        line2,
        city,
        state,
        postal_code,
        country,
        phone,
    } = defaultAddress(overrides);

    return {
        label,
        name,
        line1,
        line2,
        city,
        state,
        postal_code,
        country,
        phone,
    };
}

export function defaultOrderItem(
    overrides: Partial<OrderItem> = {},
): OrderItem {
    return {
        id: 1,
        quantity: 1,
        unit_price: '19.99',
        product_snapshot: {
            name: 'Widget',
            slug: 'widget',
            variant: null,
        },
        ...overrides,
    };
}

export function defaultOrder<T extends Record<string, unknown>>(
    overrides: T = {} as T,
) {
    return {
        id: 1,
        status: 'pending',
        total: '75.00',
        payment_method: 'cod',
        payment_status: 'unpaid',
        created_at: '2026-01-01T00:00:00.000Z',
        shipping_address_snapshot:
            defaultAddressSnapshot() as AddressSnapshot | null,
        customer_note: null as string | null,
        order_items: [defaultOrderItem({ unit_price: '75.00' })],
        ...overrides,
    };
}

export const defaultFilters = {
    search: '',
    category_id: null,
    min_price: null,
    max_price: null,
};

export const defaultCategories = [
    { id: 1, name: 'Accessories', slug: 'accessories' },
];

/**
 * Shared AdminCategoryRef fixture for form-fields tests that render a
 * category/parent select (CategoryFormFields, ProductFormFields).
 */
export const adminCategoryRefs = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
];

export function findButton(wrapper: ReturnType<typeof mount>, text: string) {
    return wrapper.findAll('button').find((button) => button.text() === text);
}

/**
 * Asserts that a page/form renders the given title via `<Head title="...">`.
 */
export function expectRendersPageTitle(wrapper: VueWrapper, title: string) {
    const head = wrapper.findComponent(Head);

    expect(head.exists()).toBe(true);
    expect(head.attributes('title')).toBe(title);
}

/**
 * Submits `wrapper`'s form and asserts client-side validation blocked the
 * request: no post/patch/put was issued and the given error key is shown.
 */
export async function expectBlocksSubmissionWithClientError(
    wrapper: VueWrapper,
    errorKey: string,
) {
    await wrapper.find('form').trigger('submit');

    expect(getMockForm().lastPostUrl).toBeUndefined();
    expect(wrapper.text()).toContain(errorKey);
}

/**
 * Runs the shared "emits submit when the form is submitted" assertion for
 * form-shell components (AdminResourceForm, EditFormModal): submitting the
 * form emits submit exactly once.
 */
export function testEmitsSubmitOnFormSubmit(
    mountComponent: () => ReturnType<typeof mount>,
) {
    it('emits submit when the form is submitted', async () => {
        const wrapper = mountComponent();

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toHaveLength(1);
    });
}

/**
 * Builds `makeForm`/`mountFields` helpers for a form-fields component
 * (AddressFormFields, CategoryFormFields, ProductFormFields,
 * VariantFormFields): `makeForm` merges overrides into the field defaults
 * via `useForm`, and `mountFields` mounts the component with that form plus
 * `errors: {}` and any other default props.
 */
export function createFieldsHarness<
    TForm extends Record<string, FormDataConvertible>,
>(
    component: Component,
    defaultForm: TForm,
    defaultProps: Record<string, unknown> = {},
) {
    function makeForm(overrides: Partial<TForm> = {}) {
        return (useForm as (data: TForm) => InertiaForm<TForm>)({
            ...defaultForm,
            ...overrides,
        } as TForm);
    }

    function mountFields(props: Record<string, unknown> = {}) {
        return mount(component, {
            props: { form: makeForm(), errors: {}, ...defaultProps, ...props },
        });
    }

    return { makeForm, mountFields };
}

/**
 * Runs the shared assertion that a form-fields component only forwards a
 * slug source to SlugField when autoSlug is enabled (CategoryFormFields,
 * ProductFormFields).
 */
export function testAutoSlugSourceProp(
    mountFields: (props?: Record<string, unknown>) => ReturnType<typeof mount>,
    makeForm: (overrides?: Record<string, unknown>) => unknown,
    name: string,
) {
    it('only passes a slug source when autoSlug is enabled', () => {
        const withoutAutoSlug = mountFields({ form: makeForm({ name }) });
        expect(
            withoutAutoSlug.findComponent(SlugField).props('source'),
        ).toBeUndefined();

        const withAutoSlug = mountFields({
            form: makeForm({ name }),
            autoSlug: true,
        });
        expect(withAutoSlug.findComponent(SlugField).props('source')).toBe(
            name,
        );
    });
}

/**
 * Runs the shared assertion that each key in `errors` is forwarded to the
 * FormField at the same index (ProductFormFields, VariantFormFields). A
 * `slug` key is forwarded to the SlugField instead (CategoryFormFields,
 * NameSlugFields), since slug errors never reach a plain FormField.
 */
export function testErrorsAssignedToFormFields(
    mountFields: (props?: Record<string, unknown>) => ReturnType<typeof mount>,
    errors: Record<string, string>,
) {
    it('passes each error to its matching field', () => {
        const wrapper = mountFields({ errors });
        const { slug, ...formFieldErrors } = errors;
        const fields = wrapper.findAllComponents(FormField);

        Object.values(formFieldErrors).forEach((message, i) => {
            expect(fields[i].props('error')).toBe(message);
        });

        if (slug !== undefined) {
            expect(wrapper.findComponent(SlugField).props('error')).toBe(slug);
        }
    });
}

/**
 * Builds a usePage() mock return value with the auth/errors/url shape most
 * page and layout tests need. `errors` and `url` are only included when
 * given, so components that never read them see the same shape as before.
 */
export function pageWith({
    user = null,
    errors,
    url,
}: {
    user?: Record<string, unknown> | null;
    errors?: Record<string, string>;
    url?: string;
} = {}) {
    return {
        props: {
            auth: { user },
            ...(errors === undefined ? {} : { errors }),
        },
        ...(url === undefined ? {} : { url }),
    } as unknown as ReturnType<typeof usePage>;
}

/**
 * Runs the shared assertions for components that follow the "labeled field"
 * contract (FormField, SelectField, TextareaField): a label rendered via
 * InputLabel and linked to the field element by a for/id pair, v-model
 * support, an error message slot, and a required asterisk marker.
 */
export function testLabeledFieldContract(
    component: Component,
    {
        label,
        elementSelector,
        classProp,
        setValue,
        expectedEmittedValue = setValue,
        slots,
        forwardedAttrs,
    }: {
        label: string;
        elementSelector: string;
        classProp: string;
        setValue: string;
        expectedEmittedValue?: unknown;
        slots?: Record<string, string>;
        forwardedAttrs?: Record<string, string | number>;
    },
) {
    function mountField(props: Record<string, unknown> = {}) {
        return mount(component, {
            props: { label, modelValue: '', ...props },
            ...(slots ? { slots } : {}),
        });
    }

    it('renders the label prop via InputLabel', () => {
        const wrapper = mountField();

        expect(wrapper.findComponent(InputLabel).props('value')).toBe(label);
    });

    it(`links the label to the ${elementSelector} via a matching for/id pair`, () => {
        const wrapper = mountField();

        const forAttr = wrapper.findComponent(InputLabel).attributes('for');

        expect(forAttr).toBeTruthy();
        expect(wrapper.get(elementSelector).attributes('id')).toBe(forAttr);
    });

    it('uses an explicit id when provided instead of generating one', () => {
        const wrapper = mountField({ id: 'field-id' });

        expect(wrapper.get(elementSelector).attributes('id')).toBe('field-id');
        expect(wrapper.findComponent(InputLabel).attributes('for')).toBe(
            'field-id',
        );
    });

    it(`renders the modelValue prop as the ${elementSelector} value`, () => {
        const wrapper = mountField({ modelValue: setValue });

        expect(
            (wrapper.get(elementSelector).element as HTMLInputElement).value,
        ).toBe(setValue);
    });

    it('emits update:modelValue when changed', async () => {
        const wrapper = mountField();

        await wrapper.get(elementSelector).setValue(setValue);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
            expectedEmittedValue,
        ]);
    });

    it('renders the error message when provided', () => {
        const wrapper = mountField({ error: 'This field is required.' });

        expect(wrapper.text()).toContain('This field is required.');
    });

    it('shows an asterisk marker on the label when required is true', () => {
        const wrapper = mountField({ required: true });

        // The marker is CSS ::after content, not a DOM text node, so it's
        // asserted via the marker class rather than rendered text.
        const labelComponent = wrapper.findComponent(InputLabel);
        expect(labelComponent.text()).toBe(label);
        expect(labelComponent.classes()).toContain("after:content-['*']");
    });

    it('does not show an asterisk on the label when required is omitted', () => {
        const wrapper = mountField();

        expect(wrapper.findComponent(InputLabel).text()).toBe(label);
    });

    it(`applies labelClass to the label and ${classProp} to the ${elementSelector}`, () => {
        const wrapper = mountField({
            labelClass: 'sr-only',
            [classProp]: 'w-3/4',
        });

        expect(wrapper.findComponent(InputLabel).classes()).toContain(
            'sr-only',
        );
        expect(wrapper.get(elementSelector).classes()).toContain('w-3/4');
    });

    if (forwardedAttrs) {
        it(`forwards arbitrary attributes like ${Object.keys(forwardedAttrs).join(', ')} to the ${elementSelector}`, () => {
            const wrapper = mount(component, {
                props: { label, modelValue: '' },
                attrs: forwardedAttrs,
            });

            for (const [attr, value] of Object.entries(forwardedAttrs)) {
                expect(wrapper.get(elementSelector).attributes(attr)).toBe(
                    String(value),
                );
            }
        });
    }
}

/**
 * Shorthand for `pageWith` when a test only needs to vary `url` (and
 * optionally `errors`) across mocks (AdminLayout, CategoryNavigation).
 */
export function pageWithUrl(url: string, errors?: Record<string, string>) {
    return pageWith({ errors, url });
}

/**
 * Runs the shared assertions for status-badge wrapper components
 * (OrderStatusBadge, PaymentStatusBadge): they forward status/variants to
 * StatusBadge and build the translation key from the given namespace.
 */
export function testStatusBadgeWrapperContract(
    component: Component,
    {
        statusesKey,
        variants,
        status,
    }: {
        statusesKey: string;
        variants: Record<string, string>;
        status: string;
    },
) {
    it(`passes the status and ${statusesKey} variants through to StatusBadge`, () => {
        const wrapper = mount(component, {
            props: { status, namespace: 'account.orders' },
        });

        expect(wrapper.findComponent(StatusBadge).props()).toEqual({
            status,
            translationKey: `account.orders.${statusesKey}`,
            variants,
        });
    });

    it('builds the translation key from the given namespace', () => {
        const wrapper = mount(component, {
            props: { status, namespace: 'admin.orders' },
        });

        expect(wrapper.findComponent(StatusBadge).props('translationKey')).toBe(
            `admin.orders.${statusesKey}`,
        );
    });
}

/**
 * Runs the shared assertions for a "delete row via ConfirmationDialog" flow
 * (ProductVariantManager, ProductImageManager): clicking the delete trigger
 * opens the dialog with the given title/message, confirming calls the
 * destroy route and router.delete, and cancelling leaves the row untouched.
 */
export function testDeleteConfirmationFlow(
    component: Component,
    {
        mountProps,
        deleteButtonText,
        title,
        message,
        confirmLabel,
        destroyRoute,
        destroyParams,
    }: {
        mountProps: Record<string, unknown>;
        deleteButtonText: string;
        title: string;
        message: string;
        confirmLabel?: string;
        destroyRoute: string;
        destroyParams: unknown;
    },
) {
    it('opens the delete confirmation dialog and deletes on confirm', async () => {
        const wrapper = mount(component, { props: mountProps });

        await findButton(wrapper, deleteButtonText)?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);
        expect(dialog.props('title')).toBe(title);
        expect(dialog.props('message')).toBe(message);

        if (confirmLabel) {
            expect(dialog.props('confirmLabel')).toBe(confirmLabel);
        }

        await dialog.vm.$emit('confirm');

        expect(routeMock).toHaveBeenCalledWith(destroyRoute, destroyParams);
        expect(vi.mocked(router.delete)).toHaveBeenCalled();
    });

    it('does not delete when the dialog is cancelled', async () => {
        const wrapper = mount(component, { props: mountProps });

        await findButton(wrapper, deleteButtonText)?.trigger('click');
        await wrapper
            .findComponent({ name: 'ConfirmationDialog' })
            .vm.$emit('cancel');

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);
        expect(router.delete).not.toHaveBeenCalled();
    });
}

/**
 * Runs the shared assertions for a "trigger action via ConfirmationDialog"
 * flow on a full page mount (Admin Categories/Products/Users index pages):
 * clicking the trigger button opens the dialog with the given title/message,
 * confirming runs `onConfirm`'s assertions, and cancelling leaves it untouched.
 * Unlike testDeleteConfirmationFlow, the page is remounted per assertion via
 * `mountPage` and the confirmed action isn't assumed to be a delete.
 */
export function testConfirmationDialogFlow(
    mountPage: () => ReturnType<typeof mount>,
    {
        triggerText,
        title,
        message,
        confirmLabel,
        onConfirm,
        onCancel,
    }: {
        triggerText: string;
        title: string;
        message: string;
        confirmLabel?: string;
        onConfirm: () => void;
        onCancel?: () => void;
    },
) {
    it('opens the confirmation dialog with the expected copy and confirms the action', async () => {
        const wrapper = mountPage();

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);

        await findButton(wrapper, triggerText)?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);
        expect(dialog.props('title')).toBe(title);
        expect(dialog.props('message')).toBe(message);

        if (confirmLabel) {
            expect(dialog.props('confirmLabel')).toBe(confirmLabel);
        }

        await dialog.vm.$emit('confirm');

        onConfirm();
    });

    it('does not perform the action when the dialog is cancelled', async () => {
        const wrapper = mountPage();

        await findButton(wrapper, triggerText)?.trigger('click');
        await wrapper
            .findComponent({ name: 'ConfirmationDialog' })
            .vm.$emit('cancel');

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);
        onCancel?.();
    });
}

/**
 * Runs the shared "renders an edit link for each row" assertion for admin
 * resource index pages (Categories, Products): each row's edit action links
 * to the given named route.
 */
export function testRendersEditLink(
    mountPage: () => ReturnType<typeof mount>,
    routeName: string,
) {
    it('renders an edit link for each row', () => {
        const wrapper = mountPage();

        const editLink = wrapper
            .findAll('a')
            .find((a) => a.text() === 'admin.actions.edit');

        expect(editLink?.attributes('href')).toBe(routeName);
    });
}

/**
 * Runs the shared "renders inside the expected layout and table components"
 * smoke test for admin resource index pages (Categories, Products, Orders,
 * Users): each given component name is present somewhere in the mounted
 * page.
 */
export function testRendersIndexLayout(
    mountPage: () => ReturnType<typeof mount>,
    names: string[],
) {
    it('renders inside the expected layout and table components', () => {
        const wrapper = mountPage();

        names.forEach((name) => {
            expect(wrapper.findComponent({ name }).exists()).toBe(true);
        });
    });
}

/**
 * Runs the shared "renders inside the expected layout and form components"
 * assertion for admin resource create/edit pages (Categories, Products):
 * AdminLayout, Card, FormActions, InputLabel, ButtonLink and PrimaryButton
 * are all present.
 */
export function testAdminResourceFormLayout(
    mountPage: () => ReturnType<typeof mount>,
) {
    it('renders inside the expected layout and form components', () => {
        const wrapper = mountPage();

        expect(wrapper.findComponent({ name: 'AdminLayout' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(true);
        expect(wrapper.findComponent(FormActions).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'InputLabel' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'ButtonLink' }).exists()).toBe(
            true,
        );
        expect(wrapper.findComponent({ name: 'PrimaryButton' }).exists()).toBe(
            true,
        );
    });
}

/**
 * Runs the shared "editing the name doesn't touch the slug" assertion for
 * admin resource edit pages (Categories, Products): unlike create pages,
 * edit pages never pass `autoSlug` so an existing slug must survive name
 * edits untouched.
 */
export function testSlugNotAutoSyncedOnEdit(
    mountPage: () => ReturnType<typeof mount>,
    { newName, expectedSlug }: { newName: string; expectedSlug: string },
) {
    it('does not auto-sync the slug when the name is edited', async () => {
        const wrapper = mountPage();

        await wrapper.find('input[type="text"]').setValue(newName);

        expect(getMockForm().slug).toBe(expectedSlug);
    });
}

/**
 * Runs the shared "submitting the form hits the update route" assertion for
 * admin resource edit pages (Categories, Products): submitting the form as
 * pre-filled calls the given named route with the resource id.
 */
export function testSubmitsToUpdateRoute(
    mountPage: () => ReturnType<typeof mount>,
    routeName: string,
    id: number,
) {
    it(`submits to the ${routeName} route`, async () => {
        const wrapper = mountPage();

        await wrapper.find('form').trigger('submit');

        expect(routeMock).toHaveBeenCalledWith(routeName, id);
    });
}

/**
 * Runs the shared "auto-fills the slug from the name" pair for admin
 * resource create pages (Categories, Products): while untouched, the slug
 * tracks the name field, and editing the slug manually via the Edit button
 * stops it tracking further name edits.
 */
export function testAutoSlugFromNameOnCreate(
    mountPage: () => ReturnType<typeof mount>,
    { name, expectedSlug }: { name: string; expectedSlug: string },
) {
    it('auto-fills the slug from the name while untouched', async () => {
        const wrapper = mountPage();

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue(name);

        expect(getMockForm().slug).toBe(expectedSlug);
        expect(wrapper.text()).toContain(expectedSlug);
    });

    it('stops auto-syncing once the slug is edited manually via the Edit button', async () => {
        const wrapper = mountPage();

        const nameInput = wrapper.find('input[type="text"]');
        await nameInput.setValue(name);

        const editButton = findButton(wrapper, 'admin.actions.edit');
        await editButton?.trigger('click');

        const slugInput = wrapper.findAll('input[type="text"]')[1];
        await slugInput.setValue('custom-slug');
        await nameInput.setValue(`${name} 2`);

        expect(getMockForm().slug).toBe('custom-slug');
    });
}

/**
 * Runs a single test that mounts `mountPage` and asserts its rendered text
 * contains every string in `labels`. Used for the many pages/forms that just
 * assert a batch of translation-key labels are present (column headers,
 * field labels, stat card captions, ...).
 */
export function testRendersLabels(
    mountPage: () => ReturnType<typeof mount>,
    labels: string[],
    testName = 'renders the expected labels',
) {
    it(testName, () => {
        const wrapper = mountPage();
        const text = wrapper.text();

        labels.forEach((label) => expect(text).toContain(label));
    });
}

/**
 * Runs the shared "server-flashed error banner" pair for pages that read a
 * named key off `usePage().props.errors` (Admin Admins/Categories index,
 * Admin Orders show): by default the message isn't shown, and mocking
 * usePage() to flash `errors[errorKey] = message` renders it. Pass
 * `skipDefaultCheck` when the page has no meaningful "by default" state to
 * assert (e.g. the message only ever renders conditionally on other props).
 */
export function testServerErrorFlash(
    mountPage: () => ReturnType<typeof mount>,
    {
        errorKey,
        message,
        pageProps = {},
        skipDefaultCheck = false,
    }: {
        errorKey: string;
        message: string;
        pageProps?: Record<string, unknown>;
        skipDefaultCheck?: boolean;
    },
) {
    if (!skipDefaultCheck) {
        it(`does not show the ${errorKey} error message by default`, () => {
            const wrapper = mountPage();

            expect(wrapper.text()).not.toContain(message);
        });
    }

    it(`shows the server error message when the server flashes a ${errorKey} error`, () => {
        vi.mocked(usePage).mockReturnValue(
            pageWith({ ...pageProps, errors: { [errorKey]: message } }),
        );

        const wrapper = mountPage();

        expect(wrapper.text()).toContain(message);
    });
}

/**
 * Runs the shared "binds category, stock, short description, description and
 * active status to the form" assertion for the Products create/edit pages:
 * only the mounted page and the expected category id vary between them.
 */
export function testBindsProductMiscFieldsToForm(
    mountPage: () => ReturnType<typeof mount>,
    { categorySelectValue }: { categorySelectValue: number },
) {
    it('binds category, stock, short description, description and active status to the form', async () => {
        const wrapper = mountPage();

        await wrapper.find('select').setValue(categorySelectValue);
        await wrapper.findAll('input[type="number"]')[1].setValue(7);
        await wrapper
            .findAll('input[type="text"]')[1]
            .setValue('Great for travel.');
        await wrapper.find('textarea').setValue('Full description.');
        await wrapper.find('input[type="checkbox"]').setValue(false);

        expect(getMockForm().category_id).toBe(categorySelectValue);
        expect(getMockForm().stock).toBe(7);
        expect(getMockForm().short_description).toBe('Great for travel.');
        expect(getMockForm().description).toBe('Full description.');
        expect(getMockForm().is_active).toBe(false);
    });
}
