# frontend/Dockerfile

# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (for better caching)
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the code
COPY . .

# 6. Expose the port (usually 3000 for frontend)
EXPOSE 3000

# 7. Start the app
CMD ["npm", "run", "dev"]