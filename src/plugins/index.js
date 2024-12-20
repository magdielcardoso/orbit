import { createPinia } from 'pinia'
import router from '../router'

export function registerPlugins(app) {
  const pinia = createPinia()
  
  app.use(pinia)
  app.use(router)
} 