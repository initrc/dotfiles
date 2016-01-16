
/*
  == ATOM-TERMINAL-PANEL  FILE-MANIP PLUGIN ==

  Atom-terminal-panel builtin plugin v1.0.0
  -isis97

  Contains commands for file system manipulation.

  MIT License
  Feel free to do anything with this file.
 */

(function() {
  module.exports = {
    "@": {
      "description": "Access native environment variables.",
      "command": function(state, args) {
        return state.parseTemplate("%(env." + args[0] + ")");
      }
    },
    "cp": {
      "params": "[file]... [destination]",
      "description": "Copies one/or more files to the specified directory (e.g cp ./test.js ./test/)",
      "command": function(state, args) {
        var e, srcs, tgt;
        srcs = args.slice(0, -1);
        tgt = args.slice(-1);
        try {
          return (state.util.cp(srcs, tgt)) + ' files copied.';
        } catch (_error) {
          e = _error;
          return state.consoleAlert('Failed to copy the given entries ' + e);
        }
      }
    },
    "mkdir": {
      "params": "[name]...",
      "description": "Create one/or more directories.",
      "params": "[FOLDER NAME]",
      "command": function(state, args) {
        var e;
        try {
          return state.util.mkdir(args);
        } catch (_error) {
          e = _error;
          return state.consoleAlert('Failed to create directory ' + e);
        }
      }
    },
    "rmdir": {
      "params": "[directory]...",
      "description": "Remove one/or more directories.",
      "command": function(state, args) {
        var e;
        try {
          return state.util.rmdir(args);
        } catch (_error) {
          e = _error;
          return state.consoleAlert('Failed to remove directory ' + e);
        }
      }
    },
    "rename": {
      "params": "[name] [new name]",
      "description": "Rename the given file/directory.",
      "command": function(state, args) {
        var e;
        try {
          return state.util.rename(args[0], args[1]);
        } catch (_error) {
          e = _error;
          return state.consoleAlert('Failed to rename file /or directory ' + e);
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9jb21tYW5kcy9maWxlLW1hbmlwL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7Ozs7Ozs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLHNDQUFmO0FBQUEsTUFDQSxTQUFBLEVBQVcsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ1QsZUFBTyxLQUFLLENBQUMsYUFBTixDQUFvQixRQUFBLEdBQVMsSUFBSyxDQUFBLENBQUEsQ0FBZCxHQUFpQixHQUFyQyxDQUFQLENBRFM7TUFBQSxDQURYO0tBREY7QUFBQSxJQUtBLElBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLHlCQUFWO0FBQUEsTUFDQSxhQUFBLEVBQWUsZ0ZBRGY7QUFBQSxNQUVBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLFlBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxJQUFLLGFBQVosQ0FBQTtBQUFBLFFBQ0EsR0FBQSxHQUFNLElBQUssVUFEWCxDQUFBO0FBRUE7QUFDRSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBWCxDQUFjLElBQWQsRUFBb0IsR0FBcEIsQ0FBRCxDQUFBLEdBQTRCLGdCQUFuQyxDQURGO1NBQUEsY0FBQTtBQUdFLFVBREksVUFDSixDQUFBO2lCQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLG1DQUFBLEdBQW9DLENBQXZELEVBSEY7U0FIUztNQUFBLENBRlg7S0FORjtBQUFBLElBZ0JBLE9BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLFdBQVY7QUFBQSxNQUNBLGFBQUEsRUFBZSxpQ0FEZjtBQUFBLE1BRUEsUUFBQSxFQUFVLGVBRlY7QUFBQSxNQUdBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLENBQUE7QUFBQTtBQUNFLGlCQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFQLENBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxVQUNKLENBQUE7aUJBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsNkJBQUEsR0FBOEIsQ0FBakQsRUFIRjtTQURTO01BQUEsQ0FIWDtLQWpCRjtBQUFBLElBMEJBLE9BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLGdCQUFWO0FBQUEsTUFDQSxhQUFBLEVBQWUsaUNBRGY7QUFBQSxNQUVBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLENBQUE7QUFBQTtBQUNFLGlCQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFQLENBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxVQUNKLENBQUE7aUJBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsNkJBQUEsR0FBOEIsQ0FBakQsRUFIRjtTQURTO01BQUEsQ0FGWDtLQTNCRjtBQUFBLElBbUNBLFFBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLG1CQUFWO0FBQUEsTUFDQSxhQUFBLEVBQWUsa0NBRGY7QUFBQSxNQUVBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDVCxZQUFBLENBQUE7QUFBQTtBQUNFLGlCQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBWCxDQUFrQixJQUFLLENBQUEsQ0FBQSxDQUF2QixFQUEyQixJQUFLLENBQUEsQ0FBQSxDQUFoQyxDQUFQLENBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxVQUNKLENBQUE7aUJBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsc0NBQUEsR0FBdUMsQ0FBMUQsRUFIRjtTQURTO01BQUEsQ0FGWDtLQXBDRjtHQVpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/commands/file-manip/index.coffee
