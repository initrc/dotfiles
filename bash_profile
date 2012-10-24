export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
#export PS1="\u@\h:\w "
export PS1="\u:\w "
export JAVA_HOME=`/usr/libexec/java_home`
# Android
#export ANDROID_SDK=~/dev/android-sdk-macosx
#PATH="$PATH:~/bin:$ANDROID_SDK/tools:$ANDROID_SDK/platform-tools:$ARM_GNUEABI/bin"
PATH="/usr/local/bin:$PATH"
export PATH
alias s='cd ..'
alias l='ls -al'

[ -s "/Users/david/.scm_breeze/scm_breeze.sh" ] && source "/Users/david/.scm_breeze/scm_breeze.sh"
