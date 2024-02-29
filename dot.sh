#!/bin/bash

source helper.sh

function dot-linux-dep() { # install linux dependencies
    sudo apt install ripgrep
    echo-success "[OK] Installed NeoVim dependencies"
    sudo apt install build-essential aria2 htop neofetch
    echo-success "[OK] Installed basic dependencies"
}

function dot-vim() { # Install AstroNvim
    echo-neutral "[TODO] Install nerd fonts from https://www.nerdfonts.com/font-downloads"
    echo-neutral "       E.g., https://github.com/ryanoasis/nerd-fonts/releases/download/v3.1.1/Hack.zip"
    echo-neutral "[TODO] Install NeoVim from snap or apt that meets the minimum version requirement from AstroNvim"
    echo-neutral "[TODO] Install AstroNvim from https://docs.astronvim.com"
    # TODO: sudo update-alternatives --config editor
}

function dot-vim-config() { # Install AstroNvim user config
    clone-or-pull git@github.com:initrc/astronvim-user-config.git $HOME/.config/nvim/lua/user
    echo-success "[OK] Installed AstroNvim user config"
}

function dot-shell() { # configure zsh
    echo-neutral "[..] Installing zsh"
    sudo apt install zsh
    echo-success "[OK] Installed zsh"
    link . alias
    safe-append $HOME/.zshrc "source \$HOME/.alias"
    safe-append $HOME/.zshrc "ZSH_THEME=\"agnoster\""
    [[ $? -eq 0 ]] && echo-success "[OK] Zsh configured"
    echo-neutral "[TODO] [~/.zshrc] Move the theme config to the top"
    echo-neutral "[TODO] [~/.oh-my-zsh/themes/agnoster.zsh-theme] %s/blue/magenta/g"
    echo-neutral "[TODO] [~/.oh-my-zsh/themes/agnoster.zsh-theme] Comment out RETVAL from build_prompt()"
}

function dot-git-config() { # configure git
    link . gitignore
    git config --global color.diff always
    git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    git config --global alias.purr "pull --rebase"
    git config --global alias.feature "checkout --track origin/master -b"
    git config --global alias.pushf "push --force-with-lease"
    git config --global core.excludesfile ~/.gitignore
    [[ $? -eq 0 ]] && echo-success "[OK] Configured git"
    echo-neutral "[TODO] git config --global user.name \"...\""
    echo-neutral "[TODO] git config --global user.email ...@..."
}

function dot-git-scm-breeze() { # install scm-breeze
    echo-neutral "[..] Installing SCM Breeze dependencies"
    sudo apt install ruby
    echo-success "[OK] Installed SCM Breeze dependencies"
    dir="$HOME/.scm_breeze"
    clone-or-pull https://github.com/scmbreeze/scm_breeze.git $dir
    $dir/install.sh
    [[ $? -eq 0 ]] && echo-success "[OK] Installed SCM Breeze"
}

function dot-linux-advanced() { # configure linux
    # TODO
    # keyboard
    link linux xkeysnail-config.py
    link linux xsessionrc
    echo-success "[OK] See linux/xkeysnail-unsudo.sh to run without sudo"
    # bluetooth suspend fix
    sudo cp linux/bluetooth-suspend.sh /lib/systemd/system-sleep/
    sudo chmod +x /lib/systemd/system-sleep/bluetooth-suspend.sh
    [[ $? -eq 0 ]] && echo-success "[OK] Bluetooth will be stopped upon system suspending"
}

#
# TODO
#
function dot-mac-dep() { # install macOS dependencies
    xcode-select --install
    echo-success "[OK] Xcode command line tools installed"
    echo-neutral "[TODO] Install Homebrew from https://brew.sh"
}

function dot-mac() { # configure macOS
    defaults write -g InitialKeyRepeat -int 15 # normal minimum is 15 (225 ms)
    defaults write -g KeyRepeat -int 2 # normal minimum is 2 (30 ms)
    defaults write .GlobalPreferences com.apple.mouse.scaling -1 # default acceleration 1.5
    defaults write -g ApplePressAndHoldEnabled 0 # intelliJ cursor move around
    [[ $? -eq 0 ]] && echo-success "[OK] Mac configured"
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
    echo-success "[OK] Functions loaded"
fi
cat $0 | grep "^function dot" \
    | sed "s/^function \(dot-[a-zA-Z0-9-]*\)()[ ]*{[ ]*#[ ]*\(.*$\)/\1:\2/g" \
    | awk '{split($0, a, ":"); printf("%-20s: %s\n", a[1], a[2])}'

