<template>
  <div class="flex h-screen bg-gray-100">
    <UserSidebar />
    <SecondarySidebar v-if="currentRoute === 'user-settings'" />
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import UserSidebar from '../components/layout/UserSidebar.vue';
import SecondarySidebar from '../components/layout/SecondarySidebar.vue';

const router = useRouter();
const authStore = useAuthStore();
const currentRoute = computed(() => router.currentRoute.value.name);

onMounted(() => {
  console.log('DefaultLayout montado');
  console.log('Usuário:', authStore.user);
  console.log('Permissões:', authStore.permissions);
});
</script>
