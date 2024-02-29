#!/bin/bash

source helper.sh

function dot-dep() { # install dependencies
    if [ "$(uname)" = "Darwin" ]; then
        xcode-select --install
        echo-result "Install Xcode command line tools"
        echo-todo "Install Homebrew from https://brew.sh"
    else
        sudo apt install ripgrep nodejs
        echo-result "Install NeoVim dependencies"
        sudo apt install build-essential aria2 htop neofetch zsh
        echo-result "Install basic dependencies"
    fi
}

function dot-vim() { # install NeoVim
    echo-todo "Install nerd fonts from https://www.nerdfonts.com/font-downloads"
    echo-todo "E.g., https://github.com/ryanoasis/nerd-fonts/releases/download/v3.1.1/Hack.zip"
    echo-todo "Install NeoVim from snap or apt that meets the minimum version requirement from AstroNvim"
    echo-todo "Install AstroNvim from https://docs.astronvim.com"
}

function dot-vim-config() { # configure NeoVim
    clone-or-pull git@github.com:initrc/astronvim-user-config.git $HOME/.config/nvim/lua/user
    echo-result "Install AstroNvim user config"
    safe-append $HOME/.zshrc "export EDITOR=\"nvim\""
    safe-append $HOME/.zshrc "export VISUAL=\"nvim\""
    echo-result "Set NeoVim as the default editor"
}

function dot-shell() { # install oh-my-zsh
    echo-todo "Install oh-my-zsh from https://ohmyz.sh/#install"
}

function dot-shell-config() { # configure zsh
    link . alias
    if [ "$(uname)" = "Darwin" ]; then
        # use linux lscolors on macOS
        safe-append $HOME/.zshrc "export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd"
    fi
    safe-append $HOME/.zshrc "source \$HOME/.alias"
    safe-append $HOME/.zshrc "ZSH_THEME=\"agnoster\""
    echo-result "Configure zsh"
    echo-todo "[~/.zshrc] Move the theme config to the top"
    echo-todo "[~/.oh-my-zsh/themes/agnoster.zsh-theme] Comment out RETVAL from build_prompt()"
}

function dot-git-config() { # configure git
    link . gitignore
    git config --global color.diff always
    git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    git config --global alias.purr "pull --rebase"
    git config --global alias.feature "checkout --track origin/master -b"
    git config --global alias.pushf "push --force-with-lease"
    git config --global core.excludesfile ~/.gitignore
    echo-result "Configure git"
    echo-todo "git config --global user.name \"...\""
    echo-todo "git config --global user.email ...@..."
}

function dot-git-scm-breeze() { # install scm-breeze
    sudo apt install ruby
    echo-result "Install SCM Breeze dependencies"
    dir="$HOME/.scm_breeze"
    clone-or-pull https://github.com/scmbreeze/scm_breeze.git $dir
    $dir/install.sh
    echo-result "Install SCM Breeze"
}

function dot-linux-advanced() { # configure linux
    # TODO
    # keyboard
    link linux xkeysnail-config.py
    link linux xsessionrc
    echo-result "See linux/xkeysnail-unsudo.sh to run without sudo"
    # bluetooth suspend fix
    sudo cp linux/bluetooth-suspend.sh /lib/systemd/system-sleep/
    sudo chmod +x /lib/systemd/system-sleep/bluetooth-suspend.sh
    echo-result "Bluetooth will be stopped upon system suspending"
}

function dot-mac() { # configure macOS
    defaults write -g InitialKeyRepeat -int 15 # default minimum is 15 (225 ms)
    defaults write -g KeyRepeat -int 2 # default minimum is 2 (30 ms)
    defaults write .GlobalPreferences com.apple.mouse.scaling -1 # default acceleration 1.5
    defaults write -g ApplePressAndHoldEnabled 0 # intelliJ cursor move around
    echo-result "Configure macOS"
}

function dot-python-linux() { # configure python on linux
    # https://github.com/pyenv/pyenv#automatic-installer
    curl https://pyenv.run | bash
    # https://github.com/pyenv/pyenv/wiki#suggested-build-environment
    sudo apt update
    sudo apt install build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev curl \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
}

function dot-python-mac() { # configure python on macOS
    brew update && brew install pyenv
    # https://github.com/pyenv/pyenv/wiki#suggested-build-environment
    brew install openssl readline sqlite3 xz zlib tcl-tk
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

