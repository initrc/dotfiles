#!/bin/bash

# helper functions
function green-echo() {
    # $1 text to echo
    echo -e "\e[32m$1\e[39m"
}

function link() {
    # $1 category, $2 file to link
    src="$PWD/$1/$2"
    tgt="$HOME/.$2"
    [[ -h "$tgt" ]] && rm $tgt
    ln -s $src $tgt
    [[ $? -eq 0 ]] && green-echo "[OK] Link $2" || echo "[FAIL] Link $2"
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
function dot-linux-dep() { # configure linux - dependency
    sudo apt-get install vim zsh ruby build-essential aria2 silversearcher-ag
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    green-echo "[OK] zsh and basic dependencies installed"
}

function dot-linux() { # configure linux
    # keyboard
    link linux Xmodmap && xmodmap ~/.Xmodmap
    # bluetooth suspend fix
    sudo cp linux/bluetooth-suspend.sh /lib/systemd/system-sleep/
    sudo chmod +x /lib/systemd/system-sleep/bluetooth-suspend.sh
    [[ $? -eq 0 ]] && green-echo "[OK] Bluetooth will be stopped upon system suspending"
}

function dot-mac-dep() { # configure macOS - dependency
    xcode-select --install
    green-echo "[OK] Xcode command line tools installed"
    # https://brew.sh/
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    green-echo "[OK] Brew installed"
}

function dot-mac() { # configure macOS
    defaults write -g InitialKeyRepeat -int 15 # normal minimum is 15 (225 ms)
    defaults write -g KeyRepeat -int 2 # normal minimum is 2 (30 ms)
    defaults write .GlobalPreferences com.apple.mouse.scaling -1 # default acceleration 1.5
    defaults write -g ApplePressAndHoldEnabled 0 # intelliJ cursor move around
    [[ $? -eq 0 ]] && green-echo "[OK] Mac configured"
}

function dot-vim() { # configure vim and plugins
    link vim vim
    link vim vimrc
    dir="$HOME/.vim/bundle/vundle"
    clone-or-pull https://github.com/gmarik/vundle.git $dir
    vim +BundleInstall +qall
    [[ $? -eq 0 ]] && green-echo "[OK] Vim configured, now set it as the default edit"
    sudo update-alternatives --config editor
}

function dot-shell() { # configure zsh/oh-my-zsh
    link sh shrc
    safe-append $HOME/.bash_profile "source \$HOME/.shrc" #macOS
    safe-append $HOME/.bashrc "source \$HOME/.shrc"
    safe-append $HOME/.zshrc "source \$HOME/.shrc"
    safe-append $HOME/.zshrc "ZSH_THEME=\"agnoster\""
    safe-append $HOME/.zshrc "DEFAULT_USER=\"$(whoami)\""
    [[ $? -eq 0 ]] && green-echo "[OK] Zsh configured"
    echo "- [~/.zshrc] Move the theme config to the top"
    echo "- [~/.zshrc] DISABLE_AUTO_TITLE=\"true\""
    echo "- [~/.oh-my-zsh/themes/agnoster.zsh-theme] %s/blue/magenta/g"
    echo "- [~/.oh-my-zsh/themes/agnoster.zsh-theme] Remove RETVAL from build_prompt()"
}

function dot-git() { # configure git and scm_breeze
    link git gitignore_global
    git config --global color.diff always
    git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    git config --global alias.purr "pull --rebase"
    git config --global alias.feature "checkout --track origin/master -b"
    git config --global alias.pushf "push --force-with-lease"
    git config --global core.excludesfile $HOME/.gitignore_global
    git config --global --add oh-my-zsh.hide-dirty 1

    dir="$HOME/.scm_breeze"
    clone-or-pull https://github.com/scmbreeze/scm_breeze.git $dir
    $dir/install.sh
    [[ $? -eq 0 ]] && green-echo "[OK] SCM Breeze installed"
    [[ $? -eq 0 ]] && green-echo "[OK] Git configured"
    echo "- git config --global user.name \"...\""
    echo "- git config --global user.email ...@..."
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
    echo -e "Usage: source $0\n"
else
    green-echo "[OK] Functions loaded"
fi
cat $0 | grep "^function dot" \
    | sed "s/^function \(dot-[a-zA-Z0-9-]*\)()[ ]*{[ ]*#[ ]*\(.*$\)/\1:\2/g" \
    | awk '{split($0, a, ":"); printf("%-20s: %s\n", a[1], a[2])}'

