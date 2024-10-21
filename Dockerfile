# Stage 1: Build
FROM node:23-bookworm-slim AS build

RUN npm i -g pnpm
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json tsconfig.json ./

# Install dependencies
RUN pnpm install

# Copy source files and build
COPY . .
RUN pnpm run build


# Expose the app's port (e.g., 3000)
EXPOSE 3000

# Run the application
CMD ["node", "dist/bin/start.js"]