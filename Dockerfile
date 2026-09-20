FROM node:22-lts

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy built backend
COPY backend/dist ./dist

# Copy frontend build
COPY frontend/build ./public

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start app
CMD ["node", "dist/server.js"]
