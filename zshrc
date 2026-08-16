export EDITOR="nvim"
export VISUAL="nvim"
typeset -U path PATH
path=(
  "$HOME/.local/share/nvim/mason/bin" # nvim language servers and linters
  $path
)

source "$HOME/.alias"
source "$HOME/.alias2"
source "$HOME/.zsh-prompt.zsh"

export FZF_ALT_C_OPTS='--walker-skip .git,node_modules,target,Library'
export FZF_CTRL_T_OPTS='--walker-skip .git,node_modules,target,Library'
source <(fzf --zsh)

