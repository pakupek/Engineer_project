# =========================
# Stage 1: Install dependencies
# =========================
FROM node:20-alpine AS deps
WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# =========================
# Stage 2: Build the app
# =========================
FROM node:20-alpine AS builder
WORKDIR /app/frontend
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY . .
RUN npm run build

# =========================
# Stage 3: Production image
# =========================
FROM node:20-alpine AS runner
WORKDIR /app/frontend

ENV NODE_ENV=production

COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
