import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

// Inicializa o tema
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

if (import.meta.env.PROD) {
  const webVitals = await import('web-vitals')
  webVitals.getCLS(console.log)
  webVitals.getFID(console.log)
  webVitals.getLCP(console.log)
}
