FROM node:18-alpine

WORKDIR /app/frontend

COPY package.json package-lock.json ./

# Addet --legacy-peer-deps to ignore version conflicts
RUN npm install --legacy-peer-deps

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]