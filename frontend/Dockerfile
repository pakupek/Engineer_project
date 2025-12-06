FROM node:22-alpine

WORKDIR /app/frontend

# Ensure latest OS packages to reduce known vulnerabilities
RUN apk update && apk upgrade --no-cache

COPY package.json package-lock.json ./

# Addet --legacy-peer-deps to ignore version conflicts
# Use npm ci for a reproducible, lockfile-driven install
RUN npm ci --legacy-peer-deps

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]