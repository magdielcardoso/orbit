import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'app',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../views/Projects.vue')
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('../views/Tasks.vue')
      },
      {
        path: 'reporting',
        name: 'reporting',
        component: () => import('../views/Reporting.vue')
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('../views/Notifications.vue')
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('../views/Support.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/Settings.vue')
      },
      {
        path: 'chats',
        name: 'chats',
        component: () => import('../views/Chats.vue')
      },
      {
        path: 'contacts',
        name: 'contacts',
        component: () => import('../views/Contacts.vue')
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('../views/Favorites.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Rota requer autenticação
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Rota é apenas para visitantes (não autenticados)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
