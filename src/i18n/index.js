import { ref } from 'vue'

// Importar traduções
import ptCommon from './locales/pt/common'
import ptViews from './locales/pt/views'
import enCommon from './locales/en/common'
import enViews from './locales/en/views'

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

// Estado global do idioma
const currentLocale = ref(
  localStorage.getItem('locale') || 
  navigator.language.split('-')[0] || 
  'pt'
)

// Função de tradução
export function useI18n() {
  // Trocar idioma
  const setLocale = (locale) => {
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
  }

  // Obter tradução
  const t = (key) => {
    const keys = key.split('.')
    let value = messages[currentLocale.value]
    
    for (const k of keys) {
      value = value[k]
      if (!value) return key
    }
    
    return value
  }

  return {
    t,
    setLocale,
    currentLocale
  }
} 