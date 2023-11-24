FROM node:20-alpine as base

WORKDIR /app
COPY dist .
COPY package.json .
COPY yarn.lock .

RUN yarn install --production

CMD ["node", "index.js"]
