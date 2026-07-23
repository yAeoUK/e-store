<script setup>
import { computed, ref } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import ButtonLink from '@/components/ButtonLink.vue';
import Dropdown from '@/components/Dropdown.vue';
import DropdownLink from '@/components/DropdownLink.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import MutedText from '@/components/MutedText.vue';
import { interactiveRowClass } from '@/components/classNames';
import { t } from '@/i18n';

const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);

const confirmingLogout = ref(false);
const loggingOut = ref(false);

const confirmLogout = () => {
    confirmingLogout.value = true;
};

const logout = () => {
    loggingOut.value = true;

    router.post(route('logout'), {}, {
        onFinish: () => {
            loggingOut.value = false;
            confirmingLogout.value = false;
        },
    });
};
</script>

<template>
  <div v-if="user" class="flex items-center justify-end gap-2">
    <MutedText>
      {{ t('common.nav.greeting') }} <span class="font-semibold">{{ user.name || user.email }}</span>
    </MutedText>
    <Dropdown align="right" width="48">
      <template #trigger>
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
      </template>

      <template #content>
        <DropdownLink :href="route('profile.edit')">{{ t('common.nav.profile') }}</DropdownLink>
        <DropdownLink :href="route('account.addresses.index')">{{ t('common.nav.addresses') }}</DropdownLink>
        <DropdownLink :href="route('account.orders')">{{ t('common.nav.orderHistory') }}</DropdownLink>
        <button
          type="button"
          :class="['block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out focus:bg-slate-100 focus:outline-none', interactiveRowClass]"
          @click="confirmLogout"
        >
          {{ t('common.nav.logOut') }}
        </button>
      </template>
    </Dropdown>

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

  <div v-else class="flex items-center justify-end gap-3">
    <ButtonLink :href="route('login')">{{ t('common.nav.logIn') }}</ButtonLink>
    <ButtonLink variant="primary" :href="route('register')">{{ t('common.nav.register') }}</ButtonLink>
  </div>
</template>
