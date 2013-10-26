"vundle
set nocompatible
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()
filetype plugin indent on
Bundle 'gmarik/vundle'
"fancy
Bundle 'bling/vim-airline'
"file
Bundle 'scrooloose/nerdtree'
Bundle 'kien/ctrlp.vim'
"git
Bundle 'tpope/vim-fugitive'

"airline
let g:airline_powerline_fonts=1

"nerd tree
autocmd vimenter * if !argc() | NERDTree | endif
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif

"ctrlp
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
let g:ctrlp_working_path_mode = 'ra'
set wildignore+=*/tmp/*,*.so,*.swp,*.zip,*.jpg,*.png,*.gif
let g:ctrlp_custom_ignore = '\v[\/]\.(git|hg|svn)$'
let g:ctrlp_user_command = 'find %s -type f'

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
filetype plugin indent on

"whitespaces
set listchars=tab:>-,trail:~
set list
set listchars=tab:>-
set listchars+=trail:.
"autocmd FileType c,cpp,java,py,rb,html,xml,sh,markdown,vim autocmd BufWritePre <buffer> :%s/\s\+$//e

"search
set hlsearch
set incsearch
set showmatch
set ignorecase
set smartcase

"tabstop=2
au BufNewFile,BufRead *.vim,*.html,*.css,*.js set tabstop=2
au BufNewFile,BufRead *.vim,*.html,*.css,*.js set shiftwidth=2

"encoding
set fileencodings=utf-8,gb2312,gbk,gb18030

"mapping
" esc is too far away
inoremap jk <Esc>
" map ; to : for less keystrokes
nnoremap ; :
vnoremap ; :
" last command
nmap <F8> <Esc>:w<CR>:!%:p<CR>
imap <F8> <Esc>:w<CR>:!%:p<CR>
