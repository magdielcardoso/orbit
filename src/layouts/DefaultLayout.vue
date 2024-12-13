<template>
  <div class="flex h-screen bg-gray-100">
    <UserSidebar />
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import UserSidebar from '../components/layout/UserSidebar.vue';

const authStore = useAuthStore();

onMounted(() => {
  console.log('DefaultLayout montado');
  console.log('Usuário:', authStore.user);
  console.log('Permissões:', authStore.permissions);
});
</script>
