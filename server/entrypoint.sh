#!/usr/bin/env bash
set -e

case "$1" in
run)
    ARGS=("$@")
    if [ "${BUILD_MODE}" = 'production' ]; then
        echo 'Starting compiled nodejs app'
        array_length=${#ARGS[@]}
        last_token="${ARGS[$(("$array_length" - 1))]}:prod"
        unset "ARGS[-1]"
        ARGS=("${ARGS[@]} ${last_token}")
        echo "Executing: npm" "${ARGS[@]}"
        command $(echo npm "$ARGS")
    elif [ "${BUILD_MODE}" = 'development' ]; then
        echo 'Starting nodemon'
        array_length=${#ARGS[@]}
        last_token="${ARGS[$(("$array_length" - 1))]}:dev"
        unset "ARGS[-1]"
        ARGS=("${ARGS[@]} ${last_token}")
        echo "Executing: npm" "${ARGS[@]}"
        command $(echo npm "$ARGS")
    else
        echo 'Starting node app'
        echo "Executing: npm" "$@"
        command $(echo npm "$@")
    fi
    ;;
esac

echo "No command match"
echo "Executing: npm" "$@"
command $(echo npm "$@")
