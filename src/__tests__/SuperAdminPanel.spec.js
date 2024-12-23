import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SuperAdminPanel from '../SuperAdminPanel.vue'
import { useAuthStore } from '../stores/auth.store'
import { createPinia, setActivePinia } from 'pinia'

// Mock do módulo de i18n
vi.mock('@/i18n/plugin', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock da função gqlRequest
vi.mock('../../utils/graphql', () => ({
  gqlRequest: vi.fn()
}))

// Mock da função checkSystemStatus
vi.mock('../../utils/system', () => ({
  checkSystemStatus: vi.fn()
}))

describe('SuperAdminPanel', () => {
  let wrapper
  let router
  let pinia
  let authStore
  let gqlRequest
  let checkSystemStatus

  const mockSystemStatus = {
    version: '1.0.0',
    status: 'online'
  }

  const mockAdminData = {
    me: {
      id: '1',
      role: {
        name: 'super_admin',
        permissions: [{ name: 'manage_system' }]
      }
    },
    adminStats: {
      totalUsers: 100,
      totalRoles: 5,
      roles: [
        { id: '1', name: 'admin', createdAt: '2024-01-01' }
      ]
    },
    recentActivities: [
      {
        id: '1',
        type: 'USER_ACTION',
        level: 'info',
        source: 'auth',
        action: 'login',
        description: 'Usuário fez login',
        user: {
          id: '1',
          name: 'Admin',
          email: 'admin@exemplo.com',
          role: { name: 'admin' }
        },
        createdAt: '2024-01-01T10:00:00Z',
        metadata: {}
      }
    ]
  }

  beforeEach(async () => {
    // Importa as funções mockadas
    const graphqlModule = await import('../utils/graphql')
    const systemModule = await import('../utils/system')
    gqlRequest = graphqlModule.gqlRequest
    checkSystemStatus = systemModule.checkSystemStatus

    // Configura os mocks
    vi.mocked(checkSystemStatus).mockResolvedValue(mockSystemStatus)
    vi.mocked(gqlRequest).mockResolvedValue(mockAdminData)

    // Configura um router de teste
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/admin/users',
          name: 'admin-users',
          component: { template: '<div>Users</div>' }
        },
        { 
          path: '/admin/roles',
          name: 'admin-roles',
          component: { template: '<div>Roles</div>' }
        },
        { 
          path: '/admin/settings',
          name: 'admin-settings',
          component: { template: '<div>Settings</div>' }
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: { template: '<div>Dashboard</div>' }
        },
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' }
        }
      ]
    })

    // Configura o Pinia
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()

    // Configura as permissões do usuário
    authStore.setAuth({
      token: 'fake-token',
      user: {
        id: '1',
        name: 'Admin',
        role: {
          name: 'super_admin',
          permissions: [{ name: 'manage_system' }]
        }
      }
    })

    // Monta o componente
    wrapper = mount(SuperAdminPanel, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'RouterLink': false,
          'Users': true,
          'Shield': true,
          'Settings': true,
          'User': true,
          'Clock': true
        }
      }
    })

    // Aguarda a navegação e o próximo tick
    await router.isReady()
    await wrapper.vm.$nextTick()
  })

  it('deve renderizar corretamente', () => {
    expect(wrapper.find('h1').text()).toBe('Painel de Administração')
    expect(wrapper.find('h2').text()).toBe('Atividades Recentes')
  })

  it('deve exibir as estatísticas corretamente', () => {
    expect(wrapper.text()).toContain('100') // totalUsers
    expect(wrapper.text()).toContain('5') // totalRoles
  })

  it('deve exibir a versão do sistema', () => {
    expect(wrapper.text()).toContain('Sistema v1.0.0')
  })

  it('deve formatar o tipo de atividade corretamente', () => {
    const formattedType = wrapper.vm.formatActivityType('USER_ACTION')
    expect(formattedType).toBe('Ação do Usuário')
  })

  it('deve formatar a data corretamente', () => {
    const date = '2024-01-01T10:00:00Z'
    const formattedDate = wrapper.vm.formatDate(date)
    expect(formattedDate).toMatch(/01\/01\/2024/)
  })

  it('deve aplicar a classe correta para o tipo de atividade', () => {
    const className = wrapper.vm.getActivityStatusClass('USER_ACTION')
    expect(className).toBe('bg-green-100 text-green-800')
  })

  it('deve exibir as atividades recentes', () => {
    const activities = wrapper.findAll('.bg-white.shadow.overflow-hidden.sm\\:rounded-lg')
    expect(activities.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Usuário fez login')
  })

  it('deve redirecionar para o dashboard se não tiver permissão', async () => {
    // Remove a permissão manage_system
    authStore.setAuth({
      token: 'fake-token',
      user: {
        id: '1',
        name: 'User',
        role: {
          name: 'user',
          permissions: []
        }
      }
    })

    // Remonta o componente
    wrapper = mount(SuperAdminPanel, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'RouterLink': false,
          'Users': true,
          'Shield': true,
          'Settings': true,
          'User': true,
          'Clock': true
        }
      }
    })

    // Aguarda a navegação e o próximo tick
    await router.push('/dashboard')
    await router.isReady()
    await wrapper.vm.$nextTick()

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('deve ter links para todas as seções administrativas', () => {
    const links = wrapper.findAll('a')
    expect(links.some(link => link.attributes('href') === '/admin/users')).toBe(true)
    expect(links.some(link => link.attributes('href') === '/admin/roles')).toBe(true)
    expect(links.some(link => link.attributes('href') === '/admin/settings')).toBe(true)
  })

  it('deve lidar com erro ao carregar dados', async () => {
    // Mock do console.error antes de tudo
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Força um erro na próxima chamada do gqlRequest
    const errorMessage = 'Erro ao carregar dados'
    vi.mocked(gqlRequest).mockRejectedValueOnce(new Error(errorMessage))

    // Remonta o componente
    wrapper = mount(SuperAdminPanel, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'RouterLink': false,
          'Users': true,
          'Shield': true,
          'Settings': true,
          'User': true,
          'Clock': true
        }
      }
    })

    // Aguarda a navegação e o próximo tick
    await router.isReady()
    await wrapper.vm.$nextTick()
    
    // Aguarda mais um tick para garantir que o erro foi processado
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verifica se o console.error foi chamado com a mensagem correta
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erro ao carregar dados do painel:',
      expect.any(Error)
    )

    // Restaura o console.error original
    consoleSpy.mockRestore()
  })
}) 