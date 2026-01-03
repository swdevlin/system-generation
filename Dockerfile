FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci --omit=dev

COPY . .

EXPOSE 3007

CMD ["node", "generator-service.js"]
