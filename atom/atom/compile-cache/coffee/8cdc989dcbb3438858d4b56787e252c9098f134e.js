
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  Class containing all builtin commands.
 */

(function() {
  var core;

  core = include('atp-core');

  module.exports = {
    "encode": {
      "params": "[encoding standard]",
      "deprecated": true,
      "description": "Change encoding.",
      "command": function(state, args) {
        var encoding;
        encoding = args[0];
        state.streamsEncoding = encoding;
        state.message('Changed encoding to ' + encoding);
        return null;
      }
    },
    "ls": {
      "description": "Lists files in the current directory.",
      "command": function(state, args) {
        state.commandLineNotCounted();
        if (!state.ls(args)) {
          return 'The directory is inaccessible.';
          return null;
        }
      }
    },
    "clear": {
      "description": "Clears the console output.",
      "command": function(state, args) {
        state.commandLineNotCounted();
        state.clear();
        return null;
      }
    },
    "echo": {
      "params": "[text]...",
      "description": "Prints the message to the output.",
      "command": function(state, args) {
        if (args != null) {
          state.message(args.join(' ') + '\n');
          return null;
        } else {
          state.message('\n');
          return null;
        }
      }
    },
    "print": {
      "params": "[text]...",
      "description": "Stringifies given parameters.",
      "command": function(state, args) {
        return JSON.stringify(args);
      }
    },
    "cd": {
      "params": "[directory]",
      "description": "Moves to the specified directory.",
      "command": function(state, args) {
        return state.cd(args);
      }
    },
    "new": {
      "description": "Creates a new file and opens it in the editor view.",
      "command": function(state, args) {
        var file_name, file_path;
        if (args === null || args === void 0) {
          atom.workspaceView.trigger('application:new-file');
          return null;
        }
        file_name = state.util.replaceAll('\"', '', args[0]);
        if (file_name === null || file_name === void 0) {
          atom.workspaceView.trigger('application:new-file');
          return null;
        } else {
          file_path = state.resolvePath(file_name);
          fs.closeSync(fs.openSync(file_path, 'w'));
          state.delay(function() {
            return atom.workspaceView.open(file_path);
          });
          return state.consoleLink(file_path);
        }
      }
    },
    "rm": {
      "params": "[file]",
      "description": "Removes the given file.",
      "command": function(state, args) {
        var filepath;
        filepath = state.resolvePath(args[0]);
        fs.unlink(filepath, function(e) {});
        return state.consoleLink(filepath);
      }
    },
    "memdump": {
      "description": "Displays a list of all available internally stored commands.",
      "command": function(state, args) {
        return state.getLocalCommandsMemdump();
      }
    },
    "?": {
      "description": "Displays a list of all available internally stored commands.",
      "command": function(state, args) {
        return state.exec('memdump', null, state);
      }
    },
    "exit": {
      "description": "Destroys the terminal session.",
      "command": function(state, args) {
        return state.destroy();
      }
    },
    "update": {
      "description": "Reloads the terminal configuration from terminal-commands.json",
      "command": function(state, args) {
        core.reload();
        return (state.consoleLabel('info', 'info')) + (state.consoleText('info', 'The console settings were reloaded'));
      }
    },
    "reload": {
      "description": "Reloads the atom window.",
      "command": function(state, args) {
        return atom.reload();
      }
    },
    "edit": {
      "params": "[file]",
      "description": "Opens the specified file in the editor view.",
      "command": function(state, args) {
        var file_name;
        file_name = state.resolvePath(args[0]);
        state.delay(function() {
          return atom.workspaceView.open(file_name);
        });
        return state.consoleLink(file_name);
      }
    },
    "link": {
      "params": "[file/directory]",
      "description": "Displays interactive link to the given file/directory.",
      "command": function(state, args) {
        var file_name;
        file_name = state.resolvePath(args[0]);
        return state.consoleLink(file_name);
      }
    },
    "l": {
      "params": "[file/directory]",
      "description": "Displays interactive link to the given file/directory.",
      "command": function(state, args) {
        return state.exec('link ' + args[0], null, state);
      }
    },
    "info": {
      "description": "Prints the welcome message to the screen.",
      "command": function(state, args) {
        state.clear();
        state.showInitMessage(true);
        return null;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLWJ1aWx0aW5zLWNvbW1hbmRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQVFBLElBQUEsR0FBTyxPQUFBLENBQVEsVUFBUixDQVJQLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxxQkFBVjtBQUFBLE1BQ0EsWUFBQSxFQUFjLElBRGQ7QUFBQSxNQUVBLGFBQUEsRUFBZSxrQkFGZjtBQUFBLE1BR0EsU0FBQSxFQUFXLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNULFlBQUEsUUFBQTtBQUFBLFFBQUEsUUFBQSxHQUFXLElBQUssQ0FBQSxDQUFBLENBQWhCLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxlQUFOLEdBQXdCLFFBRHhCLENBQUE7QUFBQSxRQUVBLEtBQUssQ0FBQyxPQUFOLENBQWMsc0JBQUEsR0FBdUIsUUFBckMsQ0FGQSxDQUFBO0FBR0EsZUFBTyxJQUFQLENBSlM7TUFBQSxDQUhYO0tBREY7QUFBQSxJQVNBLElBQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLHVDQUFmO0FBQUEsTUFDQSxTQUFBLEVBQVcsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ1QsUUFBQSxLQUFLLENBQUMscUJBQU4sQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsQ0FBQSxLQUFTLENBQUMsRUFBTixDQUFTLElBQVQsQ0FBUDtBQUNFLGlCQUFPLGdDQUFQLENBQUE7QUFDQSxpQkFBTyxJQUFQLENBRkY7U0FGUztNQUFB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-builtins-commands.coffee
