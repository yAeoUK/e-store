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
    <Dropdown align="right">
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
