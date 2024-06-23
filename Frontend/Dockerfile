
FROM node:lts


WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

RUN npm run build

COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "dev"]
