
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY .eslintrc.json .

COPY tailwind.config.js .

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/conf.d/app.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]