# 1. Use Node.js base image
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

# 2. Set the working directory
WORKDIR /app

# Step 2.1: Install pnpm globally
RUN npm install -g pnpm

# 3. Copy the .env file and package files
COPY .env .env
COPY package.json pnpm-lock.yaml ./

# 4. Install dependencies
RUN pnpm install --frozen-lockfile

# 5. Copy the rest of the application code
COPY . .

# 6. Build the Next.js application
RUN pnpm run build

# 7. Use a smaller image for production
FROM node:20-alpine AS runner

# 8. Set the working directory
WORKDIR /app

# 9. Copy only the built application and production dependencies from the builder
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/cache-handler.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# 11. Define the command to start the application
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]