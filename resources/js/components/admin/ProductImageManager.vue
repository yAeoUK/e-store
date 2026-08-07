<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { Plus, Star, Trash2 } from '@lucide/vue';
import imageCompression from 'browser-image-compression';
import { ref } from 'vue';
import type { AdminProductImage } from '@/components/admin/admin.ts';
import AdminListCard from '@/components/admin/AdminListCard.vue';
import AdminSection from '@/components/admin/AdminSection.vue';
import {
    accentBadgeTextClass,
    buttonVariants,
    hintTextClass,
    mutedBorderClass,
    wrapBetweenClass,
} from '@/components/classNames';
import DangerButton from '@/components/DangerButton.vue';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import IconLabel from '@/components/IconLabel.vue';
import InputError from '@/components/InputError.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { t, tp } from '@/i18n';
import type { Validator } from '@/lib/validation';
import { validateFields } from '@/lib/validation';

function filesRequired(field: string): Validator {
    return (value) =>
        Array.isArray(value) && value.length > 0
            ? null
            : tp('validation.filesRequired', { field });
}

function fileType(
    field: string,
    allowedMimes: string[],
    humanTypes: string,
): Validator {
    return (value) => {
        const files = value as File[] | undefined;

        if (!files || files.length === 0) {
            return null;
        }

        return files.every((file) => allowedMimes.includes(file.type))
            ? null
            : tp('validation.fileType', { field, types: humanTypes });
    };
}

function fileMaxSize(
    field: string,
    maxBytes: number,
    humanSize: string,
): Validator {
    return (value) => {
        const files = value as File[] | undefined;

        if (!files || files.length === 0) {
            return null;
        }

        return files.every((file) => file.size <= maxBytes)
            ? null
            : tp('validation.fileSize', { field, max: humanSize });
    };
}

const props = defineProps<{
    productId: number;
    images: AdminProductImage[];
}>();

const form = useForm<{ images: File[] }>({ images: [] });
const compressing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const fileError = ref<string | null>(null);

async function onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    const errors = validateFields(
        { images: files },
        {
            images: [
                filesRequired(t('admin.products.images')),
                fileType(
                    t('admin.products.images'),
                    ['image/jpeg', 'image/png', 'image/webp'],
                    'JPEG, PNG, WEBP',
                ),
                fileMaxSize(t('admin.products.images'), 5120 * 1024, '5 MB'),
            ],
        },
    );

    if (errors.images) {
        fileError.value = errors.images;

        return;
    }

    fileError.value = null;

    if (files.length === 0) {
        return;
    }

    compressing.value = true;

    try {
        form.images = await Promise.all(
            files.map((file) =>
                imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1600,
                    useWebWorker: true,
                }),
            ),
        );
    } finally {
        compressing.value = false;
    }

    form.post(route('admin.products.images.store', props.productId), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onFinish: () => {
            if (fileInput.value) {
                fileInput.value.value = '';
            }
        },
    });
}

const {
    confirmingId: confirmingDeleteId,
    deleting,
    confirmDelete,
    cancel,
    destroy,
} = useDeleteConfirmation((id: number) =>
    route('admin.products.images.destroy', [props.productId, id]),
);

function setPrimary(id: number): void {
    router.post(
        route('admin.products.images.setPrimary', [props.productId, id]),
        {},
        { preserveScroll: true },
    );
}
</script>

<template>
    <AdminSection :title="t('admin.products.images')">
        <AdminListCard
            :empty="images.length === 0"
            :empty-message="t('admin.products.empty')"
        >
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div
                    v-for="image in images"
                    :key="image.id"
                    :class="[mutedBorderClass, 'space-y-2 rounded border p-2']"
                >
                    <img
                        :src="image.url"
                        :alt="image.alt_text ?? ''"
                        class="aspect-square w-full rounded object-cover"
                    />
                    <div :class="wrapBetweenClass">
                        <span
                            v-if="image.is_primary"
                            :class="accentBadgeTextClass"
                        >
                            {{ t('admin.products.primaryLabel') }}
                        </span>
                        <SecondaryButton
                            v-else
                            type="button"
                            @click="setPrimary(image.id)"
                        >
                            <IconLabel :icon="Star">{{
                                t('admin.products.setPrimary')
                            }}</IconLabel>
                        </SecondaryButton>
                        <DangerButton @click="confirmDelete(image.id)">
                            <IconLabel :icon="Trash2">{{
                                t('common.delete')
                            }}</IconLabel>
                        </DangerButton>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <label :class="[buttonVariants.secondary, 'cursor-pointer']">
                    <IconLabel :icon="Plus">{{
                        t('admin.products.addImages')
                    }}</IconLabel>
                    <input
                        ref="fileInput"
                        type="file"
                        multiple
                        accept="image/*"
                        class="sr-only"
                        :disabled="compressing || form.processing"
                        @change="onFilesSelected"
                    />
                </label>
                <InputError :message="fileError || form.errors.images" />
                <p v-if="compressing || form.processing" :class="hintTextClass">
                    {{ t('admin.products.uploadingImages') }}
                </p>
            </div>
        </AdminListCard>

        <DeleteConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.products.deleteImageConfirmTitle')"
            :message="t('admin.products.deleteImageConfirmMessage')"
            :processing="deleting"
            @confirm="destroy"
            @cancel="cancel"
        />
    </AdminSection>
</template>
