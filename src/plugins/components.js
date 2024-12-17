// Registra componentes globalmente de forma automática
const components = import.meta.glob('../components/**/*.vue', { eager: true })

export default {
  install(app) {
    for (const path in components) {
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
      
      // Registra o componente globalmente usando o módulo default
      app.component(componentName, components[path].default)
    }
  }
}