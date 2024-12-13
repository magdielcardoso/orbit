<template>
  <div class="flex h-screen bg-gray-100">
    <UserSidebar />
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import UserSidebar from '../components/layout/UserSidebar.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
</script>
