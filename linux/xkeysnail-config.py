import re
from xkeysnail.transform import *

# define timeout for multipurpose_modmap
define_timeout(1)

define_modmap({
    Key.LEFT_ALT: Key.LEFT_CTRL,
    Key.LEFT_CTRL: Key.LEFT_ALT,
})

define_multipurpose_modmap({
    Key.CAPSLOCK: [Key.ESC, Key.RIGHT_CTRL],
})

define_keymap(None, {
    # arrow keys
    K("RM-h"): Key.LEFT,
    K("RM-j"): Key.DOWN,
    K("RM-k"): Key.UP,
    K("RM-l"): Key.RIGHT,

    # caps
    K("RC-a"): Key.HOME,
    K("RC-Shift-a"): K("Shift-Home"),
    K("RC-e"): Key.END,
    K("RC-Shift-e"): K("Shift-End"),

    # switch tabs
    K("LC-Shift-Left_Brace"): K("C-Page_up"),
    K("LC-Shift-Right_Brace"): K("C-Page_down"),
}, "Global")

define_keymap(re.compile("Chromium-browser|Google-chrome|Firefox"), {
    # open in new tab
    K("LC-Enter"): K("M-Enter"),
    K("LM-Enter"): K("C-Enter"),

    # alt-tab to switch browser tabs because ctrl-tab is used to toggle through windows in settings
    K("LM-Shift-Tab"): K("C-Page_up"),
    K("LM-Tab"): K("C-Page_down"),
}, "Browser")

define_keymap(re.compile("konsole"), {
    K("LC-c"): K("C-Shift-c"),
}, "Terminal")

