# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files first for layer caching
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Serve stage — minimal nginx
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html

# Use a custom nginx config to support SPA routing (Next.js static export)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
