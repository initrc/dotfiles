# editor and binding
export EDITOR="nvim"
export VISUAL="nvim"
bindkey -e # use emacs bindings like C-p/n/a/e

# path
typeset -U path PATH
path=(
  "$HOME/.local/share/nvim/mason/bin" # nvim language servers and linters
  $path
)

# alias
source "$HOME/.alias"
source "$HOME/.alias2"
source "$HOME/.zsh-prompt.zsh"

# fzf
export FZF_ALT_C_OPTS='--walker-skip .git,node_modules,target,Library'
export FZF_CTRL_T_OPTS='--walker-skip .git,node_modules,target,Library'
source <(fzf --zsh)

# zoxide
eval "$(zoxide init zsh)"
