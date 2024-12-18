import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Emula __dirname no ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function loadservices(fastify) {
  const servicesPath = path.join(__dirname, '../services')

  // Itera pelos arquivos na pasta de serviços
  fs.readdirSync(servicesPath).forEach(async file => {
    if (file.endsWith('.service.js')) {
      const servicePath = path.join(servicesPath, file)
      const service = (await import(servicePath)).default

      // Verifica se o serviço tem um nome definido, senão usa o nome do arquivo
      const serviceName = service?.name || file.replace('.service.js', '')

      if (service) {
        await fastify.decorate(serviceName, service)
        fastify.log.info(`Serviço "${serviceName}" registrado com sucesso.`)
      } else {
        fastify.log.warn(`Arquivo "${file}" não exporta um serviço válido.`)
      }
    }
  })
}