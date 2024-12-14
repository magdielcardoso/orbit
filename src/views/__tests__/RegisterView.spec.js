import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../RegisterView.vue'
import { useAuthStore } from '../../stores/auth.store'
import { createPinia, setActivePinia } from 'pinia'

// Mock do módulo de i18n
vi.mock('@/i18n/plugin', () => ({
  useI18n: () => ({
    t: (key) => key // Retorna a própria chave para simplificar os testes
  })
}))

// Mock da função gqlRequest
vi.mock('../../utils/graphql', () => ({
  gqlRequest: vi.fn()
}))

// Mock da função formatAccountUrl
vi.mock('../../utils/string', () => ({
  formatAccountUrl: (name) => name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '-') // Substitui espaços por hífens
}))

describe('RegisterView', () => {
  let wrapper
  let router
  let pinia

  beforeEach(() => {
    // Configura um router de teste
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/dashboard/:account',
          name: 'dashboard',
          component: { template: '<div>Dashboard</div>' }
        },
        { 
          path: '/login',
          name: 'login',
          component: { template: '<div>Login</div>' }
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

    // Monta o componente com as dependências necessárias
    wrapper = mount(RegisterView, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'LocaleSelector': true,
          'Eye': true,
          'EyeOff': true,
          'RouterLink': false // Não fazer stub do RouterLink
        }
      }
    })
  })

  it('deve renderizar corretamente', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('deve atualizar o v-model do nome quando digitado', async () => {
    const nameInput = wrapper.find('#name')
    await nameInput.setValue('João Silva')
    expect(wrapper.vm.form.name).toBe('João Silva')
  })

  it('deve atualizar o v-model do email quando digitado', async () => {
    const emailInput = wrapper.find('#email')
    await emailInput.setValue('joao@exemplo.com')
    expect(wrapper.vm.form.email).toBe('joao@exemplo.com')
  })

  it('deve atualizar o v-model da senha quando digitada', async () => {
    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('senha123')
    expect(wrapper.vm.form.password).toBe('senha123')
  })

  it('deve alternar a visibilidade da senha quando o botão é clicado', async () => {
    const toggleButton = wrapper.find('button[type="button"]')
    const passwordInput = wrapper.find('#password')
    
    expect(passwordInput.attributes('type')).toBe('password')
    await toggleButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
  })

  it('deve chamar handleRegister quando o formulário é submetido', async () => {
    // Mock da resposta do GraphQL
    const mockRegisterResponse = {
      register: {
        token: 'fake-token',
        user: {
          id: '1',
          name: 'João Silva',
          email: 'joao@exemplo.com',
          active: true,
          role: {
            name: 'user',
            permissions: []
          }
        }
      }
    }

    // Configura os valores do formulário
    await wrapper.find('#name').setValue('João Silva')
    await wrapper.find('#email').setValue('joao@exemplo.com')
    await wrapper.find('#password').setValue('senha123')

    // Mock da função gqlRequest
    const { gqlRequest } = await import('../../utils/graphql')
    vi.mocked(gqlRequest).mockResolvedValueOnce(mockRegisterResponse)

    // Submete o formulário
    await wrapper.find('form').trigger('submit')

    // Verifica se gqlRequest foi chamado com os parâmetros corretos
    expect(gqlRequest).toHaveBeenCalledWith(
      expect.any(String),
      {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha123'
      }
    )
  })

  it('deve exibir mensagem de erro quando o registro falha', async () => {
    const errorMessage = 'Email já cadastrado'
    const { gqlRequest } = await import('../../utils/graphql')
    vi.mocked(gqlRequest).mockRejectedValueOnce(new Error(errorMessage))

    await wrapper.find('#name').setValue('João Silva')
    await wrapper.find('#email').setValue('joao@exemplo.com')
    await wrapper.find('#password').setValue('senha123')
    await wrapper.find('form').trigger('submit')

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain(errorMessage)
  })

  it('deve redirecionar para o dashboard após registro bem-sucedido', async () => {
    const mockRegisterResponse = {
      register: {
        token: 'fake-token',
        user: {
          id: '1',
          name: 'João Silva',
          email: 'joao@exemplo.com',
          active: true,
          role: {
            name: 'user',
            permissions: []
          }
        }
      }
    }

    const { gqlRequest } = await import('../../utils/graphql')
    vi.mocked(gqlRequest).mockResolvedValueOnce(mockRegisterResponse)

    await wrapper.find('#name').setValue('João Silva')
    await wrapper.find('#email').setValue('joao@exemplo.com')
    await wrapper.find('#password').setValue('senha123')
    await wrapper.find('form').trigger('submit')

    // Verifica se o store foi atualizado
    const authStore = useAuthStore()
    expect(authStore.token).toBe('fake-token')
    expect(authStore.user).toEqual(mockRegisterResponse.register.user)

    // Aguarda a navegação ser concluída
    await router.isReady()
    
    // Verifica se houve redirecionamento para o dashboard
    expect(router.currentRoute.value.path).toBe('/dashboard/joao-silva')
  })

  it('deve ter um link para a página de login', () => {
    const loginLink = wrapper.find('a[href="/login"]')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toBe('auth.register.hasAccount')
  })
})