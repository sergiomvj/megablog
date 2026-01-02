FROM node:20-slim

WORKDIR /app

# Somente as dependências do BACKEND para evitar conflitos com o frontend (recharts/react)
COPY backend/package*.json ./

# Usamos --legacy-peer-deps por segurança contra conflitos de peer dependencies
RUN npm install --production --legacy-peer-deps

# Copia o código do backend
COPY backend/ ./

EXPOSE 3000

# Executa migração e inicia o servidor
CMD ["sh", "-c", "node migrate.js || true && node index.js"]
