call pathogen#infect()

"powerline
let g:Powerline_symbols = 'fancy'

"nerd tree
autocmd vimenter * if !argc() | NERDTree | endif
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif

"ui
let &t_Co=256
colorscheme mustang
syn on
set number
set laststatus=2

"tab
set tabstop=4
set shiftwidth=4
set expandtab

"indent
set ai
set autoindent
set smartindent
filetype indent on
filetype on
filetype plugin on

"whitespaces
set listchars=tab:>-,trail:~
set list
set listchars=tab:>-
set listchars+=trail:.
autocmd FileType c,cpp,java,py,rb,xml,sh,markdown,vim autocmd BufWritePre <buffer> :%s/\s\+$//e

"search
set hlsearch
set incsearch
set showmatch
set ignorecase
set smartcase

"tabstop=2
au BufNewFile,BufRead *.py,*.rb,*.vim set tabstop=2
au BufNewFile,BufRead *.py,*.rb,*.vim set shiftwidth=2

"encoding
set fileencodings=utf-8,gb2312,gbk,gb18030
