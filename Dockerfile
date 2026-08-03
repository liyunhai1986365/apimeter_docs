FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG DOCS_BASE_PATH=""
ARG DOCS_ASSET_PREFIX=""
ENV DOCS_BASE_PATH=$DOCS_BASE_PATH
ENV DOCS_ASSET_PREFIX=$DOCS_ASSET_PREFIX

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3030
ENV HOSTNAME=0.0.0.0
ENV DOCS_BASE_PATH=""
ENV DOCS_ASSET_PREFIX=""

RUN addgroup -S nodejs -g 1001 \
  && adduser -S nextjs -u 1001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/.source ./.source
COPY --from=builder /app/content ./content

USER nextjs

EXPOSE 3030

CMD ["bun", "server.js"]
