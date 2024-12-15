import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Emula __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function loadControllers(fastify) {
  const controllersPath = path.join(__dirname, '../controllers');
  
  // Itera pelos arquivos na pasta de controladores
  fs.readdirSync(controllersPath).forEach(async (file) => {
    if (file.endsWith('.controller.js')) {
      const controllerPath = path.join(controllersPath, file);
      const controller = (await import(controllerPath)).default;

      // Verifica se o controlador tem um nome definido, senão usa o nome do arquivo
      const controllerName = controller?.name || file.replace('.controller.js', '');
      
      if (controller) {
        await fastify.decorate(controllerName, controller);
        fastify.log.info(`Controlador "${controllerName}" registrado com sucesso.`);
      } else {
        fastify.log.warn(`Arquivo "${file}" não exporta um controlador válido.`);
      }
    }
  });
}
