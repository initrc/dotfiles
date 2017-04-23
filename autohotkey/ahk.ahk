﻿#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

CapsLock::Send {Esc}
>!h::Send {Left}
>!j::Send {Down}
>!k::Send {Up}
>!l::Send {Right}
!{::Send ^{PgUp}
!}::Send ^{PgDn}
!a::Send ^{a}
!b::Send ^{b}
!c::Send ^{c}
!d::Send ^{d}
!e::Send ^{e}
!f::Send ^{f}
!g::Send ^{g}
!h::Send ^{h}
!i::Send ^{i}
!j::Send ^{j}
!k::Send ^{k}
!l::Send ^{l}
!m::Send ^{m}
!n::Send ^{n}
!o::Send ^{o}
!p::Send ^{p}
!q::Send !{F4}
!r::Send ^{r}
!s::Send ^{s}
!t::Send ^{t}
!u::Send ^{u}
!v::Send ^{v}
!w::Send ^{F4}
!x::Send ^{x}
!y::Send ^{y}
!z::Send ^{z}
!1::Send ^{1}
!2::Send ^{2}
!3::Send ^{3}
!4::Send ^{4}
!5::Send ^{5}
!6::Send ^{6}
!7::Send ^{7}
!8::Send ^{8}
!9::Send ^{9}
!0::Send ^{0}
