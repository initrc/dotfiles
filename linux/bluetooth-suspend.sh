#!/bin/bash
# https://askubuntu.com/questions/797590/ubuntu-wakes-up-immediately-after-suspend-when-usb-mouse-is-connected

if [ "${1}" == "pre" ]; then
    service bluetooth stop
elif [ "${1}" == "post" ]; then
    service bluetooth start
fi

