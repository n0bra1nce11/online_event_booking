# Stage 1: Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY package.json .
COPY public ./public
RUN npm install http-server -g
RUN npm install

# Stage 2: Build backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY package.json .
COPY src ./src
RUN npm install

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app
COPY --from=frontend /app/public ./public
COPY --from=backend /app/src ./src
COPY package.json .
RUN npm install
RUN npm install http-server -g
RUN mkdir -p public/images/uploads

# Expose ports
EXPOSE 5000 8080

# Start both backend and frontend
CMD ["npm", "run", "start:full"]