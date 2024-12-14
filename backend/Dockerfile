FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta
EXPOSE 4000

# Define as variáveis de ambiente
ENV NODE_ENV=development

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"] 