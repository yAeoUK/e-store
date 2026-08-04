import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import imageCompression from 'browser-image-compression';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductImageManager from '@/components/admin/ProductImageManager.vue';
import { getMockForm, routeMock } from '../../setup';

vi.mock('browser-image-compression', () => ({
    default: vi.fn(async (file: File) => file),
}));

const primaryImage = {
    id: 1,
    url: 'https://example.test/storage/products/1/one.jpg',
    alt_text: 'Front view',
    sort_order: 0,
    is_primary: true,
};

const secondaryImage = {
    id: 2,
    url: 'https://example.test/storage/products/1/two.jpg',
    alt_text: null,
    sort_order: 1,
    is_primary: false,
};

function findButton(wrapper: ReturnType<typeof mount>, text: string) {
    return wrapper.findAll('button').find((button) => button.text() === text);
}

async function selectFiles(wrapper: ReturnType<typeof mount>, files: File[]) {
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', {
        value: files,
        configurable: true,
    });
    await input.trigger('change');
}

beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    routeMock.mockClear();
    vi.mocked(router.delete).mockClear();
    vi.mocked(router.post).mockClear();
    vi.mocked(imageCompression).mockClear();
});

describe('ProductImageManager', () => {
    it('renders the heading, card, and upload control', () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 1, images: [] },
        });

        expect(wrapper.text()).toContain('admin.products.images');
        expect(wrapper.text()).toContain('admin.products.addImages');
        expect(wrapper.findComponent({ name: 'Card' }).exists()).toBe(true);
        expect(wrapper.find('input[type="file"]').exists()).toBe(true);
    });

    it('shows the empty state when there are no images', () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 1, images: [] },
        });

        expect(wrapper.text()).toContain('admin.products.empty');
        expect(wrapper.findComponent({ name: 'MutedText' }).exists()).toBe(
            true,
        );
        expect(wrapper.findAll('img')).toHaveLength(0);
    });

    it('renders one thumbnail per image and marks the primary one', () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 1, images: [primaryImage, secondaryImage] },
        });

        const images = wrapper.findAll('img');
        expect(images).toHaveLength(2);
        expect(images[0].attributes('src')).toBe(primaryImage.url);
        expect(images[0].attributes('alt')).toBe(primaryImage.alt_text);

        expect(wrapper.text()).toContain('admin.products.primaryLabel');
        expect(findButton(wrapper, 'admin.products.setPrimary')).toBeDefined();
        expect(
            wrapper.findAllComponents({ name: 'DangerButton' }),
        ).toHaveLength(2);
    });

    it('sets a non-primary image as primary via the setPrimary route', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 5, images: [primaryImage, secondaryImage] },
        });

        await findButton(wrapper, 'admin.products.setPrimary')?.trigger(
            'click',
        );

        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.images.setPrimary',
            [5, secondaryImage.id],
        );
        expect(vi.mocked(router.post)).toHaveBeenCalled();
    });

    it('opens the delete confirmation dialog and deletes on confirm', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 5, images: [primaryImage] },
        });

        await findButton(wrapper, 'common.delete')?.trigger('click');

        const dialog = wrapper.findComponent({ name: 'ConfirmationDialog' });
        expect(dialog.props('show')).toBe(true);
        expect(wrapper.text()).toContain(
            'admin.products.deleteImageConfirmTitle',
        );
        expect(wrapper.text()).toContain(
            'admin.products.deleteImageConfirmMessage',
        );

        await dialog.vm.$emit('confirm');

        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.images.destroy',
            [5, primaryImage.id],
        );
        expect(vi.mocked(router.delete)).toHaveBeenCalled();
    });

    it('does not delete when the dialog is cancelled', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 5, images: [primaryImage] },
        });

        await findButton(wrapper, 'common.delete')?.trigger('click');
        await wrapper
            .findComponent({ name: 'ConfirmationDialog' })
            .vm.$emit('cancel');

        expect(
            wrapper.findComponent({ name: 'ConfirmationDialog' }).props('show'),
        ).toBe(false);
        expect(router.delete).not.toHaveBeenCalled();
    });

    it('compresses every selected file before uploading it', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 9, images: [] },
        });

        const fileOne = new File(['a'], 'one.jpg', { type: 'image/jpeg' });
        const fileTwo = new File(['b'], 'two.png', { type: 'image/png' });

        await selectFiles(wrapper, [fileOne, fileTwo]);

        expect(vi.mocked(imageCompression)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(imageCompression)).toHaveBeenCalledWith(
            fileOne,
            expect.objectContaining({ maxSizeMB: 1, maxWidthOrHeight: 1600 }),
        );
        expect(vi.mocked(imageCompression)).toHaveBeenCalledWith(
            fileTwo,
            expect.objectContaining({ maxSizeMB: 1, maxWidthOrHeight: 1600 }),
        );

        expect(getMockForm().lastPostUrl).toBe('admin.products.images.store');
        expect(getMockForm().lastPostOptions?.forceFormData).toBe(true);
        expect(routeMock).toHaveBeenCalledWith(
            'admin.products.images.store',
            9,
        );
    });

    it('shows the uploading indicator while images are compressing', async () => {
        let resolveCompression: (file: File) => void = () => {};
        vi.mocked(imageCompression).mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolveCompression = resolve;
                }),
        );

        const wrapper = mount(ProductImageManager, {
            props: { productId: 9, images: [] },
        });

        expect(wrapper.text()).not.toContain('admin.products.uploadingImages');

        const file = new File(['a'], 'one.jpg', { type: 'image/jpeg' });
        await selectFiles(wrapper, [file]);

        expect(wrapper.text()).toContain('admin.products.uploadingImages');

        resolveCompression(file);
        await flushPromises();

        expect(wrapper.text()).not.toContain('admin.products.uploadingImages');
    });

    it('does nothing when the file input change fires with no files', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 9, images: [] },
        });

        await selectFiles(wrapper, []);

        expect(imageCompression).not.toHaveBeenCalled();
        expect(router.post).not.toHaveBeenCalled();
    });

    it('shows a validation error and never compresses when no files are selected', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 9, images: [] },
        });

        await selectFiles(wrapper, []);

        expect(imageCompression).not.toHaveBeenCalled();
        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.filesRequired');
    });

    it('shows a validation error and never compresses when a file has a disallowed mime type', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 9, images: [] },
        });

        const file = new File(['a'], 'one.gif', { type: 'image/gif' });
        await selectFiles(wrapper, [file]);

        expect(imageCompression).not.toHaveBeenCalled();
        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.fileType');
    });

    it('shows a validation error and never compresses when a file is oversized', async () => {
        const wrapper = mount(ProductImageManager, {
            props: { productId: 9, images: [] },
        });

        const file = new File(['a'], 'one.jpg', { type: 'image/jpeg' });
        Object.defineProperty(file, 'size', { value: 5120 * 1024 + 1 });
        await selectFiles(wrapper, [file]);

        expect(imageCompression).not.toHaveBeenCalled();
        expect(getMockForm().lastPostUrl).toBeUndefined();
        expect(wrapper.text()).toContain('validation.fileSize');
    });
});
