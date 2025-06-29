FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env .

COPY . .

RUN npm run build

CMD ["node", "dist/server.js"]
