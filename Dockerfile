# 1) Base image
FROM node:20-alpine AS base

WORKDIR /app

# 2) Install system dependencies (needed for Prisma & SSL)
RUN apk add --no-cache openssl libc6-compat vips-dev fftw-dev build-base

# 3) Copy package files first
COPY package.json package-lock.json* ./

# 4) Install node modules (ignore postinstall)
RUN npm install --ignore-scripts

# 5) Copy Prisma folder & generate client
COPY prisma ./prisma
RUN npx prisma generate

# 6) Copy rest of project
COPY . .

# 7) Pass required env values into build
ARG JWT_ACCESS_TOKEN_SECRET
ARG JWT_REFRESH_TOKEN_SECRET
ENV JWT_ACCESS_TOKEN_SECRET=$JWT_ACCESS_TOKEN_SECRET
ENV JWT_REFRESH_TOKEN_SECRET=$JWT_REFRESH_TOKEN_SECRET

# 8) Build Next.js app
RUN npm run build


# -------- PRODUCTION STAGE --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat vips-dev fftw-dev build-base

# Copy needed files from build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.mjs ./next.config.mjs
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

EXPOSE 3000

CMD npx prisma migrate deploy && npm start