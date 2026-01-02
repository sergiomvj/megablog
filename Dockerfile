# Estágio 1: Build do Frontend (React/Vite)
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
# Instalando todas as dependências (incluindo dev para o build do Vite)
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Estágio 2: Setup do Backend (Node.js)
FROM node:20-slim
WORKDIR /app
# Copia apenas o necessário do backend para manter a imagem leve
COPY backend/package*.json ./
RUN npm install --production --legacy-peer-deps
COPY backend/ ./

# Copia o frontend compilado para dentro da pasta dist do backend
COPY --from=frontend-builder /app/dist ./dist

# Porta para o tráfego WEB (Dashboard + API)
# O Easypanel mapeia esta porta para o seu subdomínio
EXPOSE 3000

# Executa migração e inicia o servidor
CMD ["sh", "-c", "node migrate.js || true && node index.js"]
