import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
}
global.localStorage = localStorageMock

// Configuração global para testes
config.global.mocks = {
  // Adicione mocks globais aqui se necessário
}

// Limpa todos os mocks após cada teste
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.clear.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.key.mockClear()
})

// Silencia warnings do Vue
config.global.config.warnHandler = () => null