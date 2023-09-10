# --------------------------------------------------------------------------------------------------------
# set default build mode
ARG DEFAULT_BUILD_MODE=production

FROM debian:buster-slim as build

ARG DEFAULT_BUILD_MODE
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update \
    && apt-get -qq install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean

# --------------------------------------------------------------------------------------------------------

FROM build as blockchain

ARG DEFAULT_BUILD_MODE
ARG DEBIAN_FRONTEND=noninteractive

# install ethereum blockchain
RUN npm install -g ganache

# expose port 8545 (default ganache port)
EXPOSE 8545

# install geth and other tooling to interact with blockchain
RUN curl -fsSL https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.12.0-e501b3b0.tar.gz --output geth-linux-amd64-1.12.0-e501b3b0.tar.gz \
    && tar --directory=/opt -xvf geth-linux-amd64-1.12.0-e501b3b0.tar.gz \
    && rm geth-linux-amd64-1.12.0-e501b3b0.tar.gz

ENV PATH "$PATH:/opt/geth-linux-amd64-1.12.0-e501b3b0"

CMD ganache -v -h 0.0.0.0 \ 
    --account=\"$(cat run/secrets/test_acc1_priv_key),3000000000000000000000000000000000000000000\" \
    --account=\"$(cat run/secrets/test_acc2_priv_key),3000000000000000000000000000000000000000000\" \
    --gasPrice 2000000000 \
    --chain.chainId 1337

# --------------------------------------------------------------------------------------------------------

FROM build as base

ARG DEFAULT_BUILD_MODE

# copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 755 /usr/local/bin/entrypoint.sh

# add eva user
RUN useradd --uid 1000 --user-group eva \
    && mkdir /node-dir/ \
    && chown eva:eva /node-dir/

# eva-dir is where you will place all of your nodejs project files
ENV NODE_DIR /node-dir/

WORKDIR /app

# use eva user instead of root
USER eva

ADD . .

# --------------------------------------------------------------------------------------------------------

FROM base as compile-for-test

ARG DEFAULT_BUILD_MODE

# install dependencies
RUN npm run build:dependencies
RUN npm install

USER eva

# --------------------------------------------------------------------------------------------------------

FROM compile-for-test as base-blockchain

ARG DEFAULT_BUILD_MODE
ARG DEBIAN_FRONTEND=noninteractive

USER root

RUN apt-get -qq update \
    && apt-get -qq install -y --no-install-recommends curl ca-certificates \
    && curl -sL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get -qq install -y --no-install-recommends nodejs

# install ethereum blockchain
RUN npm install -g ganache-cli

USER eva

# expose port 8545 (default ganache port)
EXPOSE 8545

# --------------------------------------------------------------------------------------------------------

FROM base as development

ARG DEFAULT_BUILD_MODE

# clean WORKDIR as it will be mounted instead
RUN rm -rf /app/

USER eva

# --------------------------------------------------------------------------------------------------------

FROM base-blockchain as continuous-integration

ARG DEFAULT_BUILD_MODE

USER root

# lint
RUN npm run lint

# vunerabilities
# yet to be decided what to use

# build app - not sure if needed
#RUN npm run build

# tests - commented for now since we do not yet have tests
RUN npm run test

# integration tests using ganache as a blockchain
# nothing for now

# --------------------------------------------------------------------------------------------------------

FROM base as compile-for-production

ARG DEFAULT_BUILD_MODE

USER root

# install dependencies
RUN npm set progress=false && npm config set depth 0
#RUN npm install -g rimraf ts-node typescript
RUN npm run build:dependencies
RUN npm install

# build app
RUN npm run build

RUN rm -rf /app/node_modules
RUN npm install --only=production

# --------------------------------------------------------------------------------------------------------

FROM build as production

ARG DEFAULT_BUILD_MODE

# add eva user
RUN useradd --uid 1000 --user-group eva

COPY --from=compile-for-production /app/node_modules /app/node_modules
COPY --from=compile-for-production /app/dist /app/dist
COPY --from=compile-for-production /app/package.json /app/package.json
COPY --from=compile-for-production /app/entrypoint.sh /usr/local/bin/entrypoint.sh

WORKDIR /app

# --------------------------------------------------------------------------------------------------------

FROM $DEFAULT_BUILD_MODE as final

ARG DEFAULT_BUILD_MODE

ENV BUILD_MODE=$DEFAULT_BUILD_MODE

# expose port 5000
EXPOSE 5000

ENTRYPOINT ["entrypoint.sh"]
CMD ["run", "start"]

# --------------------------------------------------------------------------------------------------------