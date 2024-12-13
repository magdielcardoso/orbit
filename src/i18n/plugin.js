import { ref, computed } from 'vue'
import messages from './messages'

// Estado global do idioma
const currentLocale = ref(
  localStorage.getItem('locale') || 
  navigator.language.split('-')[0] || 
  'pt'
)

// Plugin Vue
export function createI18n() {
  return {
    install: (app) => {
      // Adiciona o método global $t
      app.config.globalProperties.$t = (key) => {
        const keys = key.split('.')
        let value = messages[currentLocale.value]
        
        for (const k of keys) {
          value = value[k]
          if (!value) return key
        }
        
        return value
      }

      // Disponibiliza o composable useI18n
      app.provide('i18n', {
        currentLocale: computed(() => currentLocale.value),
        t: (key) => {
          const keys = key.split('.')
          let value = messages[currentLocale.value]
          
          for (const k of keys) {
            value = value[k]
            if (!value) return key
          }
          
          return value
        },
        setLocale: (locale) => {
          currentLocale.value = locale
          localStorage.setItem('locale', locale)
        }
      })
    }
  }
}

// Composable
export function useI18n() {
  return {
    t: (key) => {
      const keys = key.split('.')
      let value = messages[currentLocale.value]
      
      for (const k of keys) {
        value = value[k]
        if (!value) return key
      }
      
      return value
    },
    setLocale: (locale) => {
      currentLocale.value = locale
      localStorage.setItem('locale', locale)
    },
    currentLocale: computed(() => currentLocale.value)
  }
} 