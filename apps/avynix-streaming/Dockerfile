# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm only for the build stage
RUN npm install -g pnpm

# Install dependencies
COPY package.json ./
RUN pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what is needed for runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set production environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "dist/main"]
