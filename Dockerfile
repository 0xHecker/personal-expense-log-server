FROM node:16

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

COPY .env.production .env

RUN yarn build

ENV NODE_ENV=production

ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/index.js"]

USER node