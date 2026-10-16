FROM node:26-trixie-slim AS builder

RUN set -eux; \
    apt-get update -q; \
    apt-get install -yq --no-install-recommends \
      build-essential \
      ca-certificates \
      libcurl4-openssl-dev \
      libssl-dev \
      pkg-config \
      python3 \
      python3-dev \
      git; \
    rm -rf \
        /var/www/* \
        /usr/share/doc/* \
        /usr/share/info/* \
        /usr/share/man/* \
        /var/lib/apt/lists/*

WORKDIR /opt/famir-demo

COPY package*.json ./

RUN npm ci --silent

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:26-trixie-slim AS runner

LABEL org.opencontainers.image.source=https://github.com/bitnoize/famir-demo

RUN set -eux; \
    # Debian packages
    apt-get update -q; \
    apt-get install -yq --no-install-recommends \
      ca-certificates \
      libcurl4; \
    # Clean-up
    rm -rf \
        /var/www/* \
        /usr/share/doc/* \
        /usr/share/info/* \
        /usr/share/man/* \
        /var/lib/apt/lists/*

COPY --from=builder /opt/famir-demo/package*.json /opt/famir-demo/
COPY --from=builder /opt/famir-demo/node_modules /opt/famir-demo/node_modules
COPY --from=builder /opt/famir-demo/dist /opt/famir-demo/dist

WORKDIR /opt/famir-demo

ENV NODE_ENV=production \
    HTTP_SERVER_ADDRESS=0.0.0.0 \
    HTTP_SERVER_PORT=3000 \
    REPL_SERVER_ADDRESS=0.0.0.0 \
    REPL_SERVER_PORT=5000

EXPOSE 3000 5000

USER node

CMD ["node"]
