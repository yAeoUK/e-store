<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import {
    ChevronDown,
    LogOut,
    MapPin,
    Package,
    ShoppingCart,
    User,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import ButtonLink from '@/components/ButtonLink.vue';
import { endRowClass, interactiveRowClass } from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import IconLabel from '@/components/IconLabel.vue';
import MutedText from '@/components/MutedText.vue';
import { useConfirmAction } from '@/composables/useConfirmAction';
import { useEscapeKey } from '@/composables/useEscapeKey';
import { t } from '@/i18n';

const dropdownItemBaseClass =
    'block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out focus:outline-none';

const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);

const {
    confirming: confirmingLogout,
    processing: loggingOut,
    confirm: confirmLogout,
    cancel: cancelLogout,
    run: logout,
} = useConfirmAction((_value, onFinish) => {
    router.post(route('logout'), {}, { onFinish });
});
const menuOpen = ref(false);

useEscapeKey(() => {
    menuOpen.value = false;
});

const menuLinks = [
    {
        href: route('profile.edit'),
        label: t('common.nav.profile'),
        icon: User,
    },
    {
        href: route('account.addresses.index'),
        label: t('common.nav.addresses'),
        icon: MapPin,
    },
    {
        href: route('cart.index'),
        label: t('common.nav.cart'),
        icon: ShoppingCart,
    },
    {
        href: route('account.orders'),
        label: t('common.nav.orderHistory'),
        icon: Package,
    },
];
</script>

<template>
    <div v-if="user" :class="endRowClass">
        <MutedText>
            {{ t('common.nav.greeting') }}
            <span class="font-semibold">{{ user.name || user.email }}</span>
        </MutedText>

        <div class="relative">
            <div @click="menuOpen = !menuOpen">
                <button
                    type="button"
                    class="inline-flex items-center rounded p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                    <ChevronDown class="h-4 w-4" />
                </button>
            </div>

            <div
                v-show="menuOpen"
                class="fixed inset-0 z-40"
                @click="menuOpen = false"
            ></div>

            <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div
                    v-show="menuOpen"
                    class="absolute end-0 z-50 mt-2 w-48 rounded-md shadow-lg ltr:origin-top-right rtl:origin-top-left"
                    style="display: none"
                    @click="menuOpen = false"
                >
                    <div
                        class="rounded-md bg-popover py-1 text-popover-foreground ring-1 ring-border"
                    >
                        <Link
                            v-for="link in menuLinks"
                            :key="link.href"
                            :href="link.href"
                            :class="[
                                dropdownItemBaseClass,
                                'text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            ]"
                        >
                            <IconLabel :icon="link.icon">{{
                                link.label
                            }}</IconLabel>
                        </Link>
                        <button
                            type="button"
                            :class="[
                                dropdownItemBaseClass,
                                interactiveRowClass,
                            ]"
                            @click="confirmLogout()"
                        >
                            <IconLabel :icon="LogOut">{{
                                t('common.nav.logOut')
                            }}</IconLabel>
                        </button>
                    </div>
                </div>
            </Transition>
        </div>

        <ConfirmationDialog
            :show="confirmingLogout !== null"
            :title="t('common.nav.logoutConfirmTitle')"
            :message="t('common.nav.logoutConfirmMessage')"
            :confirm-label="t('common.nav.logOut')"
            danger
            :processing="loggingOut"
            @confirm="logout"
            @cancel="cancelLogout"
        />
    </div>

    <div v-else :class="endRowClass">
        <ButtonLink :href="route('login')">{{
            t('common.nav.logIn')
        }}</ButtonLink>
        <ButtonLink variant="primary" :href="route('register')">{{
            t('common.nav.register')
        }}</ButtonLink>
    </div>
</template>
