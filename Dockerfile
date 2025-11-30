# 1️⃣ BASE IMAGE FOR BUILD
FROM node:20-alpine AS base

WORKDIR /app

# Required for prisma + sharp
RUN apk add --no-cache openssl libc6-compat vips-dev fftw-dev build-base

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

# Prisma client generation
COPY prisma ./prisma
RUN npx prisma generate

# Copy full app
COPY . .

# Build Next.js
RUN npm run build


# 2️⃣ PRODUCTION RUNNER
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat vips-dev fftw-dev build-base

# Copy build output + required files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.mjs ./next.config.mjs
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

EXPOSE 3000

# Run DB migrations then start
CMD npx prisma migrate deploy && npm start