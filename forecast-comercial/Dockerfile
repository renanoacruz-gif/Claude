# syntax=docker/dockerfile:1

FROM node:20-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/forecast.db

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

VOLUME ["/data"]
EXPOSE 3000
CMD ["node", "server.js"]
