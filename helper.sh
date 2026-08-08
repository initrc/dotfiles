#!/bin/bash

function echo-success() {
    # $1 echo green text
    echo -e "\e[32m$1\e[39m"
}

function echo-neutral() {
    # $1 echo purple text
    echo -e "\033[35m$1\033[0m"
}

function echo-error() {
    # $1 echo red text
    echo -e "\033[31m$1\033[0m"
}

function echo-result() {
    # $1 echo text
    [[ $? -eq 0 ]] && echo-success "[✅] $1" || echo-error "[❌] $1"
}

function echo-todo() {
    # $1 echo text
    echo-neutral "[TODO] $1"
}

function link() {
    # $1 category, $2 file to link
    src="$PWD/$1/$2"
    tgt="$HOME/.$2"
    [[ -h "$tgt" ]] && rm $tgt
    ln -s $src $tgt
    echo-result "Link $tgt"
}

function clone-or-pull() {
    # $1 git repo url, $2 clone destination
    if [[ -d "$2" ]]; then
        pushd $2 > /dev/null
        echo-neutral "git pull from $2"
        git pull
        popd > /dev/null
    else
        echo-neutral "git clone $1 $2"
        git clone $1 $2
    fi
}

function safe-append() {
    # $1 filename, $2 string to append
    if [ -s "$1" ] && ! grep -q "$2" "$1"; then
        echo "$2" >> $1
    fi
}

