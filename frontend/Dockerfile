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
# PORT domyślnie 10000 dla Render
ENV PORT=10000
EXPOSE $PORT

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Uruchom Next.js standalone na porcie $PORT i bind na 0.0.0.0
CMD ["node", "server.js"]
