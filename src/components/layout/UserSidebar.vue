<template>
    <aside class="flex h-screen w-16 flex-col justify-between border-r border-base-300 bg-base-200 px-1.5 py-4">
      <div class="space-y-8">
        <!-- Logo -->
        <div class="flex justify-center text-smooth">
          <div class="tooltip tooltip-right" :data-tip="t('navigation.chats')">
            <MessageSquare class="h-5 w-5 text-primary" />
          </div>
        </div>
  
        <!-- Navigation -->
        <nav class="flex flex-col items-center space-y-2 text-smooth">
          <div class="tooltip tooltip-right" :data-tip="t('navigation.home')">
            <button
              @click="navigate('home')"
              :class="[
                'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
                currentRoute === 'home' ? 'btn-active' : ''
              ]"
            >
              <Home class="h-4 w-4" />
            </button>
          </div>
  
          <div class="tooltip tooltip-right" :data-tip="t('navigation.chats')">
            <button
              @click="navigate('chats')"
              :class="[
                'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
                currentRoute === 'chats' ? 'btn-active' : ''
              ]"
            >
              <MessageCircle class="h-4 w-4" />
            </button>
          </div>
  
          <div class="tooltip tooltip-right" :data-tip="t('navigation.contacts')">
            <button
              @click="navigate('contacts')"
              :class="[
                'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
                currentRoute === 'contacts' ? 'btn-active' : ''
              ]"
            >
              <Users class="h-4 w-4" />
            </button>
          </div>
  
          <div class="tooltip tooltip-right" :data-tip="t('navigation.favorites')">
            <button
              @click="navigate('favorites')"
              :class="[
                'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
                currentRoute === 'favorites' ? 'btn-active' : ''
              ]"
            >
              <Star class="h-4 w-4" />
            </button>
          </div>
        </nav>
      </div>
  
      <!-- Bottom Actions -->
      <div class="flex flex-col items-center space-y-4">
        <!-- Notifications -->
        <div class="relative notifications-menu-container">
          <div class="tooltip tooltip-right" :data-tip="t('navigation.notifications')">
            <button
              @click.stop="showNotificationsMenu = !showNotificationsMenu"
              :class="[
                'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased relative',
                currentRoute === 'notifications' ? 'btn-active' : ''
              ]"
            >
              <Bell class="h-4 w-4" />
              <span 
                v-if="hasNotifications" 
                class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-error"
              />
            </button>
          </div>
  
          <!-- Notifications Menu -->
          <NotificationsMenu
            :show="showNotificationsMenu"
            @close="showNotificationsMenu = false"
          />
        </div>
  
        <!-- Settings -->
        <div class="tooltip tooltip-right" :data-tip="t('navigation.settings')">
          <button
            @click="navigate('user-settings')"
            :class="[
              'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
              currentRoute === 'user-settings' ? 'btn-active' : ''
            ]"
          >
            <Settings class="h-4 w-4" />
          </button>
        </div>
  
        <!-- Avatar com Menu -->
        <div class="relative user-menu-container">
          <button 
            @click.stop="showUserMenu = !showUserMenu"
            class="avatar"
          >
            <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </button>
  
          <!-- Context Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute left-full bottom-0 ml-2 w-56 rounded-lg bg-base-100 p-2 shadow-lg ring-1 ring-base-content/10"
            @click.stop
          >
            <!-- User Info -->
            <div class="mb-2 border-b border-base-300 pb-2">
              <div class="px-2 py-1">
                <p class="font-medium">{{ authStore.user?.name }}</p>
                <p class="text-xs text-base-content/70">{{ authStore.user?.email }}</p>
              </div>
            </div>
  
            <!-- Availability Toggle -->
            <div class="flex items-center justify-between px-2 py-1">
              <span class="text-sm">
                {{ t('userMenu.availability') }}
              </span>
              <label class="swap">
                <input 
                  type="checkbox" 
                  v-model="isAvailable"
                  @change="toggleAvailability"
                />
                <div class="swap-on text-success">Online</div>
                <div class="swap-off text-base-content/50">Ausente</div>
              </label>
            </div>
  
            <!-- Menu Items -->
            <div class="space-y-1 border-t border-base-300 pt-2">
              <!-- Gestão da Plataforma (apenas para superadmin) -->
              <button 
                v-if="isSuperAdmin"
                @click="navigateToAdmin"
                class="flex w-full items-center justify-between px-3 py-2.5 mb-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg transition-all duration-200 group hover:from-purple-500/20 hover:to-blue-500/20"
              >
                <div class="flex items-center gap-3">
                  <div class="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
                    <Settings class="h-4 w-4 text-white" />
                  </div>
                  <span class="font-medium text-sm text-purple-500 text-left">Gestão da Plataforma</span>
                </div>
                <ArrowRight class="h-4 w-4 text-purple-400 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
  
              <!-- Profile -->
              <button 
                @click="navigate('profile')"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-base-200"
              >
                <User class="h-4 w-4" />
                {{ t('userMenu.profile') }}
              </button>
  
              <!-- Theme Menu Item -->
              <button 
                @click="showThemeModal = true; showUserMenu = false"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-base-200"
              >
                <Sun v-if="currentTheme === 'light'" class="h-4 w-4" />
                <Moon v-else class="h-4 w-4" />
                {{ t('userMenu.theme') }}
              </button>
  
              <!-- Help -->
              <button 
                @click="navigate('help')"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-base-200"
              >
                <HelpCircle class="h-4 w-4" />
                {{ t('userMenu.help') }}
              </button>
  
              <!-- Logout -->
              <button 
                @click="handleLogout"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-error hover:bg-error/10"
              >
                <LogOut class="h-4 w-4" />
                {{ t('userMenu.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Theme Modal -->
      <Teleport to="body">
        <ThemeModal
          :show="showThemeModal"
          :current-theme="currentTheme"
          @close="showThemeModal = false"
          @update:theme="handleThemeUpdate"
        />
      </Teleport>
    </aside>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useI18n } from '@/i18n/plugin'
  import { 
    MessageCircle, 
    Home, 
    Users, 
    Star,
    Settings,
    MessageSquare,
    Bell,
    LogOut,
    User,
    Moon,
    Sun,
    HelpCircle,
    ArrowRight
  } from 'lucide-vue-next'
  import ThemeModal from '../ui/ThemeModal.vue'
  import NotificationsMenu from '../ui/NotificationsMenu.vue'
  import { useAuthStore } from '../../stores/auth.store'
  
  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()
  const currentRoute = computed(() => router.currentRoute.value.name)
  
  const navigate = (route) => {
    if (route === currentRoute.value) return // Evita renavegar para a mesma rota
    router.push({ name: route })
  }
  
  // Mock de notificações - depois pode vir de um store
  const hasNotifications = ref(true)
  
  const isAvailable = ref(true)
  const showUserMenu = ref(false)
  
  const toggleAvailability = () => {
    isAvailable.value = !isAvailable.value
  }
  
  const closeMenu = () => {
    showUserMenu.value = false
  }
  
  async function handleLogout() {
    await authStore.logout()
    router.push('/login')
  }
  
  const showThemeModal = ref(false)
  const currentTheme = ref(localStorage.getItem('theme') || 'light')
  
  const handleThemeUpdate = (newTheme) => {
    currentTheme.value = newTheme
    showThemeModal.value = false
  }
  
  const showNotificationsMenu = ref(false)
  
  function handleClickOutside(event) {
    if (showUserMenu.value && !event.target.closest('.relative')) {
      showUserMenu.value = false
    }
  }
  
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  // Verifica se é superadmin
  const isSuperAdmin = computed(() => {
    return authStore.user?.role?.name === 'superadmin';
  });
  
  // Função para navegar para o painel admin
  const navigateToAdmin = () => {
    router.push('/admin');
    showUserMenu.value = false;
  };
  </script>
  <style scoped>
  .tooltip {
    --tooltip-offset: 4px;
    position: relative;
  }
  
  /* Ajusta o posicionamento da tooltip */
  .tooltip.tooltip-right:before {
    transform: translateY(-50%);
    top: 50%;
    right: auto;
    left: 100%;
    margin-left: var(--tooltip-offset);
  }
  
  /* Remove a seta da tooltip */
  .tooltip.tooltip-right:after {
    display: none;
  }
  
  /* Garante que a tooltip não seja cortada */
  .tooltip-right:hover:before {
    white-space: nowrap;
  }
  
  /* Animação do menu */
  .absolute {
    @apply transition-all duration-200;
    transform-origin: left bottom;
  }
  
  /* Remove o overlay invisível pois agora usamos click outside */
  .relative::before {
    display: none;
  }
  
  .relative:has(.absolute)::before {
    display: none;
  }
  </style>
  
  