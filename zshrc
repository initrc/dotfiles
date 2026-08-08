export EDITOR="nvim"
export VISUAL="nvim"
export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd # linux ls colors

source "$HOME/.alias"
source "$HOME/.alias2"
source "$HOME/.local/bin/env"

eval "$(fnm env --use-on-cd --shell zsh)"
eval "$(starship init zsh)"
