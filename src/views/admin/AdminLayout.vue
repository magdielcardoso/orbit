<template>
  <div class="flex h-screen bg-slate-50">
    <SuperAdminSidebar />
    <div class="flex-1 overflow-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import SuperAdminSidebar from '../../components/layout/SuperAdminSidebar.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // Verifica se o usuário tem permissão para acessar a área administrativa
  if (!authStore.hasPermission('manage_system')) {
    console.log('Usuário não tem permissão de admin, redirecionando...');
    router.push('/dashboard');
  }
});
</script> 