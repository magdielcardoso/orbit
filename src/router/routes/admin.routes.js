// Rotas do admin
export const adminRoutes = {
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    {
      path: '',
      name: 'admin',
      component: () => import('@/views/SuperAdminPanel.vue')
    },
    {
      path: 'users',
      name: 'users-management',
      component: () => import('@/views/admin/UsersManagement.vue')
    },
    {
      path: 'roles',
      name: 'roles-management',
      component: () => import('@/views/admin/RolesManagement.vue')
    },
    {
      path: 'connectors',
      name: 'connectors-management',
      component: () => import('@/views/admin/ConnectorsManagement.vue'),
      meta: { 
        requiresAuth: true, 
        requiresAdmin: true,
        title: 'Gerenciamento de Conectores'
      }
    },
    {
      path: 'settings',
      children: [
        {
          path: '',
          component: () => import('@/views/admin/SystemSettings.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'branding',
          component: () => import('@/views/admin/settings/BrandingSettings.vue'),
          meta: { 
            requiresAuth: true, 
            requiresAdmin: true,
            title: 'Configurações de Marca'
          }
        }
      ]
    }
  ]
} 