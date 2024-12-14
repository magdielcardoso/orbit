<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Sidebar -->
    <div class="flex-none w-52 bg-gradient-to-b from-purple-900 to-purple-800 shadow-xl">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="h-14 border-b border-purple-700/50 px-3 flex items-center">
          <router-link to="/admin" class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-gradient-to-tr from-purple-500 to-purple-400 rounded-md flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span class="text-white font-bold text-[10px]">O</span>
            </div>
            <div class="flex flex-col">
              <span class="text-white text-xs font-bold leading-none">OrbitChat</span>
              <span class="text-purple-200 text-[9px] leading-tight">Painel Admin</span>
            </div>
          </router-link>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-2 py-3 space-y-2">
          <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.path"
            class="flex items-center px-2 py-2 text-purple-200 hover:bg-purple-700/50 rounded-md transition-all duration-200 group text-xs"
            :class="{ 'bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg shadow-purple-500/20': $route.path === item.path }"
          >
            <component 
              :is="item.icon" 
              class="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110"
              :class="$route.path === item.path ? 'animate-pulse' : ''" 
            />
            <span class="ml-2 font-medium">{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- User Info -->
        <div class="p-2 mx-2 mb-2 rounded-md bg-purple-700/30 backdrop-blur-sm">
          <div class="flex items-center space-x-1.5">
            <div class="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-500 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span class="text-white font-medium text-[10px]">
                {{ getUserInitials }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-medium text-[10px] truncate">{{ authStore.user?.name }}</p>
              <p class="text-purple-200 text-[9px] truncate">{{ authStore.userRole }}</p>
            </div>
            <button
              @click="handleLogout"
              class="p-1 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded-md transition-all duration-200 hover:shadow-lg"
              title="Sair"
            >
              <LogOut class="w-3.5 h-3.5" />
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
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { LayoutDashboard, Users, Shield, Settings, LogOut } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const menuItems = [
  {
    path: '/admin',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    path: '/admin/users',
    icon: Users,
    label: 'Usuários'
  },
  {
    path: '/admin/roles',
    icon: Shield,
    label: 'Papéis e Permissões'
  },
  {
    path: '/admin/settings',
    icon: Settings,
    label: 'Configurações'
  }
];

const getUserInitials = computed(() => {
  if (!authStore.user?.name) return '';
  return authStore.user.name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

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

<style scoped>
.router-link-active .animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}
</style> 