import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
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
})

export default router
