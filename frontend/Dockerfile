# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и ставим зависимости (только при изменении package*.json)
COPY package*.json ./
RUN npm ci

# ⚠️ НЕ копируем src/ — иначе volume не перекроет!
# Всё остальное будет браться из volumes при запуске

EXPOSE 9000

# Запускаем dev-сервер с хостом '0.0.0.0', чтобы был доступ извне контейнера
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]