import { ref, inject } from 'vue'
import ptCommon from './locales/pt/common'
import ptViews from './locales/pt/views'
import enCommon from './locales/en/common'
import enViews from './locales/en/views'

const I18N_INJECTION_KEY = Symbol('i18n')

// Combinar traduções
const messages = {
  pt: {
    ...ptCommon,
    ...ptViews
  },
  en: {
    ...enCommon,
    ...enViews
  }
}

export function createI18n() {
  // Estado global do idioma
  const locale = ref(
    localStorage.getItem('locale') || 
    navigator.language.split('-')[0] || 
    'pt'
  )

  // Função de tradução
  const t = (key) => {
    const keys = key.split('.')
    let value = messages[locale.value]
    
    for (const k of keys) {
      value = value[k]
      if (!value) return key
    }
    
    return value
  }

  // Trocar idioma
  const setLocale = (newLocale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  return {
    install: (app) => {
      // Disponibilizar globalmente
      app.config.globalProperties.$t = t
      app.config.globalProperties.$i18n = {
        locale,
        setLocale
      }

      // Disponibilizar via composable
      app.provide(I18N_INJECTION_KEY, {
        t,
        locale,
        setLocale
      })
    }
  }
}

// Composable para usar em componentes quando necessário
export function useI18n() {
  const i18n = inject(I18N_INJECTION_KEY)
  if (!i18n) throw new Error('No i18n provided!')
  return i18n
} 