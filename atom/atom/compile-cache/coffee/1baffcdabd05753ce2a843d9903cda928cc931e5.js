(function() {
  var CommandPromptView;

  CommandPromptView = require('./terminal-runner/command-prompt-view');

  module.exports = {
    commandPromptView: null,
    terminalSession: null,
    activate: function(state) {
      this.commandPromptView = new CommandPromptView(this, state.commandPromptState);
      atom.workspaceView.command('terminal-runner:run-command', (function(_this) {
        return function() {
          return _this.activateCommandPrompt();
        };
      })(this));
      return atom.workspaceView.command('terminal-runner:run-last-command', (function(_this) {
        return function() {
          return _this.runLastCommand();
        };
      })(this));
    },
    deactivate: function() {
      return this.commandPromptView.destroy();
    },
    serialize: function() {
      return {
        commandPromptState: this.commandPromptView.serialize()
      };
    },
    activateCommandPrompt: function() {
      return this.commandPromptView.activate();
    },
    createTerminalSession: function() {
      var lastActivePane, lastActivePaneItem, path, _ref;
      lastActivePane = atom.workspace.activePane;
      lastActivePaneItem = atom.workspace.activePaneItem;
      atom.workspace.activePane.splitRight();
      path = (_ref = atom.project.getPath()) != null ? _ref : '~';
      return atom.workspaceView.open("terminal://" + path).then((function(_this) {
        return function(session) {
          _this.terminalSession = session;
          session.on('exit', function() {
            return _this.terminalSession = null;
          });
          lastActivePane.activate();
          return lastActivePane.activateItem(lastActivePaneItem);
        };
      })(this));
    },
    runCommand: function(command) {
      if (!command) {
        return;
      }
      this.lastCommand = command;
      if (!(this.terminalSession && this.terminalSession.process.childProcess)) {
        this.createTerminalSession().then((function(_this) {
          return function() {
            return _this.runCommand(command);
          };
        })(this));
        return;
      }
      return this.terminalSession.emit('input', command + '\x0a');
    },
    runLastCommand: function() {
      if (this.lastCommand) {
        return this.runCommand(this.lastCommand);
      } else {
        return this.toggleCommandPrompt();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXJ1bm5lci9saWIvdGVybWluYWwtcnVubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1Q0FBUixDQUFwQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsaUJBQUEsRUFBbUIsSUFBbkI7QUFBQSxJQUNBLGVBQUEsRUFBaUIsSUFEakI7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsaUJBQUEsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBSyxDQUFDLGtCQUE5QixDQUF6QixDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDZCQUEzQixFQUEwRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxxQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRCxDQUZBLENBQUE7YUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGtDQUEzQixFQUErRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9ELEVBSlE7SUFBQSxDQUhWO0FBQUEsSUFTQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGlCQUFpQixDQUFDLE9BQW5CLENBQUEsRUFEVTtJQUFBLENBVFo7QUFBQSxJQVlBLFNB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

//# sourceURL=/Users/david/.atom/packages/terminal-runner/lib/terminal-runner.coffee
