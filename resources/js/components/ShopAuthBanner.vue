<script setup>
import { computed, ref } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import FormCard from '@/Components/FormCard.vue';
import LongText from '@/Components/LongText.vue';
import ButtonLink from '@/Components/ButtonLink.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import ConfirmationDialog from '@/Components/ConfirmationDialog.vue';

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
  <FormCard>
    <div v-if="user" class="space-y-3">
      <div class="flex flex-wrap items-center gap-1">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Signed in as <span class="font-semibold">{{ user.name || user.email }}</span>
        </p>
        <Dropdown align="left" width="48">
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
            <DropdownLink :href="route('profile.edit')">Profile</DropdownLink>
            <DropdownLink :href="route('account.addresses.index')">Addresses</DropdownLink>
            <DropdownLink :href="route('account.orders')">Order History</DropdownLink>
            <button
              type="button"
              class="block w-full px-4 py-2 text-start text-sm leading-5 text-slate-700 transition duration-150 ease-in-out hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
              @click="confirmLogout"
            >
              Log Out
            </button>
          </template>
        </Dropdown>
      </div>

      <ConfirmationDialog
        :show="confirmingLogout"
        title="Log out?"
        message="You'll need to log in again to access your account, cart, and order history."
        confirm-label="Log Out"
        danger
        :processing="loggingOut"
        @confirm="logout"
        @cancel="confirmingLogout = false"
      />
    </div>

    <div v-else class="space-y-3">
      <LongText>Want to save your cart and access orders faster?</LongText>
      <div class="flex flex-wrap gap-3">
        <ButtonLink :href="route('login')">Log in</ButtonLink>
        <ButtonLink variant="primary" :href="route('register')">Register</ButtonLink>
      </div>
    </div>
  </FormCard>
</template>
