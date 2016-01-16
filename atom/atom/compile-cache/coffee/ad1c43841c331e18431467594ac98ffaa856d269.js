
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  The main plugin class.
 */

(function() {
  var ATPOutputView, ATPPanel, core, path;

  require('./atp-utils');

  path = include('path');

  ATPPanel = include('atp-panel');

  ATPOutputView = include('atp-view');

  core = include('atp-core');

  module.exports = {
    cliStatusView: null,
    callbacks: {
      onDidActivateInitialPackages: []
    },
    getPanel: function() {
      return this.cliStatusView;
    },
    activate: function(state) {
      this.cliStatusView = new ATPPanel(state.cliStatusViewState);
      return setTimeout(function() {
        return core.init();
      }, 0);
    },
    deactivate: function() {
      if (this.cliStatusView != null) {
        return this.cliStatusView.destroy();
      }
    },
    config: {
      'WindowHeight': {
        type: 'integer',
        description: 'Maximum height of a console window.',
        "default": 300
      },
      'enableWindowAnimations': {
        title: 'Enable window animations',
        description: 'Enable window animations.',
        type: 'boolean',
        "default": true
      },
      'useAtomIcons': {
        title: 'Use Atom icons',
        description: 'Uses only the icons used by the Atom. Otherwise the default terminal icons will be used.',
        type: 'boolean',
        "default": true
      },
      'clearCommandInput': {
        title: 'Clear command input',
        description: 'Always clear command input when opening terminal panel.',
        type: 'boolean',
        "default": true
      },
      'logConsole': {
        title: 'Log console',
        description: 'Log console output.',
        type: 'boolean',
        "default": false
      },
      'overrideLs': {
        title: 'Override ls',
        description: 'Override ls command (if this option is disabled the native version of ls is used)',
        type: 'boolean',
        "default": true
      },
      'enableExtendedCommands': {
        title: 'Enable extended built-in commands',
        description: 'Enable extended built-in commands (like ls override, cd or echo).',
        type: 'boolean',
        "default": true
      },
      'enableUserCommands': {
        title: 'Enable user commands',
        description: 'Enable user defined commands from terminal-commands.json file',
        type: 'boolean',
        "default": true
      },
      'enableConsoleInteractiveLinks': {
        title: 'Enable console interactive links',
        description: 'If this option is disabled or terminal links are not clickable (the file extensions will be coloured only)',
        type: 'boolean',
        "default": true
      },
      'enableConsoleInteractiveHints': {
        title: 'Enable console interactive hints',
        description: 'Enable terminal tooltips.',
        type: 'boolean',
        "default": true
      },
      'enableConsoleLabels': {
        title: 'Enable console labels (like %(label:info...), error, warning)',
        description: 'If this option is disabled all labels are removed.',
        type: 'boolean',
        "default": true
      },
      'enableConsoleStartupInfo': {
        title: 'Enable the console welcome message.',
        description: 'Always display welcome message when the terminal window is opened.',
        type: 'boolean',
        "default": true
      },
      'enableConsoleSuggestionsDropdown': {
        title: 'Enable the console suggestions list.',
        description: 'Makes the console display the suggested commands list in a dropdown list.',
        type: 'boolean',
        "default": true
      },
      'disabledExtendedCommands': {
        title: 'Disabled commands:',
        description: 'You can disable any command (it will be used as native).',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      'moveToCurrentDirOnOpen': {
        title: 'Always move to current directory',
        description: 'Always move to currently selected file\'s directory when the console is opened.',
        type: 'boolean',
        "default": true
      },
      'moveToCurrentDirOnOpenLS': {
        title: 'Always run \"ls\" in active console.',
        description: 'Always run \"ls\" command when the console is opened (slows down terminal a little).',
        type: 'boolean',
        "default": false
      },
      'parseSpecialTemplateTokens': {
        title: 'Enable the special tokens (like: %(path), %(day) etc.)',
        description: 'If this option is disabled all special tokens are removed.',
        type: 'boolean',
        "default": true
      },
      'commandPrompt': {
        title: 'The command prompt message.',
        description: 'Set the command prompt message.',
        type: 'string',
        "default": '%(dynamic) %(label:badge:text:%(line)) %(^#FF851B)%(hours):%(minutes):%(seconds)%(^) %(^#01FF70)%(hostname)%(^):%(^#DDDDDD)%(^#39CCCC)../%(path:-2)/%(path:-1)%(^)>%(^)'
      },
      'textReplacementCurrentPath': {
        title: 'Current working directory replacement',
        description: 'Replacement for the current working directory path at the console output.',
        type: 'string',
        "default": '[CWD]'
      },
      'textReplacementCurrentFile': {
        title: 'Currently edited file replacement',
        description: 'Replacement for the currently edited file at the console output.',
        type: 'string',
        "default": '%(link)%(file)%(endlink)'
      },
      'textReplacementFileAdress': {
        title: 'File adress replacement',
        description: 'Replacement for any file adress at the console output.',
        type: 'string',
        "default": '%(link)%(file)%(endlink)'
      },
      'statusBarText': {
        title: 'Status bar text',
        description: 'Text displayed on the terminal status bar.',
        type: 'string',
        "default": '%(dynamic) %(hostname) %(username) %(hours):%(minutes):%(seconds) %(ampm)'
      },
      'XExperimentEnableForceLinking': {
        title: 'EXPERIMENTAL: Enable auto links',
        description: 'Warning: This function is experimental, so it can be broken.',
        type: 'boolean',
        "default": false
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFRQSxPQUFBLENBQVEsYUFBUixDQVJBLENBQUE7O0FBQUEsRUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FWUCxDQUFBOztBQUFBLEVBV0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxXQUFSLENBWFgsQ0FBQTs7QUFBQSxFQVlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLFVBQVIsQ0FaaEIsQ0FBQTs7QUFBQSxFQWFBLElBQUEsR0FBTyxPQUFBLENBQVEsVUFBUixDQWJQLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsU0FBQSxFQUNFO0FBQUEsTUFBQSw0QkFBQSxFQUE4QixFQUE5QjtLQUZGO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsYUFBTyxJQUFDLENBQUEsYUFBUixDQURRO0lBQUEsQ0FKVjtBQUFBLElBT0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLFFBQUEsQ0FBUyxLQUFLLENBQUMsa0JBQWYsQ0FBckIsQ0FBQTthQUNBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxJQUFJLENBQUMsSUFBTCxDQUFBLEVBRFM7TUFBQSxDQUFYLEVBRUMsQ0FGRCxFQUZRO0lBQUEsQ0FQVjtBQUFBLElBYUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBRywwQkFBSDtlQUNFLElBQUMsQ0FBQSxh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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp.coffee
