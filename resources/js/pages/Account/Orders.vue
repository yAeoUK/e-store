<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Card from '@/components/Card.vue';
import { headingTextClass } from '@/components/classNames';
import MutedText from '@/components/MutedText.vue';
import { t } from '@/i18n';
import ShopLayout from '@/Layouts/ShopLayout.vue';
</script>

<template>
    <ShopLayout>
        <Head :title="t('account.orders.pageTitle')" />

        <template #header>
            <h2
                :class="[
                    'text-xl leading-tight font-semibold',
                    headingTextClass,
                ]"
            >
                {{ t('account.orders.pageTitle') }}
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <Card class="overflow-hidden p-6">
                    <MutedText>
                        {{ t('account.orders.placeholder') }}
                    </MutedText>
                </Card>
            </div>
        </div>
    </ShopLayout>
</template>
