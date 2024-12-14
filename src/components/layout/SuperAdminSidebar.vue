<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Sidebar -->
    <div class="flex-none w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-20 border-b border-slate-700/50">
          <router-link to="/admin" class="flex items-center space-x-3 px-4 py-2 rounded-xl">
            <div class="w-10 h-10 bg-gradient-to-tr from-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span class="text-white font-bold text-xl">O</span>
            </div>
            <div class="flex flex-col">
              <span class="text-white text-lg font-bold">OrbitChat</span>
              <span class="text-slate-400 text-xs">Painel Admin</span>
            </div>
          </router-link>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-4 py-8 space-y-2">
          <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.path"
            class="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
            :class="{ 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg shadow-blue-500/20': $route.path === item.path }"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110"
              :class="$route.path === item.path ? 'animate-pulse' : ''" 
            />
            <span class="font-medium">{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- User Info -->
        <div class="p-4 mx-4 mb-4 rounded-xl bg-slate-700/30 backdrop-blur-sm relative">
          <div class="flex items-center space-x-3">
            <button 
              @click="toggleUserMenu"
              class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
            >
              <span class="text-white font-medium">
                {{ getUserInitials }}
              </span>
            </button>
            <div class="flex-1">
              <p class="text-white font-medium text-sm">{{ authStore.user?.name }}</p>
              <p class="text-slate-400 text-xs">{{ authStore.userRole }}</p>
            </div>
            <button
              @click="handleLogout"
              class="p-2.5 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-xl transition-all duration-200 hover:shadow-lg"
              title="Sair"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>

          <!-- Menu de Contexto -->
          <div 
            v-if="showUserMenu"
            class="absolute bottom-full left-0 mb-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div class="py-1">
              <!-- Opção Gestão da Plataforma (apenas para superadmin) -->
              <router-link
                v-if="isSuperAdmin"
                to="/admin/platform"
                class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                <Settings class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                Gestão da Plataforma
              </router-link>

              <!-- Perfil -->
              <router-link
                to="/admin/profile"
                class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                <User class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                Perfil
              </router-link>

              <!-- Configurações -->
              <router-link
                to="/admin/settings"
                class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                <Settings class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                Configurações
              </router-link>

              <!-- Linha divisória -->
              <div class="h-px bg-gray-200 my-1"></div>

              <!-- Sair -->
              <button
                @click="handleLogout"
                class="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                <LogOut class="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Settings, 
  LogOut,
  User
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const showUserMenu = ref(false);

// Verifica se é superadmin
const isSuperAdmin = computed(() => {
  return authStore.user?.role?.name === 'superadmin';
});

// Toggle do menu de usuário
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// Fecha o menu quando clicar fora
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    showUserMenu.value = false;
  }
};

// Adiciona e remove event listener para fechar menu ao clicar fora
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

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

/* Animação para o menu de contexto */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 