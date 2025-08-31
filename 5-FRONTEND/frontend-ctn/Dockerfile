# Étape 1 : Build de l'application
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Image de production allégée
FROM node:22-slim
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

#COPY --from=builder /app ./


ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]

