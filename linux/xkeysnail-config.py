import re
from xkeysnail.transform import *

# define timeout for multipurpose_modmap
define_timeout(1)

define_modmap({
    Key.LEFT_ALT: Key.LEFT_CTRL,
    Key.LEFT_CTRL: Key.LEFT_META,
    Key.LEFT_META: Key.LEFT_ALT,
    Key.RIGHT_ALT: Key.RIGHT_CTRL,
    Key.RIGHT_CTRL: Key.RIGHT_ALT,
})

define_multipurpose_modmap({
    Key.CAPSLOCK: [Key.ESC, Key.RIGHT_CTRL],
})

define_keymap(None, {
    # arrow keys
    K("RC-h"): Key.LEFT,
    K("RC-j"): Key.DOWN,
    K("RC-k"): Key.UP,
    K("RC-l"): Key.RIGHT,

    # home/end
    K("RC-a"): Key.HOME,
    K("RC-Shift-a"): K("Shift-Home"),
    K("RC-e"): Key.END,
    K("RC-Shift-e"): K("Shift-End"),
    K("LC-Left"): Key.HOME,
    K("LC-Shift-Left"): K("Shift-Home"),
    K("LC-Right"): Key.END,
    K("LC-Shift-Right"): K("Shift-End"),

    # switch tabs
    K("C-Shift-Left_Brace"): K("C-Page_up"),
    K("C-Shift-Right_Brace"): K("C-Page_down"),
}, "Global")

# Run `xprop | grep WM_CLASS` and click on the window to check the app name
# The first string is the application's resource name, and the second is the application's class name.
# xkeysnail uses the class name for app-specific mappings.
define_keymap(re.compile("Chromium-browser|Google-chrome|Firefox"), {
    K("LC-y"): K("LC-h")
}, "Browser")

