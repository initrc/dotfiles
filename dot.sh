#!/bin/bash

source helper.sh

function dot-sys-dep() { # install system dependencies
    if [ "$(uname)" = "Darwin" ]; then
        xcode-select --install
        echo-result "Install Xcode command line tools"
        echo-todo "Install Homebrew from https://brew.sh"
    else
        sudo apt install ripgrep nodejs
        echo-result "Install nvim dependencies"
        sudo apt install build-essential aria2 htop fastfetch ruby xclip zsh
        echo-result "Install basic dependencies"
    fi
}

function dot-zsh-config() { # configure zsh
    link . zshrc
    link . zsh-prompt.zsh
    link . alias
    touch ~/.hushlogin # suppresses the message when opening a new login shell
}

function dot-nvim-install() { # install nvim
    if [ "$(uname)" = "Darwin" ]; then
        brew install neovim
    else
        sudo apt install neovim
    fi
    echo-todo "Install nerd fonts from https://www.nerdfonts.com/font-downloads"
    echo-todo "E.g., https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/JetBrainsMono.zip"
}

function dot-nvim-config() { # configure nvim
    clone-or-pull git@github.com:initrc/astronvim-template.git $HOME/.config/nvim
    echo-result "Install AstroNvim user config"
    safe-append $HOME/.zshrc "export EDITOR=\"nvim\""
    safe-append $HOME/.zshrc "export VISUAL=\"nvim\""
    echo-result "Set nvim as the default editor"
    link . ideavimrc
    echo-result "Configure ideavimrc"
}

function dot-git-config() { # configure git
    link . gitignore
    git config --global color.diff auto
    git config --global core.excludesfile ~/.gitignore
    git config --global diff.algorithm histogram
    git config --global diff.colorMoved zebra
    git config --global diff.colorMovedWS allow-indentation-change
    echo-result "Configure git"
    echo-todo "brew install difftastic"
    echo-todo "git config --global user.name \"...\""
    echo-todo "git config --global user.email ...@..."
}

function dot-tmux-config() { # configure tmux
    link . tmux.conf
}

function dot-mac-config() { # configure macOS keyboard and mouse
    defaults write -g InitialKeyRepeat -int 15 # default minimum is 15 (225 ms)
    defaults write -g KeyRepeat -int 2 # default minimum is 2 (30 ms)
    defaults write .GlobalPreferences com.apple.mouse.scaling -1 # default acceleration 1.5
    defaults write -g ApplePressAndHoldEnabled 0 # intelliJ cursor move around
    echo-result "Configure macOS"
}

function dot-keyd-win() { # configure keyd (windows keyboard)
    sudo ln -s $PWD/keyd-win.conf /etc/keyd/default.conf
    echo-result "Link /etc/keyd/default.conf"
    echo-todo "Install keyd from https://github.com/rvaiya/keyd"
}

function dot-keyd-mac() { # configure keyd (mac keyboard)
    sudo ln -s $PWD/keyd-mac.conf /etc/keyd/default.conf
    echo-result "Link /etc/keyd/default.conf"
    echo-todo "Install keyd from https://github.com/rvaiya/keyd"
}

# show usage if not run via 'source'
if [[ $0 == ${BASH_SOURCE} ]]; then
    echo-neutral "Usage: source $0\n"
else
    echo-success "[✅] Functions loaded"
fi
cat $0 | grep "^function dot" \
    | sed "s/^function \(dot-[a-zA-Z0-9-]*\)()[ ]*{[ ]*#[ ]*\(.*$\)/\1:\2/g" \
    | awk '{split($0, a, ":"); printf("%-20s: %s\n", a[1], a[2])}'

