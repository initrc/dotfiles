if &term =~ "xterm"
    "256 color
    let &t_Co=256
    "restore screen after quitting
    set t_ti=ESC7ESC[rESC[?47h t_te=ESC[?47lESC8
    if has("terminfo")
        let &t_Sf="\ESC[3%p1%dm"
        let &t_Sb="\ESC[4%p1%dm"
    else
        let &t_Sf="\ESC[3%dm"
        let &t_Sb="\ESC[4%dm"
    endif
endif

"ui
colorscheme mustang
syn on
set number

"tab
set tabstop=2
set shiftwidth=2

"indent
set ai
set autoindent
set smartindent
filetype indent on
filetype on
filetype plugin on

"search
set hlsearch
set incsearch
set showmatch
set ignorecase
set smartcase

"python
au BufNewFile,BufRead *.py set expandtab
au BufNewFile,BufRead *.py set listchars=tab:>-,trail:~
au BufNewFile,BufRead *.py set list
au BufNewFile,BufRead *.py set listchars=tab:>-
au BufNewFile,BufRead *.py set listchars+=trail:.

"encoding
set fileencodings=utf-8,gb2312,gbk,gb18030

