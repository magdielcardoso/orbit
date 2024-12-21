// Rotas do dashboard (User)
export const dashboardRoutes = {
  path: '/dashboard/:accountName',
  component: () => import('@/layouts/DefaultLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      name: 'dashboard',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: 'kanban',
      name: 'kanban',
      component: () => import('@/views/user/KanbanView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'chats',
      name: 'chats',
      component: () => import('@/views/user/ChatsView.vue')
    },
    {
      path: 'contacts',
      name: 'contacts',
      component: () => import('@/views/user/ContactsView.vue')
    },
    {
      path: 'favorites',
      name: 'favorites',
      component: () => import('@/views/user/FavoritesView.vue')
    },
    {
      path: 'settings',
      name: 'user-settings',
      component: () => import('@/views/user/UserSettings.vue')
    },
    {
      path: 'settings/inbox',
      name: 'inbox-settings',
      component: () => import('@/views/user/InboxSettings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'settings/inbox/new',
      name: 'inbox-setup',
      component: () => import('@/views/user/InboxSetup.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/inbox/:id/connect',
      name: 'whatsapp-connect',
      component: () => import('@/views/user/WhatsappConnect.vue'),
      meta: {
        requiresAuth: true,
      }
    },
  ]
} 