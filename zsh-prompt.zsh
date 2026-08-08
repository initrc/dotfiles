# Powerline-style directory and Git prompt
# Inspired by https://github.com/agnoster/agnoster-zsh-theme/blob/master/agnoster.zsh-theme

# zmodload zsh/datetime # for perf evaluation

_powerline_prompt_precmd() {
    # local -F prompt_started_at=$EPOCHREALTIME # for perf evaluation
    local git_output git_exit line branch='' oid='' branch_bg='green'
    local dirty=0
    local separator=''     # U+E0B0, Powerline right hard divider
    local branch_symbol='' # U+E0A0, Powerline branch symbol

    # porcelain v2 provides branch metadata and dirty state in one call
    # disabling optional locks prevents status checks from writing to the index
    git_output=$(GIT_OPTIONAL_LOCKS=0 command git status \
        --porcelain=v2 --branch --no-renames 2>/dev/null)
    git_exit=$?

    if (( git_exit == 0 )); then
        # header records begin with '#'; any other record is a worktree change
        # IFS= preserves leading and trailing whitespace, -r treats backslashes literally
        while IFS= read -r line; do
            case "$line" in
                # e.g., branch.head main => branch=main after # removes the shortest matching prefix
                '# branch.head '*) branch=${line#\# branch.head } ;;
                '# branch.oid '*)  oid=${line#\# branch.oid } ;;
                '# '*) ;;
                # matches any other nonempty line as Git emits records for files that are modified
                ?*) dirty=1 ;;
            esac
        done <<< "$git_output"

        # a detached HEAD has no branch name, so show its short commit ID
        # -z: has zero length
        if [[ -z "$branch" || "$branch" == '(detached)' ]]; then
            # -n: haz nonzero length, (initial) is Git's placeholder when the repo has no commits
            if [[ -n "$oid" && "$oid" != '(initial)' ]]; then
                branch="HEAD@${oid[1,7]}"
            else
                branch='HEAD'
            fi
        fi

        (( dirty )) && branch_bg='magenta'

        # Zsh interprets percent signs in PROMPT, so escape any in the branch name
        # // replace every occurrence, %% displays one literal percent sign in prompt syntax
        branch=${branch//\%/%%}

        # blue directory segment followed by a green (clean) or magenta (dirty) Git segment
        # %f: reset the foreground color.
        # %b: turn off bold text.
        # %k: reset the background color.
        # %~: display the current directory, using ~ for the home directory.
        PROMPT="%f%b%k%K{blue}%F{black} %~ %K{$branch_bg}%F{blue}${separator}%F{black} ${branch_symbol} ${branch} %k%F{$branch_bg}${separator}%f "
    else
        PROMPT="%f%b%k%K{blue}%F{black} %~ %k%F{blue}${separator}%f "
    fi

    # printf 'Prompt generated in %.2f ms\n' \
    #    "$(( (EPOCHREALTIME - prompt_started_at) * 1000 ))" # for perf evaluation
}

autoload -Uz add-zsh-hook
add-zsh-hook precmd _powerline_prompt_precmd
