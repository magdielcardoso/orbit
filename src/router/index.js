import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SystemSetup from '../views/SystemSetup.vue'
import { checkSystemStatus } from '@/utils/system'
import { formatAccountUrl } from '../utils/string'
import { dashboardRoutes } from './routes/dashboard.routes'
import { adminRoutes } from './routes/admin.routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      redirect: to => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          return '/login';
        }
        return `/dashboard/${formatAccountUrl(authStore.user?.name)}`;
      }
    },

    // Rotas do dashboard (User)  
    dashboardRoutes,

    // Rotas do admin
    adminRoutes,

    // Rotas de login e registro
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

  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  try {
    // Se não estiver autenticado e não for uma rota pública, redireciona para login
    //if (!isAuthenticated) {
    //  console.log('Usuário não autenticado, redirecionando para login')
    //  return next('/login')
    //}

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

    // Se já estiver autenticado, não permite acessar login/register
    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      const userName = formatAccountUrl(authStore.user?.name)
      return next(`/dashboard/`)
    }


    // Apenas verifica permissão para rotas admin, sem redirecionamento automático
    if (requiresAdmin && !authStore.hasPermission('manage_system')) {
      console.log('Acesso negado: requer permissão manage_system')
      return next('/dashboard')
    }

    next()
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error)
    next('/login')
  }
})

export default router
