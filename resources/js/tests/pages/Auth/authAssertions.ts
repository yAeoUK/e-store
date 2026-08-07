import type { VueWrapper } from '@vue/test-utils';
import { expect, it } from 'vitest';
import FormField from '@/components/FormField.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { getMockForm } from '../../setup';
import {
    expectBlocksSubmissionWithClientError,
    expectRendersPageTitle,
} from '../../utils';

export { expectBlocksSubmissionWithClientError, expectRendersPageTitle };

export function expectRendersWithinGuestLayout(wrapper: VueWrapper) {
    expect(wrapper.findComponent(GuestLayout).exists()).toBe(true);
}

export function expectPassesHeadingAndIconToGuestLayout(
    wrapper: VueWrapper,
    heading: string,
    icon: unknown,
) {
    const layout = wrapper.findComponent(GuestLayout);

    expect(layout.props('heading')).toBe(heading);
    expect(layout.props('icon')).toBe(icon);
}

export function expectRendersSubmitButton(wrapper: VueWrapper, text: string) {
    const button = wrapper.findComponent(PrimaryButton);

    expect(button.exists()).toBe(true);
    expect(button.text()).toBe(text);
}

export async function expectDisablesSubmitWhileProcessing(wrapper: VueWrapper) {
    getMockForm().processing = true;
    await wrapper.vm.$nextTick();

    expect(
        wrapper.findComponent(PrimaryButton).attributes('disabled'),
    ).not.toBeUndefined();
}

export function expectRendersRequiredFormFieldLabels(
    wrapper: VueWrapper,
    labels: string[],
) {
    const fields = wrapper.findAllComponents(FormField);

    expect(fields).toHaveLength(labels.length);
    labels.forEach((label, i) => {
        expect(fields[i].props('label')).toBe(label);
        expect(fields[i].props('required')).toBe(true);
    });
}

export async function expectPassesValidationErrorsToFields(
    wrapper: VueWrapper,
    errors: Record<string, string>,
) {
    getMockForm().errors = errors;
    await wrapper.vm.$nextTick();

    const fields = wrapper.findAllComponents(FormField);

    Object.values(errors).forEach((error, i) => {
        expect(fields[i].props('error')).toBe(error);
        expect(wrapper.text()).toContain(error);
    });
}

export async function expectPassesSingleFieldValidationError(
    wrapper: VueWrapper,
    fieldName: string,
    errorText: string,
) {
    await expectPassesValidationErrorsToFields(wrapper, {
        [fieldName]: errorText,
    });
}

export function itBehavesLikeGuestAuthPage(options: {
    mount: () => VueWrapper;
    titleKey: string;
    icon: unknown;
    iconName: string;
    submitKey: string;
}) {
    const { mount, titleKey, icon, iconName, submitKey } = options;

    it('renders within GuestLayout', () => {
        expectRendersWithinGuestLayout(mount());
    });

    it(`passes the heading and ${iconName} icon to GuestLayout`, () => {
        expectPassesHeadingAndIconToGuestLayout(mount(), titleKey, icon);
    });

    it('renders the page title via Head', () => {
        expectRendersPageTitle(mount(), titleKey);
    });

    it('renders the submit button', () => {
        expectRendersSubmitButton(mount(), submitKey);
    });

    it('disables the submit button while the form is processing', async () => {
        await expectDisablesSubmitWhileProcessing(mount());
    });
}
