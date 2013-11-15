# prompt
#export PS1="\[\033[1;32m\]\u\[\033[1;34m\]:\w\[\033[1;32m\] $\[\033[00m\] "
export PS1="\u\[\033[1;32m\]:\w \[\033[00m\]"

# path
PATH="/usr/local/bin:$PATH:$HOME/.rvm/bin"
export PATH

# source
[ -s "$HOME/.rvm/scripts/rvm" ] && source "$HOME/.rvm/scripts/rvm"
[ -s "$HOME/.scm_breeze/scm_breeze.sh" ] && source "$HOME/.scm_breeze/scm_breeze.sh"

# alias
alias s='cd ..'
alias l='ls -al'
alias f='find . -name'
if [ "$(uname)" == "Darwin" ]; then
    alias tmux='tmux -2 -f ~/.tmux-osx.conf'
else
    alias tmux='tmux -2'
    alias ls='ls --color=auto'
fi

# extra alias
[ -s "$HOME/.bash_extra" ] && source "$HOME/.bash_extra"
