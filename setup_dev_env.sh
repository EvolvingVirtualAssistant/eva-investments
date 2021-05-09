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

function install_deno() {

    ## Checks if deno is installed
    if ! [ -x "$(command -v deno)" ]; then
        echo 'Warn: deno is not installed.' >&2
        echo "Trying to install deno"
        if [ $os == "WINDOWS" ]; then
            choco install deno
        elif [ $os == "LINUX" ]; then
            curl -fsSL https://deno.land/x/install/install.sh | sh
        fi
    else
        ## Upgrades deno
        echo "Trying to upgrade deno"
        deno upgrade
    fi

    ## Prints deno version
    deno --version

    ## Installs deno autocomplete
    install_deno_autocomplete
}

function add_autocomplete_to_bash() {
    ## If bash is used then add support for deno autocomplete in all sessions
    if [ $os == "LINUX" ]; then
        deno completions bash >/usr/local/etc/bash_completion.d/deno.bash
        # shellcheck source=/usr/local/etc/bash_completion.d/deno.bash
        source /usr/local/etc/bash_completion.d/deno.bash
    fi
}

function add_autocomplete_to_zsh() {
    ## If zsh is used then add support for deno autocomplete in all sessions
    local ohMyZshFolder=~/.oh-my-zsh
    local zshrcFile=~/.zshrc
    if [ -f "$ohMyZshFolder" ]; then
        mkdir ~/.oh-my-zsh/custom/plugins/deno
        deno completions zsh >~/.oh-my-zsh/custom/plugins/deno/_deno

        if [ -f "$zshrcFile" ]; then
            if grep -q 'plugins=' $zshrcFile; then
                sed 's/plugins=(\(.*[a-z].*\))/plugins=(\1 deno)/' $zshrcFile
            else
                echo "plugins=(deno)" >>$zshrcFile
            fi
        fi
    elif [ -f "$zshrcFile" ]; then
        mkdir ~/.zsh # create a folder to save your completions. it can be anywhere
        deno completions zsh >~/.zsh/_deno
        printf "fpath=(~/.zsh \$fpath)\nautoload -Uz compinit\ncompinit -u" >>~/.zshrc
        echo "Note: if completions are still not loading, you may need to run rm ~/.zcompdump/ to remove previously generated completions and then compinit to generate them again"
        # shellcheck disable=SC1090
        source $zshrcFile
    fi
}

function add_autocomplete_to_cmder() {
    ## If cmder is installed then add support for deno autocomplete in all bash sessions
    local cmderDir
    cmderDir="$(command type -P cmder)"
    if [ -n "$cmderDir" ]; then
        echo "cmder is installed: $cmderDir"
        local cmderUserProfile
        cmderUserProfile="$(echo $cmderDir | sed 's/\(.*\)cmder/\1config\/user-profile.sh/')"
        if ! grep -q 'source <(deno completions' $cmderUserProfile; then
            echo 'source <(deno completions bash)' >>$cmderUserProfile
            echo "alias deno=deno" >>$cmderUserProfile
            source <(deno completions bash)
        else
            echo "Autocomplete already configured in user-profile.sh file"
        fi
    fi
}

function install_deno_autocomplete() {

    echo "Trying to install deno autcomplete"

    add_autocomplete_to_bash

    add_autocomplete_to_zsh

    add_autocomplete_to_cmder

}

## https://gist.github.com/lukechilds/a83e1d7127b78fef38c2914c4ececc3c
function get_latest_release() {
    curl --silent "https://api.github.com/repos/$1/releases/latest" | # Get latest release from GitHub api
        grep '"tag_name":' |                                          # Get tag line
        sed -E 's/.*"([^"]+)".*/\1/'                                  # Pluck JSON value
}

function print_notes() {
    local latestDenoVersion
    latestDenoVersion="$(get_latest_release denoland/deno)"
    echo "Cool IDE plugins: https://deno.land/manual@$latestDenoVersion/getting_started/setup_your_environment#editors-and-ides"
}

## Install required softwared

get_current_os

install_deno

print_notes

echo "Instalation done. Happy coding!!!"
