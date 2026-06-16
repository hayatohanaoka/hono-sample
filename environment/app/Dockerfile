FROM node:26-alpine AS base
RUN npm install -g pnpm
COPY . /app

FROM base AS builder
WORKDIR /app

COPY package*json tsconfig.json src ./
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM base AS runner
WORKDIR /app

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
EXPOSE 3100

CMD ["node", "dist/src/main/index.js"]
