# color and prompt
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
#export PS1="\u@\h:\w "
export PS1="\u:\w "

# path
#export JAVA_HOME=`/usr/libexec/java_home`
PATH="/usr/local/bin:$PATH:$HOME/.rvm/bin"
export PATH

# source
[ -s "$HOME/.rvm/scripts/rvm" ] && source "$HOME/.rvm/scripts/rvm"
[ -s "$HOME/.scm_breeze/scm_breeze.sh" ] && source "$HOME/.scm_breeze/scm_breeze.sh"

# alias
alias s='cd ..'
alias l='ls -al'
if [ "$(uname)" == "Darwin" ]; then
    alias tmux='tmux -2 -f ~/.tmux-osx.conf'
else
    alias tmux='tmux -2'
fi
