import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import ComponentsPlugin from './plugins/components'

// Inicializa o tema
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ComponentsPlugin)

app.mount('#app')

if (import.meta.env.PROD) {
  try {
    const { onCLS, onFID, onLCP } = await import('web-vitals');
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
  } catch (error) {
    console.warn('Erro ao carregar web-vitals:', error);
  }
}
