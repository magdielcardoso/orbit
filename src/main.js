import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { createI18n } from './i18n/plugin'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createI18n())

app.mount('#app')
