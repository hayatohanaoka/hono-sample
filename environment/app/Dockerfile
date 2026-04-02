FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

COPY package*json tsconfig.json src ./

RUN pnpm install
RUN pnpm run build


FROM base AS runner
WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

EXPOSE 13000

CMD ["node", "/app/dist/index.js"]
