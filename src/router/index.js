import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SystemSetup from '../views/SystemSetup.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import SuperAdminPanel from '../views/SuperAdminPanel.vue'
import UsersManagement from '../views/admin/UsersManagement.vue'
import RolesManagement from '../views/admin/RolesManagement.vue'
import SystemSettings from '../views/admin/SystemSettings.vue'
import BrandingSettings from '../views/admin/settings/BrandingSettings.vue'
import { checkSystemStatus } from '@/utils/system'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: to => {
        const authStore = useAuthStore();
        if (authStore.hasPermission('manage_system')) {
          return '/admin';
        }
        return '/dashboard';
      }
    },
    {
      path: '/dashboard',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: HomeView
        },
        {
          path: 'chats',
          name: 'chats',
          component: () => import('../views/user/ChatsView.vue')
        },
        {
          path: 'contacts',
          name: 'contacts',
          component: () => import('../views/user/ContactsView.vue')
        },
        {
          path: 'favorites',
          name: 'favorites',
          component: () => import('../views/user/FavoritesView.vue')
        },
        {
          path: 'settings',
          name: 'user-settings',
          component: () => import('../views/user/UserSettings.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/setup',
      name: 'system-setup',
      component: SystemSetup,
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin',
          component: SuperAdminPanel
        },
        {
          path: 'users',
          name: 'users-management',
          component: UsersManagement
        },
        {
          path: 'roles',
          name: 'roles-management',
          component: RolesManagement
        },
        {
          path: 'settings',
          children: [
            {
              path: '',
              component: () => import('../views/admin/SystemSettings.vue'),
              meta: { requiresAuth: true, requiresAdmin: true }
            },
            {
              path: 'branding',
              component: BrandingSettings,
              meta: { 
                requiresAuth: true, 
                requiresAdmin: true,
                title: 'Configurações de Marca'
              }
            },
          ]
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  try {
    // Verifica o status do sistema usando GraphQL
    const systemStatus = await checkSystemStatus()
    console.log('System status:', systemStatus) // Debug

    // Se o sistema não estiver configurado e não estiver indo para setup
    if (!systemStatus.configured && to.name !== 'system-setup') {
      console.log('Sistema não configurado, redirecionando para setup') // Debug
      localStorage.removeItem('systemConfigured')
      return next('/setup')
    }

    // Se o sistema estiver configurado e estiver tentando acessar setup
    if (systemStatus.configured && to.name === 'system-setup') {
      console.log('Sistema já configurado, redirecionando para home') // Debug
      return next('/')
    }

    // Se o sistema estiver configurado, atualiza o localStorage
    if (systemStatus.configured) {
      localStorage.setItem('systemConfigured', 'true')
    }

    // Redireciona para login se não estiver autenticado
    if (requiresAuth && !isAuthenticated) {
      return next('/login')
    }

    // Se estiver autenticado e tentar acessar login/register, redireciona para home
    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      return next('/')
    }

    // Se for admin tentando acessar rotas de usuário normal, redireciona para painel admin
    if (authStore.hasPermission('manage_system') && to.path.startsWith('/dashboard')) {
      console.log('Admin tentando acessar rota de usuário, redirecionando para /admin')
      return next('/admin')
    }

    // Se não for admin tentando acessar rotas admin, redireciona para dashboard
    if (requiresAdmin && !authStore.hasPermission('manage_system')) {
      console.log('Acesso negado: requer permissão manage_system')
      return next('/dashboard')
    }

    next()
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error)
    // Em caso de erro, permite continuar mas loga o erro
    next()
  }
})

export default router
