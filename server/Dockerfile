# --------------------------------------------------------------------------------------------------------
# set default build mode
ARG DEFAULT_BUILD_MODE=base

FROM debian:buster-slim as build

ARG DEFAULT_BUILD_MODE

ENV DENO_VERSION=1.10.1
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update \
    && apt-get -qq install -y --no-install-recommends curl ca-certificates unzip \
    && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip --output deno.zip \
    && unzip deno.zip \
    && rm deno.zip \
    && chmod 755 deno

# --------------------------------------------------------------------------------------------------------

FROM debian:buster-slim as base

ARG DEFAULT_BUILD_MODE

COPY --from=build deno /usr/bin/deno

# copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 755 /usr/local/bin/entrypoint.sh

# add deno user
RUN useradd --uid 1000 --user-group deno \
    && mkdir /deno-dir/ \
    && chown deno:deno /deno-dir/

# deno-dir is where you will place all of your deno project files
ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local/
ENV DENO_VERSION=1.10.1

# expose port 1993
EXPOSE 1993

WORKDIR /app

# use deno user instead of root
# excluded for now as with the denon dependency or the unstable flag is requiring root
#USER deno

# cache all dependencies declared in deps.ts
COPY deps.ts .
RUN deno cache --unstable deps.ts

ADD . .

# avoids compiling the app everytime we startup the container
RUN deno cache --unstable app.ts

# --------------------------------------------------------------------------------------------------------

FROM base as development

ARG DEFAULT_BUILD_MODE

# install denon
RUN deno install -qAf --unstable https://deno.land/x/denon/denon.ts

# clean WORKDIR as it will be mounted instead
RUN rm -rf /app/

# --------------------------------------------------------------------------------------------------------

FROM $DEFAULT_BUILD_MODE as final

ARG DEFAULT_BUILD_MODE

ENV BUILD_MODE=$DEFAULT_BUILD_MODE

ENTRYPOINT ["entrypoint.sh"]
CMD ["run", "--allow-net", "--unstable", "app.ts"]

# --------------------------------------------------------------------------------------------------------