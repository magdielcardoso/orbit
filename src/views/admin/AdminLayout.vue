<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="flex-none w-64 bg-gray-800">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 bg-gray-900">
          <router-link to="/admin" class="text-white text-xl font-bold">
            OrbitChat Admin
          </router-link>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-2 py-4 space-y-2">
          <router-link
            to="/admin"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            :class="{ 'bg-gray-700 text-white': $route.path === '/admin' }"
          >
            <LayoutDashboard class="w-5 h-5 mr-3" />
            Dashboard
          </router-link>

          <router-link
            to="/admin/users"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            :class="{ 'bg-gray-700 text-white': $route.path === '/admin/users' }"
          >
            <Users class="w-5 h-5 mr-3" />
            Usuários
          </router-link>

          <router-link
            to="/admin/roles"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            :class="{ 'bg-gray-700 text-white': $route.path === '/admin/roles' }"
          >
            <Shield class="w-5 h-5 mr-3" />
            Papéis e Permissões
          </router-link>

          <router-link
            to="/admin/settings"
            class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            :class="{ 'bg-gray-700 text-white': $route.path === '/admin/settings' }"
          >
            <Settings class="w-5 h-5 mr-3" />
            Configurações
          </router-link>
        </nav>

        <!-- User Info -->
        <div class="p-4 border-t border-gray-700">
          <div class="flex items-center">
            <div class="flex-1 text-sm">
              <p class="text-white font-medium">{{ authStore.user?.name }}</p>
              <p class="text-gray-400">{{ authStore.userRole }}</p>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-white rounded-md"
              title="Sair"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { LayoutDashboard, Users, Shield, Settings, LogOut } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  console.log('AdminLayout montado');
  console.log('Usuário tem permissão manage_system:', authStore.hasPermission('manage_system'));
  // Verifica se o usuário tem permissão para acessar a área administrativa
  if (!authStore.hasPermission('manage_system')) {
    console.log('Usuário não tem permissão de admin, redirecionando...');
    router.push('/dashboard');
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script> 