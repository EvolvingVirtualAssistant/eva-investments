# --------------------------------------------------------------------------------------------------------

FROM debian:buster-slim as build

ENV DENO_VERSION=1.10.1
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update \
    && apt-get -qq install -y --no-install-recommends curl ca-certificates unzip \
    && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip --output deno.zip \
    && unzip deno.zip \
    && rm deno.zip \
    && chmod 755 deno

# --------------------------------------------------------------------------------------------------------

FROM debian:buster-slim as final

COPY --from=build deno /usr/bin/deno

# add deno user
RUN useradd --uid 1000 --user-group deno \
    && mkdir /deno-dir/ \
    && chown deno:deno /deno-dir/

# deno-dir is where you will place all of your deno project files
ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local/

# Specific for the app
# ----------------------------------------------------

# expose port 1993
EXPOSE 1993

WORKDIR /app

# use deno user instead of root
USER deno

# cache all dependencies declared in deps.ts
COPY deps.ts .
RUN deno cache deps.ts

ADD . .

# avoids compiling the app everytime we startup the container
RUN deno cache app.ts

ENTRYPOINT ["deno"]
CMD ["run", "--allow-net", "app.ts"]

# ----------------------------------------------------

# --------------------------------------------------------------------------------------------------------