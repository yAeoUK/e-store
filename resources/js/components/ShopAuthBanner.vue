<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ButtonLink from '@/components/ButtonLink.vue';
import { endRowClass, interactiveRowClass } from '@/components/classNames';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import MutedText from '@/components/MutedText.vue';
import { t } from '@/i18n';

const dropdownItemBaseClass =
    'block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out focus:outline-none';

const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);

const confirmingLogout = ref(false);
const loggingOut = ref(false);
const menuOpen = ref(false);

const closeMenuOnEscape = (e: KeyboardEvent) => {
    if (menuOpen.value && e.key === 'Escape') {
        menuOpen.value = false;
    }
};

onMounted(() => document.addEventListener('keydown', closeMenuOnEscape));
onUnmounted(() => document.removeEventListener('keydown', closeMenuOnEscape));

const menuLinks = [
    { href: route('profile.edit'), label: t('common.nav.profile') },
    {
        href: route('account.addresses.index'),
        label: t('common.nav.addresses'),
    },
    { href: route('cart.index'), label: t('common.nav.cart') },
    { href: route('account.orders'), label: t('common.nav.orderHistory') },
];

const confirmLogout = () => {
    confirmingLogout.value = true;
};

const logout = () => {
    loggingOut.value = true;

    router.post(
        route('logout'),
        {},
        {
            onFinish: () => {
                loggingOut.value = false;
                confirmingLogout.value = false;
            },
        },
    );
};
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
                    <svg
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
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
                    class="absolute z-50 mt-2 w-48 rounded-md shadow-lg ltr:origin-top-right rtl:origin-top-left end-0"
                    style="display: none"
                    @click="menuOpen = false"
                >
                    <div
                        class="rounded-md py-1 ring-1 ring-border bg-popover text-popover-foreground"
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
                            {{ link.label }}
                        </Link>
                        <button
                            type="button"
                            :class="[dropdownItemBaseClass, interactiveRowClass]"
                            @click="confirmLogout"
                        >
                            {{ t('common.nav.logOut') }}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>

        <ConfirmationDialog
            :show="confirmingLogout"
            :title="t('common.nav.logoutConfirmTitle')"
            :message="t('common.nav.logoutConfirmMessage')"
            :confirm-label="t('common.nav.logOut')"
            danger
            :processing="loggingOut"
            @confirm="logout"
            @cancel="confirmingLogout = false"
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
