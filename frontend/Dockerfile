ARG API_ENDPOINT=http://backend:8000
ARG PORT=80

# build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
ENV API_ENDPOINT=${API_ENDPOINT}
RUN npm run build

# production stage
FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY scripts/gen_nginx_conf.sh /tmp/gen_nginx_conf.sh
ENV API_ENDPOINT=${API_ENDPOINT}
ENV PORT=${PORT}
RUN bash /tmp/gen_nginx_conf.sh
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
