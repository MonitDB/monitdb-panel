# Build limpo multi-stage. Regras deste ambiente:
# - NUNCA `chown -R` em runtime (trava o disco do host) → COPY --chown.
# - `next build` roda AQUI (build da imagem), não no startup do container.
# - O .env precisa estar presente no build: next.config.js assa env.* no bundle
#   (API_KEY no bundle é o SEC-3, a resolver via BFF).

# ---- 1. deps + build ----
FROM node:18-alpine AS build
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000 --mutex network
COPY . .
RUN yarn build

# ---- 2. runtime ----
FROM node:18-alpine
WORKDIR /opt/app
ENV NODE_ENV=production PORT=3000
RUN adduser -S app
COPY --from=build --chown=app /opt/app/package.json /opt/app/next.config.js /opt/app/.env ./
COPY --from=build --chown=app /opt/app/node_modules ./node_modules
COPY --from=build --chown=app /opt/app/public ./public
COPY --from=build --chown=app /opt/app/.next ./.next
USER app
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
