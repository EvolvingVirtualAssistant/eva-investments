# --------------------------------------------------------------------------------------------------------
# set default build mode
ARG DEFAULT_BUILD_MODE=production

FROM debian:buster-slim as build

ARG DEFAULT_BUILD_MODE

ENV DENO_VERSION=1.13.1
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
ENV DENO_VERSION=1.13.1

WORKDIR /app

# use deno user instead of root
USER deno

# cache all dependencies declared in deps.ts
COPY src/deps.ts ./src/deps.ts
RUN deno cache --unstable src/deps.ts

ADD . .

# avoids compiling the app everytime we startup the container
RUN deno cache --unstable src/app.ts

# --------------------------------------------------------------------------------------------------------

FROM base as development

ARG DEFAULT_BUILD_MODE

USER root

# install denon
RUN deno install -qAf --unstable https://deno.land/x/denon/denon.ts

# clean WORKDIR as it will be mounted instead
RUN rm -rf /app/

USER deno

# --------------------------------------------------------------------------------------------------------

FROM base as continuous-integration

ARG DEFAULT_BUILD_MODE

USER root

# find files to be ingored and lint
RUN ["/bin/bash", "-c", "lint_ignore=$(readarray -d '' array < <(find . -print | grep -i .bundle); echo $array | tr ' ' ','); \
    ignore_flag='--ignore='; if [ -n $lint_ignore ]; then ignore_flag=''; fi; \
    deno lint --unstable $ignore_flag$lint_ignore"]

# vunerabilities
# yet to be decided what to use

# compile deno app
RUN deno compile --unstable --allow-net src/app.ts

# tests - commented for now since we do not yet have tests
RUN deno test --unstable --allow-read --location https://example.com tests/

# --------------------------------------------------------------------------------------------------------

FROM base as compile-for-production

ARG DEFAULT_BUILD_MODE

USER root

# compile deno app
RUN deno compile --unstable --allow-net src/app.ts

# --------------------------------------------------------------------------------------------------------

FROM debian:buster-slim as production

ARG DEFAULT_BUILD_MODE

# add deno user
RUN useradd --uid 1000 --user-group deno

USER deno

COPY --from=compile-for-production /app/app /app/app
COPY --from=compile-for-production /app/entrypoint.sh /usr/local/bin/entrypoint.sh

WORKDIR /app

# --------------------------------------------------------------------------------------------------------

FROM $DEFAULT_BUILD_MODE as final

ARG DEFAULT_BUILD_MODE

ENV BUILD_MODE=$DEFAULT_BUILD_MODE

# expose port 1993
EXPOSE 1993

ENTRYPOINT ["entrypoint.sh"]
CMD ["run", "--allow-net", "--unstable", "src/app.ts"]

# --------------------------------------------------------------------------------------------------------