FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install\
    && npm install typescript -g
RUN tsc

WORKDIR /usr/src/app/dist

ENV POSTGRES_URL=127.0.0.1

EXPOSE 3000

CMD ["node", "main.js"]