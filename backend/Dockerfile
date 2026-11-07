# Use Node 20 slim — small base image
FROM node:20-slim

# Install Chromium and its OS-level dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    libgconf-2-4 \
    libxss1 \
    libxtst6 \
    libx11-xcb1 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    fonts-liberation \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip downloading Chromium (we installed it above)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# Point Puppeteer to the system Chromium binary
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /usr/src/app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
