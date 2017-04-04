#!/bin/bash

# show usage if not run via 'source'
if [[ $0 == ${BASH_SOURCE} ]]; then
    echo -e "\nUsage: source $0\n"
    cat $0 | grep "^function dot" \
        | sed "s/^function \(dot-[a-zA-Z0-9-]*\)()[ ]*{[ ]*#[ ]*\(.*$\)/\1:\2/g" \
        | awk '{split($0, a, ":"); printf("%-20s: %s\n", a[1], a[2])}'
    echo ""
else
    echo "[OK] Functions loaded"
fi

# helper functions
function link() {
    # $1 category, $2 file to link
    src="$PWD/$1/$2"
    tgt="$HOME/.$2"
    [[ -h "$tgt" ]] && rm $tgt
    ln -s $src $tgt
    [[ $? -eq 0 ]] && echo "[OK] Link $2" || echo "[FAIL] Link $2"
}

function clone-or-pull() {
    # $1 git repo url, $2 clone destination
    if [[ -d "$2" ]]; then
        pushd $2 > /dev/null
        echo "git pull at $2"
        git pull
        popd > /dev/null
    else
        echo "git clone $1 $2"
        git clone $1 $2
    fi
}

function safe-append() {
    # $1 filename, $2 string to append
    if [ -s "$1" ] && ! grep -q "$2" "$1"; then
        echo "$2" >> $1
    fi
}

# public functions
function dot-sh() { # install and configure zsh/bash
    curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
    link sh bash_profile
    link sh bashrc
    link sh shrc
    safe-append $HOME/.zshrc "source \$HOME/.shrc"
    safe-append $HOME/.zshrc "ZSH_THEME=\"agnoster\""
    safe-append $HOME/.zshrc "DEFAULT_USER=\"$(whoami)\""
    echo "[OK] Please move the theme config to the top of zshrc"
}

function dot-vim() { # install and configure vim and plugins
    brew install macvim --override-system-vim
    link vim vim
    link vim vimrc
    dir="$HOME/.vim/bundle/vundle"
    clone-or-pull https://github.com/gmarik/vundle.git $dir
    vim +BundleInstall +qall
    [[ $? -eq 0 ]] && echo "[OK] Vim updated"
}

function dot-git() { # install and configure git and scm_breeze
    brew install git
    link git gitignore_global
    git config --global color.diff always
    git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    git config --global alias.purr "pull --rebase"
    git config --global alias.feature "checkout --track origin/master -b"
    git config --global core.excludesfile $HOME/.gitignore_global

    dir="$HOME/.scm_breeze"
    clone-or-pull git://github.com/ndbroadbent/scm_breeze.git $dir
    $dir/install.sh
    [[ $? -eq 0 ]] && echo "[OK] Git updated"
}

function dot-tmux() { # install and configure tmux
    brew install tmux
    link tmux tmux.conf
    link tmux tmux-osx.conf
}

function dot-mac() { # configure osx keyboard repeat rate
    defaults write -g InitialKeyRepeat -int 15 # normal minimum is 15 (225 ms)
    defaults write -g KeyRepeat -int 2 # normal minimum is 2 (30 ms)
    defaults write .GlobalPreferences com.apple.mouse.scaling -1 # default acceleration 1.5
}

function dot-link() { # link all config files
    link sh bash_profile
    link sh bashrc
    link sh shrc
    link vim vim
    link vim vimrc
    link git gitignore_global
    link tmux tmux.conf
    link tmux tmux-osx.conf
    link atom atom/
}

