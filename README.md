# dotfiles

## Install

- Generate a new SSH key and add it to your [GitHub settings](https://github.com/settings/keys) if you are setting up a fresh OS install. 

```
sudo apt install gawk xclip zsh && alias copy="xclip -selection clipboard"

ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519 && copy ~/.ssh/id_ed25519.pub
```
- Clone this repo and source `dot.sh`.

```
git clone git@github.com:initrc/dotfiles.git && cd dotfiles && source dot.sh
```

## Usage

Source or execute `dot.sh` to show the commands.

```
dot-sys-dep         : install system dependencies
dot-zsh-install     : install oh-my-zsh
dot-zsh-config      : configure zsh
dot-nvim-install    : install nvim
dot-nvim-config     : configure nvim
dot-git-config      : configure git
dot-mac-config      : configure macOS keyboard and mouse
```

