<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import imageCompression from 'browser-image-compression';
import { ref } from 'vue';
import type { AdminProductImage } from '@/components/admin/admin.ts';
import Card from '@/components/Card.vue';
import {
    accentBadgeTextClass,
    buttonVariants,
    mutedBorderClass,
    mutedTextClass,
} from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DangerButton from '@/components/DangerButton.vue';
import MutedText from '@/components/MutedText.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { t } from '@/i18n';

const props = defineProps<{
    productId: number;
    images: AdminProductImage[];
}>();

const form = useForm<{ images: File[] }>({ images: [] });
const compressing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

async function onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

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

const confirmingDeleteId = ref<number | null>(null);
const deleting = ref(false);

function confirmDelete(id: number): void {
    confirmingDeleteId.value = id;
}

function destroy(): void {
    if (confirmingDeleteId.value === null) {
        return;
    }

    deleting.value = true;

    router.delete(
        route('admin.products.images.destroy', [
            props.productId,
            confirmingDeleteId.value,
        ]),
        {
            preserveScroll: true,
            onFinish: () => {
                deleting.value = false;
                confirmingDeleteId.value = null;
            },
        },
    );
}

function setPrimary(id: number): void {
    router.post(
        route('admin.products.images.setPrimary', [props.productId, id]),
        {},
        { preserveScroll: true },
    );
}
</script>

<template>
    <div class="space-y-6">
        <h2 class="text-lg font-semibold">{{ t('admin.products.images') }}</h2>

        <Card class="overflow-hidden p-6">
            <MutedText v-if="images.length === 0" class="mb-4">
                {{ t('admin.products.empty') }}
            </MutedText>

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
                    <div
                        class="flex flex-wrap items-center justify-between gap-2"
                    >
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
                            {{ t('admin.products.setPrimary') }}
                        </SecondaryButton>
                        <DangerButton @click="confirmDelete(image.id)">
                            {{ t('common.delete') }}
                        </DangerButton>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <label :class="[buttonVariants.secondary, 'cursor-pointer']">
                    {{ t('admin.products.addImages') }}
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
                <p
                    v-if="compressing || form.processing"
                    :class="[mutedTextClass, 'mt-2 text-xs']"
                >
                    {{ t('admin.products.uploadingImages') }}
                </p>
            </div>
        </Card>

        <ConfirmationDialog
            :show="confirmingDeleteId !== null"
            :title="t('admin.products.deleteImageConfirmTitle')"
            :message="t('admin.products.deleteImageConfirmMessage')"
            :confirm-label="t('common.delete')"
            danger
            :processing="deleting"
            @confirm="destroy"
            @cancel="confirmingDeleteId = null"
        />
    </div>
</template>
