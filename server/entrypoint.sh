#!/bin/sh
set -e

case "$1" in
bundle | cache | compile | completions | coverage | doc | eval | fmt | help | info | install | lint | lsp | repl | run | test | types | upgrade)
    if [ "${BUILD_MODE}" = 'production' ]; then
        echo 'Starting compiled deno app'
        ./app
    elif [ "${BUILD_MODE}" = 'development' ]; then
        echo 'Starting denon'
        exec denon "$@"
    else
        echo 'Starting deno'
        exec deno "$@"
    fi
    ;;
esac

exec "$@"
