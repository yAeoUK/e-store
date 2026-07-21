<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import FormCard from '@/Components/FormCard.vue';
import LongText from '@/Components/LongText.vue';
import ButtonLink from '@/Components/ButtonLink.vue';

const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);
</script>

<template>
  <FormCard>
    <div v-if="user" class="space-y-3">
      <p class="text-sm font-medium text-slate-900">
        Signed in as <span class="font-semibold">{{ user.name || user.email }}</span>
      </p>
      <div class="flex flex-wrap gap-3">
        <Link
          :href="route('account.profile.show')"
          class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Account
        </Link>
        <Link
          :href="route('account.addresses.index')"
          class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          Addresses
        </Link>
        <Link
          :href="route('account.orders')"
          class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          Order History
        </Link>
      </div>
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
