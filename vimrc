"vundle
set nocompatible
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()
filetype plugin indent on
Bundle 'gmarik/vundle'
"code completion
Bundle 'Valloric/YouCompleteMe'
"fancy
Bundle 'bling/vim-airline'
"file
Bundle 'scrooloose/nerdtree'
Bundle 'kien/ctrlp.vim'
"git
Bundle 'tpope/vim-fugitive'

"you complete me
let g:ycm_autoclose_preview_window_after_completion = 1
let g:ycm_autoclose_preview_window_after_insertion = 1

"airline
let g:airline_powerline_fonts=1

"nerdtree
autocmd vimenter * if !argc() | NERDTree | endif
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif
let NERDTreeIgnore = ['\.pyc$']

"ctrlp
let g:ctrlp_map = '//'
let g:ctrlp_working_path_mode = 'ra'
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
" H and L for head and end of line
noremap H ^
noremap L $
" U to redo
nnoremap U <C-r>
" window
nnoremap <silent> gh :wincmd h<CR>
nnoremap <silent> gj :wincmd j<CR>
nnoremap <silent> gk :wincmd k<CR>
nnoremap <silent> gl :wincmd l<CR>
nnoremap <silent> gp :wincmd p<CR>
nnoremap <silent> g= :wincmd =<CR>
nnoremap <silent> gx :wincmd x<CR>
" last command
nmap <F8> <Esc>:w<CR>:!%:p<CR>
imap <F8> <Esc>:w<CR>:!%:p<CR>

"ignore
set wildignore=*/tmp/*,*.pyc,*.o,*~,*.so,*.swp,*.zip,*.jpg,*.png,*.gif
