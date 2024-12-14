import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../LoginView.vue'
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

describe('LoginView', () => {
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
          path: '/register',
          name: 'register',
          component: { template: '<div>Register</div>' }
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
    wrapper = mount(LoginView, {
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
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('#remember-me').exists()).toBe(true)
  })

  it('deve atualizar o v-model do email quando digitado', async () => {
    const emailInput = wrapper.find('#email')
    await emailInput.setValue('teste@exemplo.com')
    expect(wrapper.vm.form.email).toBe('teste@exemplo.com')
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

  it('deve chamar handleLogin quando o formulário é submetido', async () => {
    // Mock da resposta do GraphQL
    const mockLoginResponse = {
      login: {
        token: 'fake-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'teste@exemplo.com',
          role: {
            name: 'user',
            permissions: []
          }
        }
      }
    }

    // Configura os valores do formulário
    await wrapper.find('#email').setValue('teste@exemplo.com')
    await wrapper.find('#password').setValue('senha123')

    // Mock da função gqlRequest
    const { gqlRequest } = await import('../../utils/graphql')
    vi.mocked(gqlRequest).mockResolvedValueOnce(mockLoginResponse)

    // Submete o formulário
    await wrapper.find('form').trigger('submit')

    // Verifica se gqlRequest foi chamado com os parâmetros corretos
    expect(gqlRequest).toHaveBeenCalledWith(
      expect.any(String),
      {
        email: 'teste@exemplo.com',
        password: 'senha123'
      }
    )
  })

  it('deve exibir mensagem de erro quando o login falha', async () => {
    const errorMessage = 'Credenciais inválidas'
    const { gqlRequest } = await import('../../utils/graphql')
    vi.mocked(gqlRequest).mockRejectedValueOnce(new Error(errorMessage))

    await wrapper.find('#email').setValue('teste@exemplo.com')
    await wrapper.find('#password').setValue('senha-errada')
    await wrapper.find('form').trigger('submit')

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain(errorMessage)
  })
})