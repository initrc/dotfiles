(function() {
  var $, $$, CSON, CompositeDisposable, Config, Path, Termrk, TermrkModel, TermrkView, Utils, View, fs, interact, programsByExtname, _ref,
    __slice = [].slice;

  Path = require('path');

  fs = require('fs-plus');

  interact = require('interact.js');

  CSON = require('season');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('space-pen'), $$ = _ref.$$, View = _ref.View;

  $ = require('jquery.transit');

  TermrkView = require('./termrk-view');

  TermrkModel = require('./termrk-model');

  Config = require('./config');

  Utils = require('./utils');

  programsByExtname = {
    '.js': 'node',
    '.node': 'node',
    '.py': 'python',
    '.py3': 'python3',
    '.coffee': 'coffee'
  };

  module.exports = Termrk = {
    container: null,
    containerView: null,
    panel: null,
    panelView: null,
    subscriptions: null,
    views: {},
    activeView: null,
    config: Config.schema,
    userCommands: null,
    activate: function(state) {
      this.$ = $;
      this.config = Config;
      this.subscriptions = new CompositeDisposable();
      this.registerCommands('atom-workspace', {
        'termrk:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'termrk:hide': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'termrk:show': (function(_this) {
          return function() {
            return _this.show();
          };
        })(this),
        'termrk:toggle-focus': (function(_this) {
          return function() {
            return _this.toggleFocus();
          };
        })(this),
        'termrk:focus': (function(_this) {
          return function() {
            return _this.focus();
          };
        })(this),
        'termrk:blur': (function(_this) {
          return function() {
            return _this.blur();
          };
        })(this),
        'termrk:insert-selection': (function(_this) {
          return function() {
            _this.insertSelection();
            return _this.show();
          };
        })(this),
        'termrk:run-current-file': (function(_this) {
          return function() {
            _this.runCurrentFile();
            return _this.show();
          };
        })(this),
        'termrk:create-terminal': (function(_this) {
          return function() {
            _this.setActiveTerminal(_this.createTerminal());
            return _this.show();
          };
        })(this),
        'termrk:create-terminal-current-dir': (function(_this) {
          return function() {
            var currentDir;
            if ((currentDir = Utils.getCurrentDir()) == null) {
              return;
            }
            _this.setActiveTerminal(_this.createTerminal({
              cwd: currentDir
            }));
            return _this.show();
          };
        })(this)
      });
      this.registerCommands('.termrk', {
        'termrk:trigger-keypress': (function(_this) {
          return function() {
            return _this.activeView.triggerKeypress();
          };
        })(this),
        'termrk:insert-filename': (function(_this) {
          return function() {
            var content;
            content = atom.workspace.getActiveTextEditor().getURI();
            _this.activeView.write(content);
            return _this.activeView.focus();
          };
        })(this),
        'core:paste': (function(_this) {
          return function() {
            var content;
            content = atom.clipboard.read();
            _this.activeView.write(content);
            return _this.activeView.focus();
          };
        })(this),
        'termrk:close-terminal': (function(_this) {
          return function() {
            return _this.removeTerminal(_this.getActiveTerminal());
          };
        })(this),
        'termrk:activate-next-terminal': (function(_this) {
          return function() {
            _this.setActiveTerminal(_this.getNextTerminal());
            return _this.show();
          };
        })(this),
        'termrk:activate-previous-terminal': (function(_this) {
          return function() {
            _this.setActiveTerminal(_this.getPreviousTerminal());
            return _this.show();
          };
        })(this)
      });
      this.loadUserCommands();
      this.loadKeymap();
      this.subscriptions.add(Config.observe({
        'fontSize': function() {
          return TermrkView.fontChanged();
        },
        'fontFamily': function() {
          return TermrkView.fontChanged();
        },
        'useDefaultKeymap': this.loadKeymap.bind(this)
      }));
      this.setupElements();
      this.setActiveTerminal(this.createTerminal());
      if (window.debug === true) {
        return window.termrk = this;
      }
    },
    setupElements: function() {
      this.containerView = this.createContainer();
      this.panel = atom.workspace.addBottomPanel({
        item: this.containerView,
        visible: false
      });
      this.panelView = $(atom.views.getView(this.panel));
      this.panelView.addClass('termrk-panel');
      this.panelView.attr('data-height', Config.defaultHeight);
      this.panelView.height(0);
      return this.makeResizable('.termrk-panel');
    },
    makeResizable: function(element) {
      return interact(element).resizable({
        edges: {
          left: false,
          right: false,
          bottom: false,
          top: true
        }
      }).on('resizemove', function(event) {
        var target;
        target = event.target;
        return target.style.height = event.rect.height + 'px';
      }).on('resizeend', (function(_this) {
        return function(event) {
          Config.defaultHeight = parseInt(event.target.style.height);
          _this.panelView.attr('data-height', Config.defaultHeight);
          return _this.activeView.updateTerminalSize();
        };
      })(this));
    },

    /*
    Section: elements/views creation
     */
    createContainer: function() {
      return $$(function() {
        return this.div({
          "class": 'termrk-container'
        });
      });
    },
    createTerminal: function(options) {
      var cols, rows, termrkView, _ref1;
      if (options == null) {
        options = {};
      }
      termrkView = new TermrkView;
      this.containerView.append(termrkView);
      this.views[termrkView.time] = termrkView;
      _ref1 = termrkView.calculateTerminalDimensions(termrkView.find('.terminal').width(), Config.defaultHeight), cols = _ref1[0], rows = _ref1[1];
      if (cols < 80) {
        cols = 80;
      }
      if (options.cols == null) {
        options.cols = cols;
      }
      if (options.rows == null) {
        options.rows = rows;
      }
      termrkView.start(options);
      termrkView.height(0);
      return termrkView;
    },

    /*
    Section: views management
     */
    getPreviousTerminal: function() {
      var index, key, keys;
      keys = Object.keys(this.views).sort();
      if (this.activeView == null) {
        if (keys.length === 0) {
          return null;
        }
        return this.views[keys[0]];
      }
      index = keys.indexOf(this.activeView.time);
      index = index === 0 ? keys.length - 1 : index - 1;
      key = keys[index];
      return this.views[key];
    },
    getNextTerminal: function() {
      var index, key, keys;
      keys = Object.keys(this.views).sort();
      if (this.activeView == null) {
        if (keys.length === 0) {
          return null;
        }
        return this.views[keys[0]];
      }
      index = keys.indexOf(this.activeView.time);
      index = (index + 1) % keys.length;
      key = keys[index];
      return this.views[key];
    },
    getActiveTerminal: function() {
      if (this.activeView != null) {
        return this.activeView;
      }
      this.setActiveTerminal(this.createTerminal());
      return this.activeView;
    },
    setActiveTerminal: function(term) {
      var _ref1, _ref2, _ref3, _ref4, _ref5;
      if (term === this.activeView) {
        return;
      }
      if (this.panel.isVisible()) {
        if ((_ref1 = this.activeView) != null) {
          _ref1.animatedHide();
        }
        if ((_ref2 = this.activeView) != null) {
          _ref2.deactivated();
        }
        this.activeView = term;
        this.activeView.animatedShow();
        this.activeView.activated();
      } else {
        if ((_ref3 = this.activeView) != null) {
          _ref3.hide();
        }
        if ((_ref4 = this.activeView) != null) {
          _ref4.height(0);
        }
        if ((_ref5 = this.activeView) != null) {
          _ref5.deactivated();
        }
        this.activeView = term;
        this.activeView.show();
        this.activeView.height('100%');
        this.activeView.activated();
      }
      if (window.debug === true) {
        window.term = this.activeView;
      }
      if (window.debug === true) {
        return window.termjs = this.activeView.termjs;
      }
    },
    removeTerminal: function(term) {
      var nextTerm;
      if (this.views[term.time] == null) {
        return;
      }
      if (term === this.activeView) {
        nextTerm = this.getNextTerminal();
        term.animatedHide(function() {
          return term.destroy();
        });
        if (term !== nextTerm) {
          this.setActiveTerminal(nextTerm);
        } else {
          this.setActiveTerminal(this.createTerminal());
        }
      } else {
        term.destroy();
      }
      return delete this.views[term.time];
    },

    /*
    Section: commands handlers
     */
    hide: function(callback) {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      if ((_ref1 = this.activeView) != null) {
        _ref1.blur();
      }
      this.restoreFocus();
      this.panelView.stop();
      return this.panelView.transition({
        height: '0'
      }, 250, 'ease-in-out', (function(_this) {
        return function() {
          _this.panel.hide();
          _this.activeView.deactivated();
          return typeof callback === "function" ? callback() : void 0;
        };
      })(this));
    },
    show: function(callback) {
      var _ref1;
      if (this.panel.isVisible()) {
        return;
      }
      this.panel.show();
      this.storeFocusedElement();
      if ((_ref1 = this.activeView) != null) {
        _ref1.focus();
      }
      this.panelView.stop();
      return this.panelView.transition({
        height: "" + (Config.defaultHeight - 2) + "px"
      }, 250, 'ease-in-out', (function(_this) {
        return function() {
          var _ref2;
          if ((_ref2 = _this.activeView) != null) {
            _ref2.activated();
          }
          return typeof callback === "function" ? callback() : void 0;
        };
      })(this));
    },
    toggle: function() {
      if (this.panel.isVisible()) {
        return this.hide();
      } else {
        return this.show();
      }
    },
    insertSelection: function(event) {
      var editor, sel, _i, _len, _ref1;
      if (this.activeView == null) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      _ref1 = editor.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        sel = _ref1[_i];
        this.activeView.write(sel.getText());
      }
      return this.activeView.focus();
    },
    focus: function() {
      if (!this.panel.isVisible()) {
        return this.show((function(_this) {
          return function() {
            return _this.focus();
          };
        })(this));
      } else {
        if (this.focusedElement == null) {
          this.storeFocusedElement();
        }
        return this.activeView.focus();
      }
    },
    blur: function() {
      this.activeView.blur();
      return this.restoreFocus();
    },
    toggleFocus: function() {
      if (this.activeView == null) {
        return;
      }
      if (this.activeView.hasFocus()) {
        return this.blur();
      } else {
        return this.focus();
      }
    },
    runCurrentFile: function() {
      var extname, file, firstLine, program, shebang;
      file = atom.workspace.getActiveTextEditor().getURI();
      extname = Path.extname(file);
      firstLine = atom.workspace.getActiveTextEditor().lineTextForBufferRow(0);
      if ((shebang = firstLine.match(/#!(.+)$/))) {
        program = shebang[1];
      } else if (programsByExtname[extname] != null) {
        program = programsByExtname[extname];
      } else {
        console.log("Termrk: couldnt run file " + file);
        return;
      }
      this.activeView.write("" + program + " " + file + "\n");
      return this.focus();
    },
    runUserCommand: function(commandName, event) {
      var command;
      command = this.userCommands[commandName].command;
      command = command.replace(/\$FILE/g, Utils.getCurrentFile());
      command = command.replace(/\$DIR/g, Utils.getCurrentDir());
      command = command.replace(/\$PROJECT/g, Utils.getProjectDir());
      if (command.slice(-1) !== '\n') {
        command += '\n';
      }
      this.activeView.write(command);
      return this.focus();
    },

    /*
    Section: helpers
     */
    loadUserCommands: function() {
      var commandName, description, error, scope, userCommandsFile, _ref1, _ref2, _results;
      userCommandsFile = Utils.resolve(atom.getConfigDirPath(), Config.userCommandsFile);
      try {
        this.userCommands = CSON.readFileSync(userCommandsFile);
      } catch (_error) {
        error = _error;
        console.log("Termrk: couldn't load commands in " + userCommandsFile);
        if (window.debug) {
          console.error(error);
        }
        this.userCommands = {};
        return;
      }
      _ref1 = this.userCommands;
      _results = [];
      for (commandName in _ref1) {
        description = _ref1[commandName];
        scope = (_ref2 = description.scope) != null ? _ref2 : 'atom-workspace';
        _results.push(this.registerCommands(scope, "termrk:command-" + commandName, this.runUserCommand.bind(this, commandName)));
      }
      return _results;
    },
    registerCommands: function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.subscriptions.add((_ref1 = atom.commands).add.apply(_ref1, args));
    },
    loadKeymap: function() {
      var keymapPath;
      keymapPath = Path.resolve(__dirname, '../res/termrk.cson');
      if (Config.useDefaultKeymap) {
        atom.keymaps.loadKeymap(keymapPath);
        return console.log('loaded ', keymapPath);
      } else {
        atom.keymaps.removeBindingsFromSource(keymapPath);
        return console.log('removed ', keymapPath);
      }
    },
    shellEscape: function(s) {
      return s.replace(/(["\n'$`\\])/g, '\\$1');
    },
    getPanelHeight: function() {
      return Config.defaultHeight;
    },
    storeFocusedElement: function() {
      return this.focusedElement = $(document.activeElement);
    },
    restoreFocus: function() {
      var _ref1;
      if ((_ref1 = this.focusedElement) != null) {
        _ref1.focus();
      }
      return this.focusedElement = null;
    },
    deactivate: function() {
      var term, time, _ref1;
      _ref1 = this.views;
      for (time in _ref1) {
        term = _ref1[time];
        term.destroy();
      }
      this.panel.destroy();
      return this.subscriptions.dispose();
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybXJrL2xpYi90ZXJtcmsuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLG1JQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQXdCLE9BQUEsQ0FBUSxNQUFSLENBQXhCLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQXdCLE9BQUEsQ0FBUSxTQUFSLENBRHhCLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQXdCLE9BQUEsQ0FBUSxhQUFSLENBRnhCLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQXdCLE9BQUEsQ0FBUSxRQUFSLENBSHhCLENBQUE7O0FBQUEsRUFJQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBSkQsQ0FBQTs7QUFBQSxFQUtBLE9BQXdCLE9BQUEsQ0FBUSxXQUFSLENBQXhCLEVBQUMsVUFBQSxFQUFELEVBQUssWUFBQSxJQUxMLENBQUE7O0FBQUEsRUFNQSxDQUFBLEdBQXdCLE9BQUEsQ0FBUSxnQkFBUixDQU54QixDQUFBOztBQUFBLEVBUUEsVUFBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSLENBUmQsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FUZCxDQUFBOztBQUFBLEVBVUEsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSLENBVmQsQ0FBQTs7QUFBQSxFQVdBLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUixDQVhkLENBQUE7O0FBQUEsRUFjQSxpQkFBQSxHQUNJO0FBQUEsSUFBQSxLQUFBLEVBQVcsTUFBWDtBQUFBLElBQ0EsT0FBQSxFQUFXLE1BRFg7QUFBQSxJQUVBLEtBQUEsRUFBVyxRQUZYO0FBQUEsSUFHQSxNQUFBLEVBQVcsU0FIWDtBQUFBLElBSUEsU0FBQSxFQUFX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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/termrk/lib/termrk.coffee
