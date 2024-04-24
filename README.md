dotfiles
========
## Install

- Create and add an [SSH key](https://github.com/settings/keys) to GitHub and clone this repo.
- Source the script will print out all the commands.

```
sudo apt install gawk, xclip, zsh
alias copy="xclip -selection clipboard"

ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
copy ~/.ssh/id_ed25519.pub

git clone git@github.com:initrc/dotfiles.git
source dot.sh
```

## Commands
```
dot-sys-dep         : install system dependencies
dot-sys-config      : configure system (keyboard, mouse, fixes)
dot-zsh-install     : install oh-my-zsh
dot-zsh-config      : configure zsh
dot-nvim-install    : install nvim
dot-nvim-config     : configure nvim
dot-git-config      : configure git
dot-git-scm-breeze  : install git scm-breeze
dot-apt-remove      : remove linux bloatware 
```

