FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

RUN npm install --include=dev

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]