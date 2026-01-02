FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci --omit=dev

COPY . .

EXPOSE 3025

CMD ["node", "generator-service.js"]
