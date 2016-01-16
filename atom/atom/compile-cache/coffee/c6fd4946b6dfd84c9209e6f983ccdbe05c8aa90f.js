
/*
  == ATOM-TERMINAL-PANEL  HELPERS PLUGIN ==

  Atom-terminal-panel builtin plugin v1.0.0
  -isis97

  Contains helper commands (mainly for C/C++ compilation/testing).
  These commands are defined just for testing purposes.
  You can remove this file safely.

  MIT License
  Feel free to do anything with this file.
 */

(function() {
  module.exports = {
    "compile": {
      "description": "Compiles the currently opened C/C++ file using g++.",
      "command": function(state, args) {
        var ADDITIONAL_FLAGS, COMPILER_FLAGS, COMPILER_NAME, SOURCE_FILE, TARGET_FILE;
        SOURCE_FILE = state.getCurrentFilePath();
        COMPILER_NAME = 'g++';
        COMPILER_FLAGS = ' -lm -std=c++0x -O2 -m32 -Wl,--oformat,pei-i386 -Wall' + ' -W -Wextra -Wdouble-promotion -pedantic -Wmissing-include-dirs' + ' -Wunused -Wuninitialized -Wextra -Wstrict-overflow=3 -Wtrampolines' + ' -Wfloat-equal -Wconversion -Wmissing-field-initializers -Wno-multichar' + ' -Wpacked -Winline -Wshadow';
        TARGET_FILE = "" + SOURCE_FILE + ".exe";
        TARGET_FILE = state.replaceAll('.cpp', '', TARGET_FILE);
        TARGET_FILE = state.replaceAll('.c', '', TARGET_FILE);
        ADDITIONAL_FLAGS = "";
        state.exec("" + COMPILER_NAME + " " + COMPILER_FLAGS + " \"" + SOURCE_FILE + "\" -o \"" + TARGET_FILE + "\" " + ADDITIONAL_FLAGS, args, state);
        return "";
      }
    },
    "run": {
      "params": "[name]",
      "description": "! Only for testing purposes. (meaningless). Runs the [name].exe file.",
      "command": function(state, args) {
        var SOURCE_FILE, TARGET_FILE;
        SOURCE_FILE = state.getCurrentFilePath();
        TARGET_FILE = "" + SOURCE_FILE + ".exe";
        return state.exec("\"" + TARGET_FILE + "\"", args, state);
      }
    },
    "test": {
      "params": "[name]",
      "description": "Tests the specified file with the input file. (executes [name].exe < [name])",
      "command": function(state, args) {
        var app_file, app_name_match, app_name_matcher, test_file;
        test_file = args[0];
        app_name_matcher = /([^0-9])*/ig;
        app_name_match = app_name_matcher.exec(test_file);
        app_file = app_name_match[0] + '.exe';
        state.execDelayedCommand('250', "" + app_file + " < " + test_file);
        return 'Probing application input ' + state.consoleLink(app_file) + ' < ' + state.consoleLink(test_file);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9jb21tYW5kcy9oZWxwZXJzL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7Ozs7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQWUscURBQWY7QUFBQSxNQUNBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLHlFQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWMsS0FBSyxDQUFDLGtCQUFOLENBQUEsQ0FBZCxDQUFBO0FBQUEsUUFDQSxhQUFBLEdBQWdCLEtBRGhCLENBQUE7QUFBQSxRQUVBLGNBQUEsR0FBaUIsdURBQUEsR0FDaEIsaUVBRGdCLEdBRWhCLHFFQUZnQixHQUdoQix5RUFIZ0IsR0FJaEIsNkJBTkQsQ0FBQTtBQUFBLFFBT0EsV0FBQSxHQUFjLEVBQUEsR0FBRyxXQUFILEdBQWUsTUFQN0IsQ0FBQTtBQUFBLFFBUUEsV0FBQSxHQUFjLEtBQUssQ0FBQyxVQUFOLENBQWlCLE1BQWpCLEVBQXlCLEVBQXpCLEVBQTZCLFdBQTdCLENBUmQsQ0FBQTtBQUFBLFFBU0EsV0FBQSxHQUFjLEtBQUssQ0FBQyxVQUFOLENBQWlCLElBQWpCLEVBQXVCLEVBQXZCLEVBQTJCLFdBQTNCLENBVGQsQ0FBQTtBQUFBLFFBVUEsZ0JBQUEsR0FBbUIsRUFWbkIsQ0FBQTtBQUFBLFFBV0EsS0FBSyxDQUFDLElBQU4sQ0FBVyxFQUFBLEdBQUcsYUFBSCxHQUFpQixHQUFqQixHQUFvQixjQUFwQixHQUFtQyxLQUFuQyxHQUF3QyxXQUF4QyxHQUFvRCxVQUFwRCxHQUE4RCxXQUE5RCxHQUEwRSxLQUExRSxHQUErRSxnQkFBMUYsRUFBOEcsSUFBOUcsRUFBb0gsS0FBcEgsQ0FYQSxDQUFBO0FBWUEsZUFBTyxFQUFQLENBYlM7TUFBQSxDQURYO0tBREY7QUFBQSxJQWlCQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsTUFDQSxhQUFBLEVBQWUsdUVBRGY7QUFBQSxNQUVBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLHdCQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWMsS0FBSyxDQUFDLGtCQUFOLENBQUEsQ0FBZCxDQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWMsRUFBQSxHQUFHLFdBQUgsR0FBZSxNQUQ3QixDQUFBO0FBRUEsZUFBTyxLQUFLLENBQUMsSUFBTixDQUFZLElBQUEsR0FBSSxXQUFKLEdBQWdCLElBQTVCLEVBQWlDLElBQWpDLEVBQXVDLEtBQXZDLENBQVAsQ0FIUztNQUFBLENBRlg7S0FsQkY7QUFBQSxJQXlCQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsTUFDQSxhQUFBLEVBQWUsOEVBRGY7QUFBQSxNQUVBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLHFEQUFBO0FBQUEsUUFBQSxTQUFBLEdBQVksSUFBSyxDQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsZ0JBQUEsR0FBbUIsYUFEbkIsQ0FBQTtBQUFBLFFBRUEsY0FBQSxHQUFpQixnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixTQUF0QixDQUZqQixDQUFBO0FBQUEsUUFHQSxRQUFBLEdBQVcsY0FBZSxDQUFBLENBQUEsQ0FBZixHQUFvQixNQUgvQixDQUFBO0FBQUEsUUFJQSxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsS0FBekIsRUFBZ0MsRUFBQSxHQUFHLFFBQUgsR0FBWSxLQUFaLEdBQWlCLFNBQWpELENBSkEsQ0FBQTtBQUtBLGVBQU8sNEJBQUEsR0FBK0IsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsUUFBbEIsQ0FBL0IsR0FBNkQsS0FBN0QsR0FBcUUsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsU0FBbEIsQ0FBNUUsQ0FOUztNQUFBLENBRlg7S0ExQkY7R0FkRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/commands/helpers/index.coffee
