FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем код
COPY . .

# Порт
EXPOSE 5001

# Запуск
CMD ["node", "src/server.js"]