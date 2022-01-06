#!/usr/bin/env bash

echo "Starting setup of E.V.A Investments development environment"

function get_current_os() {
    case "$OSTYPE" in
    darwin*)
        echo "OSX - not supported"
        exit 1
        ;;
    linux*)
        os="LINUX"
        ;;
    msys*)
        os="WINDOWS"
        ;;
    *)
        echo "unknown: $OSTYPE - not supported"
        exit 1
        ;;
    esac

    echo "Current OS: $os"
}

function install_node() {
    ## Checks if nodejs is installed
    if ! [ -x "$(command -v node)" ]; then
        echo 'Warn: nodejs is not installed.' >&2
        echo "Trying to install nodejs"

        if [ $os == "WINDOWS" ]; then
            choco install nodejs-lts
        elif [ $os == "LINUX" ]; then
            curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
            apt-get install -y nodejs
        fi
    else
        ## Upgrades nodejs
        echo "Trying to upgrade nodejs"
        if [ $os == "WINDOWS" ]; then
            choco upgrade nodejs-lts
        elif [ $os == "LINUX" ]; then
            curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
            apt-get install -y nodejs
        fi
    fi

    ## Prints nodejs version
    node --version
}

## Install required softwared

get_current_os

install_node

echo "Instalation done. Happy coding!!!"
