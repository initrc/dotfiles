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
        sudo apt install build-essential aria2 htop neofetch ruby xclip zsh
        echo-result "Install basic dependencies"
    fi
}

function dot-sys-config() { # configure system (keyboard, mouse, fixes)
    if [ "$(uname)" = "Darwin" ]; then
        mac-config
    else
        linux-keymap
    fi
}

function dot-zsh-install() { # install oh-my-zsh
    echo-todo "Install oh-my-zsh from https://ohmyz.sh/#install"
}

function dot-zsh-config() { # configure zsh
    link . alias
    if [ "$(uname)" = "Darwin" ]; then
        # use linux lscolors on macOS
        safe-append $HOME/.zshrc "export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd"
    fi
    safe-append $HOME/.zshrc "DEFAULT_USER=\"$(whoami)\""
    safe-append $HOME/.zshrc "source \$HOME/.alias"
    safe-append $HOME/.zshrc "ZSH_THEME=\"agnoster\""
    echo-result "Configure zsh"
    echo-todo "[~/.zshrc] Move the theme config to the top"
    echo-todo "[~/.oh-my-zsh/themes/agnoster.zsh-theme] Comment out RETVAL from build_prompt()"
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
    link .ideavimrc
    echo-result "Configure ideavimrc"
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

function dot-git-scm-breeze() { # install git scm-breeze
    dir="$HOME/.scm_breeze"
    clone-or-pull https://github.com/scmbreeze/scm_breeze.git $dir
    $dir/install.sh
    echo-result "Install SCM Breeze"
}

function linux-bluetooth-fix() { # linux bluetooth suspend fix, not needed in 24.04
    sudo cp linux/bluetooth-suspend.sh /lib/systemd/system-sleep/
    sudo chmod +x /lib/systemd/system-sleep/bluetooth-suspend.sh
    echo-result "Fix the bluetooth keyboard issue that wakes up the system immediately after the system suspended"
}

function linux-keymap() { # linux custom keymap with xkeysnail
    sudo apt install python3-pip
    sudo pip3 install xkeysnail --break-system-packages
    echo-result "Install xkeysnail"
    link linux xkeysnail-config.py
    link linux xsessionrc

    # https://github.com/joshgoebel/keyszer
    xset r rate 250 25
    echo-result "Set the virtual keyboard delay (250 ms) and repeat rate (20/s) to match the real keyboard"

    # run xkeysnail without sudo
    # https://github.com/mooz/xkeysnail/issues/64#issuecomment-600380800
    sudo groupadd -f uinput
    sudo gpasswd -a $USER uinput
    sudo cp linux/70-xkeysnail.rules /etc/udev/rules.d/
    echo-result "Reboot to run xkeysnail without sudo"
}

function mac-config() { # macOS keyboard and mouse config
    defaults write -g InitialKeyRepeat -int 15 # default minimum is 15 (225 ms)
    defaults write -g KeyRepeat -int 2 # default minimum is 2 (30 ms)
    defaults write .GlobalPreferences com.apple.mouse.scaling -1 # default acceleration 1.5
    defaults write -g ApplePressAndHoldEnabled 0 # intelliJ cursor move around
    echo-result "Configure macOS"
}

function pyenv-install() { # install pyenv
    if [ "$(uname)" = "Darwin" ]; then
        brew update && brew install pyenv
        # https://github.com/pyenv/pyenv/wiki#suggested-build-environment
        brew install openssl readline sqlite3 xz zlib tcl-tk
    else
        # https://github.com/pyenv/pyenv#automatic-installer
        curl https://pyenv.run | bash
        # https://github.com/pyenv/pyenv/wiki#suggested-build-environment
        sudo apt update
        sudo apt install build-essential libssl-dev zlib1g-dev \
            libbz2-dev libreadline-dev libsqlite3-dev curl \
            libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
    fi
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

