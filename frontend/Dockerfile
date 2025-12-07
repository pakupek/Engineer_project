# =========================
# Stage 1: Install dependencies
# =========================
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# =========================
# Stage 2: Build the app
# =========================
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# =========================
# Stage 3: Production image
# =========================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Kopiuj wszystko co potrzebne
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Next.js automatycznie użyje PORT z environment
EXPOSE 3000

# Użyj wbudowanego serwera Next.js
CMD ["npx", "next", "start"]