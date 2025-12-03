# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# This creates the /dist folder with index.html and assets
RUN npm run build 

# Stage 2: Serve
FROM nginx:alpine
# Ensure we copy the 'dist' folder to html
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]