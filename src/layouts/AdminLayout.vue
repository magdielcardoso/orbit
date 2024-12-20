<template>
  <div class="flex h-screen bg-slate-50">
    <SuperAdminSidebar v-if="canAccessAdmin" />
    <div class="flex-1 overflow-auto">
      <router-view v-if="canAccessAdmin"></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import SuperAdminSidebar from '../components/layout/SuperAdminSidebar.vue';

const router = useRouter();
const authStore = useAuthStore();
const canAccessAdmin = ref(false);

// Função para verificar permissões
async function checkAdminAccess() {
  try {
    if (!authStore.isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando...');
      router.push('/login');
      return;
    }

    if (!authStore.hasPermission('manage_system')) {
      console.log('Usuário não tem permissão de admin, redirecionando...');
      router.push('/dashboard');
      return;
    }

    canAccessAdmin.value = true;
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    router.push('/dashboard');
  }
}

// Verifica permissões ao montar o componente
onMounted(checkAdminAccess);

// Observa mudanças no estado de autenticação
watch(() => authStore.isAuthenticated, (newValue) => {
  if (!newValue) {
    canAccessAdmin.value = false;
    router.push('/login');
  } else {
    checkAdminAccess();
  }
});

// Observa mudanças nas permissões do usuário
watch(() => authStore.user?.role?.permissions, () => {
  checkAdminAccess();
}, { deep: true });
</script> 