# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the project (compiles TypeScript into JavaScript in the 'dist' folder)
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy only package files needed for production install
COPY package*.json ./
RUN npm ci --only=production

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Optionally expose a port (if your application listens on a specific port)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
