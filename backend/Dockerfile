# Use Node.js 18 or later
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Start application
CMD ["node", "index.js"]
