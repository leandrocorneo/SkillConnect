# Dockerfile
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia arquivos essenciais primeiro (para cache de dependências)
COPY package*.json ./
RUN npm install

# Copia todo o restante do código
COPY . .

# Expõe a porta do app
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start:dev"]