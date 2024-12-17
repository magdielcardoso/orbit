import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { checkSystemStatus } from '@/utils/system'
import { formatAccountUrl } from '../utils/string'

// Função para gerar rotas automaticamente
function generateRoutes() {
  const views = import.meta.glob('../views/**/*.vue')
  const routes = [
    // Rota raiz com redirecionamento
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
    // Adiciona rota de login explicitamente
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    // Adiciona rota de setup explicitamente
    {
      path: '/setup',
      name: 'system-setup',
      component: () => import('../views/SystemSetup.vue'),
      meta: { requiresAuth: false }
    }
  ]

  // Processa todos os arquivos .vue
  for (const path in views) {
    const componentPath = path.replace('../views/', '').replace('.vue', '')
    const segments = componentPath.split('/')
    const name = segments.pop().toLowerCase().replace('view', '')

    // Ignora arquivos que começam com _ ou . e o LoginView que já foi adicionado
    if (name.startsWith('_') || name.startsWith('.') || componentPath === 'LoginView') continue

    // Configurações especiais baseadas no caminho
    if (path.includes('/user/')) {
      // Arquivos na pasta user viram filhos do dashboard
      continue // Serão tratados separadamente
    } else if (path.includes('/admin/')) {
      // Arquivos admin serão tratados separadamente
      continue
    } else if (componentPath === 'HomeView') {
      // Redireciona /homeview para dashboard
      routes.push({
        path: '/homeview',
        redirect: to => {
          const authStore = useAuthStore();
          if (!authStore.isAuthenticated) {
            return '/login';
          }
          return `/dashboard/${formatAccountUrl(authStore.user?.name)}`;
        }
      })
    } else {
      // Rotas públicas e outras
      routes.push({
        path: `/${componentPath.toLowerCase()}`,
        name,
        component: views[path],
        meta: {
          requiresAuth: !['register', 'system-setup'].includes(name)
        }
      })
    }
  }

  // Adiciona rota do dashboard com filhos dinâmicos
  routes.push({
    path: '/dashboard/:accountName',
    component: () => import('../layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: generateDashboardRoutes(views)
  })

  // Adiciona rota admin com filhos dinâmicos
  routes.push({
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: generateAdminRoutes(views)
  })

  return routes
}

// Função auxiliar para gerar rotas do dashboard
function generateDashboardRoutes(views) {
  const dashboardRoutes = [
    {
      path: '',
      name: 'dashboard',
      component: () => import('../views/HomeView.vue')
    }
  ]

  // Processa arquivos da pasta user
  for (const path in views) {
    if (path.includes('/user/')) {
      const fileName = path.split('/').pop().replace('.vue', '')
      const routeName = fileName.toLowerCase().replace('view', '')
      
      // Configura rota baseada no nome do arquivo
      const route = {
        path: routeName,
        name: routeName,
        component: views[path],
        meta: { requiresAuth: true }
      }

      // Configurações especiais para rotas específicas
      if (routeName === 'settings' || routeName === 'usersettings') {
        route.path = 'settings'
        route.name = 'user-settings'
      } else if (routeName === 'inboxsettings') {
        route.path = 'settings/inbox'
        route.name = 'inbox-settings'
      } else if (routeName === 'inboxsetup') {
        route.path = 'settings/inbox/new'
        route.name = 'inbox-setup'
      }

      dashboardRoutes.push(route)
    }
  }

  return dashboardRoutes
}

// Função auxiliar para gerar rotas admin
function generateAdminRoutes(views) {
  const adminRoutes = [
    {
      path: '',
      name: 'admin',
      component: () => import('../views/SuperAdminPanel.vue')
    },
    // Adiciona a rota de settings como um objeto separado
    {
      path: 'settings',
      name: 'admin-settings',
      component: () => import('../views/admin/SystemSettings.vue'),
      children: [
        {
          path: '',
          name: 'admin-settings-general',
          component: () => import('../views/admin/SystemSettings.vue')
        },
        {
          path: 'branding',
          name: 'admin-branding',
          component: () => import('../views/admin/settings/BrandingSettings.vue'),
          meta: { title: 'Configurações de Marca' }
        }
      ]
    }
  ]

  // Processa arquivos da pasta admin
  for (const path in views) {
    if (path.includes('/admin/')) {
      const segments = path.split('/')
      const fileName = segments.pop().replace('.vue', '')
      const routeName = fileName.toLowerCase().replace('view', '')
      
      // Pula arquivos de settings pois já foram configurados acima
      if (segments.includes('settings') || routeName === 'systemsettings') {
        continue
      }

      // Adiciona outras rotas admin
      adminRoutes.push({
        path: routeName.replace('management', ''),
        name: routeName,
        component: views[path]
      })
    }
  }

  return adminRoutes
}

// Cria o router
const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes()
})

// Guard de navegação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const publicRoutes = ['/login', '/register', '/setup']

  try {
    // Se não estiver autenticado e não for uma rota pública, redireciona para login
    if (!isAuthenticated && !publicRoutes.includes(to.path)) {
      console.log('Usuário não autenticado, redirecionando para login')
      return next('/login')
    }

    // Verifica o status do sistema usando GraphQL
    const systemStatus = await checkSystemStatus()
    console.log('System status:', systemStatus)

    // Se o sistema não estiver configurado e não estiver indo para setup
    if (!systemStatus.configured && to.name !== 'system-setup') {
      console.log('Sistema não configurado, redirecionando para setup')
      localStorage.removeItem('systemConfigured')
      return next('/setup')
    }

    // Se o sistema estiver configurado e estiver tentando acessar setup
    if (systemStatus.configured && to.name === 'system-setup') {
      console.log('Sistema já configurado, redirecionando para home')
      return next('/')
    }

    // Se o sistema estiver configurado, atualiza o localStorage
    if (systemStatus.configured) {
      localStorage.setItem('systemConfigured', 'true')
    }

    // Se já estiver autenticado, não permite acessar login/register
    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      const userName = formatAccountUrl(authStore.user?.name)
      return next(`/dashboard/${userName}`)
    }

    // Verifica acesso à conta
    if (to.path.startsWith('/dashboard/') && isAuthenticated) {
      const accountName = to.params.accountName
      const userName = formatAccountUrl(authStore.user?.name)
      const parentName = formatAccountUrl(authStore.user?.parentUser?.name)

      if (accountName !== userName && accountName !== parentName) {
        return next(`/dashboard/${userName}`)
      }
    }

    // Verifica permissão para rotas admin e redireciona para o dashboard do usuário
    if (requiresAdmin && !authStore.hasPermission('manage_system')) {
      console.log('Acesso negado: requer permissão manage_system')
      const userName = formatAccountUrl(authStore.user?.name)
      return next(`/dashboard/${userName}`)
    }

    next()
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error)
    next('/login')
  }
})

export default router
