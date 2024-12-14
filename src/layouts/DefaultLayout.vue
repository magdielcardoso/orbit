<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar para usuários normais -->
    <UserSidebar v-if="!isAdmin" />
    
    <!-- Sidebar para admin -->
    <SuperAdminSidebar v-if="isAdmin">
      <template #default>
        <router-view />
      </template>
    </SuperAdminSidebar>

    <!-- Conteúdo principal (apenas para usuários normais, pois o admin já tem slot) -->
    <div v-if="!isAdmin" class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import UserSidebar from '../components/layout/UserSidebar.vue';
import SuperAdminSidebar from '../components/layout/SuperAdminSidebar.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAdmin = computed(() => {
  return authStore.hasPermission('manage_system');
});

const redirectBasedOnRole = () => {
  const currentPath = route.path;
  
  if (isAdmin.value && currentPath.startsWith('/dashboard')) {
    router.push('/admin');
  }
  
  if (!isAdmin.value && currentPath.startsWith('/admin')) {
    router.push('/dashboard');
  }
};

watch(route, redirectBasedOnRole);

onMounted(async () => {
  // Verifica autenticação ao montar o componente
  await authStore.checkAuth();
  redirectBasedOnRole();
});
</script>
