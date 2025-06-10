FROM node:22-alpine

# build backend
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npm install\
    && npm install typescript -g
RUN tsc


# build the web
WORKDIR /usr/src/app
COPY web ./web

WORKDIR /usr/src/app/web
RUN npm install && npm run build
RUN cp -r /usr/src/app/web/dist /usr/src/app/backend/dist/public

WORKDIR /usr/src/app/backend/dist

CMD ["node", "main.js"]