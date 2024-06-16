
FROM node:lts


WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install
COPY . .
RUN npm run build



COPY .env .env


EXPOSE 3000


CMD ["npm", "run", "dev"]
