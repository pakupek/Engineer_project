# Install dependencies only when needed
FROM node:22-alpine AS deps
WORKDIR /app

# Install main dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
