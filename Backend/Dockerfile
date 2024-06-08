FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
ENV NODE_ENV=production
RUN npm run build
EXPOSE 3002
CMD [ "npm", "run", "start:prod" ]
