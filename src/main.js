import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { registerPlugins } from './plugins'
import router from './router'
import apiPlugin from './plugins/api'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(apiPlugin)

registerPlugins(app)

app.mount('#app')
