(function() {
  var $, $$, CompositeDisposable, Config, Emitter, Font, Key, KeyKit, Keymap, Paths, Terminal, Termrk, TermrkModel, TermrkView, Utils, View, pty, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  $ = require('jquery.transit');

  pty = require('pty.js');

  Emitter = require('atom').Emitter;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('space-pen'), $$ = _ref.$$, View = _ref.View;

  _ref1 = require('keykit'), Key = _ref1.Key, KeyKit = _ref1.KeyKit;

  Termrk = require('./termrk');

  Terminal = require('./termjs-fix');

  TermrkModel = require('./termrk-model');

  Config = require('./config');

  Utils = require('./utils');

  Font = Utils.Font;

  Keymap = Utils.Keymap;

  Paths = Utils.Paths;

  module.exports = TermrkView = (function(_super) {
    __extends(TermrkView, _super);

    function TermrkView() {
      this.updateFont = __bind(this.updateFont, this);
      this.updateTerminalSize = __bind(this.updateTerminalSize, this);
      this.triggerKeypress = __bind(this.triggerKeypress, this);
      this.terminalMousewheel = __bind(this.terminalMousewheel, this);
      this.inputKeydown = __bind(this.inputKeydown, this);
      return TermrkView.__super__.constructor.apply(this, arguments);
    }


    /*
    Section: static
     */

    TermrkView.instances = new Set();

    TermrkView.addInstance = function(termrkView) {
      termrkView.time = String(Date.now());
      return this.instances.add(termrkView);
    };

    TermrkView.removeInstance = function(termrkView) {
      return this.instances.remove(termrkView);
    };

    TermrkView.fontChanged = function() {
      return TermrkView.instances.forEach(function(instance) {
        return instance.updateFont.call(instance);
      });
    };


    /*
    Section: instance
     */

    TermrkView.prototype.model = null;

    TermrkView.prototype.emitter = null;

    TermrkView.prototype.subscriptions = null;

    TermrkView.prototype.modelSubscriptions = null;

    TermrkView.prototype.time = null;

    TermrkView.prototype.termjs = null;

    TermrkView.prototype.isInsertVarMode = false;

    TermrkView.content = function() {
      return this.div({
        "class": 'termrk'
      }, (function(_this) {
        return function() {
          return _this.input({
            "class": 'input-keylistener'
          });
        };
      })(this));
    };


    /*
    Section: Events
     */

    TermrkView.prototype.onDidResize = function(callback) {
      return this.emitter.on('resize', callback);
    };


    /*
    Section: init/setup
     */

    TermrkView.prototype.initialize = function(options) {
      var _base;
      this.options = options != null ? options : {};
      TermrkView.addInstance(this);
      if ((_base = this.options).name == null) {
        _base.name = 'xterm-256color';
      }
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.input = this.element.querySelector('input');
      this.termjs = new Terminal({
        cols: this.options.cols,
        rows: this.options.rows,
        name: this.options.name
      });
      this.termjs.open(this.element);
      this.attachListeners();
      return this.updateFont();
    };

    TermrkView.prototype.start = function(options) {
      _.extend(this.options, options);
      this.updateFont();
      this.model = new TermrkModel(this.options);
      this.model.spawnProcess(this.options);
      return this.attachModelListeners();
    };

    TermrkView.prototype.addEventListener = function(element, event, callback) {
      element.addEventListener(event, callback);
      return this.subscriptions.add({
        dispose: function() {
          return element.removeEventListener(event, callback);
        }
      });
    };

    TermrkView.prototype.attachListeners = function() {
      this.addEventListener(this.input, 'keydown', (function(_this) {
        return function(e) {
          return _this.inputKeydown(e);
        };
      })(this));
      this.addEventListener(this.input, 'keypress', (function(_this) {
        return function(e) {
          return _this.termjs.keyPress(e);
        };
      })(this));
      this.addEventListener(this.input, 'focus', (function(_this) {
        return function() {
          return _this.termjs.focus();
        };
      })(this));
      this.addEventListener(this.input, 'blur', (function(_this) {
        return function() {
          return _this.termjs.blur();
        };
      })(this));
      this.addEventListener(this.termjs.element, 'focus', (function(_this) {
        return function() {
          return _this.input.focus();
        };
      })(this));
      this.addEventListener(this.termjs.element, 'mousewheel', this.terminalMousewheel.bind(this));
      return this.addEventListener(window, 'resize', (function(_this) {
        return function() {
          return _this.updateTerminalSize();
        };
      })(this));
    };

    TermrkView.prototype.attachModelListeners = function() {
      var add, dataListener;
      this.modelSubscriptions = new CompositeDisposable;
      add = (function(_this) {
        return function(d) {
          return _this.modelSubscriptions.add(d);
        };
      })(this);
      add(this.model.onDidStartProcess((function(_this) {
        return function(shellName) {
          return _this.termjs.write("\x1b[31mProcess started: " + _this.options.shell + "\x1b[m\r\n");
        };
      })(this)));
      add(this.model.onDidExitProcess((function(_this) {
        return function(code, signal) {
          return _this.processExit(code, signal);
        };
      })(this)));
      add(this.model.onDidReceiveData((function(_this) {
        return function(data) {
          return _this.termjs.write(data);
        };
      })(this)));
      dataListener = (function(_this) {
        return function(data) {
          return _this.model.write(data);
        };
      })(this);
      this.termjs.addListener('data', dataListener);
      return add({
        dispose: (function(_this) {
          return function() {
            return _this.termjs.removeListener('data', dataListener);
          };
        })(this)
      });
    };


    /*
    Section: event listeners
     */

    TermrkView.prototype.inputKeydown = function(event) {
      var allow;
      atom.keymaps.handleKeyboardEvent(event);
      if (event.defaultPrevented) {
        event.stopImmediatePropagation();
        return false;
      } else if (this.model != null) {
        allow = this.termjs.keyDown.call(this.termjs, event);
        return allow;
      } else {
        if (event.keyCode === 13) {
          return this.start();
        }
      }
    };

    TermrkView.prototype.terminalMousewheel = function(event) {
      var amount, deltaY;
      deltaY = event.wheelDeltaY;
      if (process.platform === 'darwin') {
        if (event.type === 'DOMMouseScroll') {
          deltaY += event.detail < 0 ? -1 : 1;
        } else {
          deltaY += event.wheelDeltaY > 0 ? -1 : 1;
        }
        deltaY *= -1;
        amount = deltaY;
      } else {
        if (deltaY === 0 || deltaY === NaN) {
          return;
        }
        amount = -1 * (deltaY / Math.abs(deltaY));
      }
      return this.termjs.scrollDisp(amount);
    };

    TermrkView.prototype.triggerKeypress = function(event) {
      var keypressEvent, keystroke;
      keystroke = KeyKit.fromKBEvent(event.originalEvent);
      if (keystroke.char != null) {
        keypressEvent = KeyKit.createKBEvent('keypress', keystroke);
        return this.input.dispatchEvent(keypressEvent);
      }
    };

    TermrkView.prototype.processExit = function(event) {
      this.termjs.write("\x1b[31mProcess terminated.\x1b[m\r\n");
      this.modelSubscriptions.dispose();
      this.model.destroy();
      delete this.model;
      if (Config.restartShell) {
        return this.start();
      } else {
        return this.termjs.write("\x1b[31mPress Enter to restart \x1b[m");
      }
    };

    TermrkView.prototype.activated = function() {
      this.updateTerminalSize();
      return this.focus();
    };

    TermrkView.prototype.deactivated = function() {
      if (document.activeElement !== this.input) {
        return;
      }
      return this.blur();
    };


    /*
    Section: display/render
     */

    TermrkView.prototype.animatedShow = function(cb) {
      this.stop();
      return this.animate({
        height: '100%'
      }, 250, (function(_this) {
        return function() {
          _this.updateTerminalSize();
          return typeof cb === "function" ? cb() : void 0;
        };
      })(this));
    };

    TermrkView.prototype.animatedHide = function(cb) {
      this.stop();
      return this.animate({
        height: '0'
      }, 250, function() {
        return typeof cb === "function" ? cb() : void 0;
      });
    };

    TermrkView.prototype.updateTerminalSize = function() {
      var cols, height, rows, width, _ref2;
      width = this.width();
      height = this.height();
      _ref2 = this.calculateTerminalDimensions(width, height), cols = _ref2[0], rows = _ref2[1];
      if (cols < 15 || rows < 5) {
        return;
      }
      if (cols === 100) {
        return;
      }
      this.termjs.resize(cols, rows);
      if (this.model != null) {
        this.model.resize(cols, rows);
      }
      return this.emitter.emit('resize', {
        cols: cols,
        rows: rows
      });
    };

    TermrkView.prototype.updateFont = function() {
      var computedFont;
      this.find('.terminal').css({
        'font-size': Config.get('fontSize'),
        'font-family': Config.get('fontFamily')
      });
      computedFont = this.find('.terminal').css('font');
      this.css('font', computedFont);
      return this.updateTerminalSize();
    };

    TermrkView.prototype.calculateTerminalDimensions = function(width, height) {
      var cols, fontHeight, fontWidth, rows, _ref2;
      _ref2 = this.getCharDimensions(), fontWidth = _ref2[0], fontHeight = _ref2[1];
      cols = Math.floor(width / fontWidth);
      rows = Math.floor(height / fontHeight);
      return [cols, rows];
    };

    TermrkView.prototype.getCharDimensions = function() {
      var font, height, width;
      font = this.find('.terminal').css('font');
      width = Utils.getFontWidth("a", font);
      height = this.find('.terminal > div:first-of-type').height();
      return [width, height];
    };

    TermrkView.prototype.focus = function() {
      this.input.focus();
      return true;
    };

    TermrkView.prototype.blur = function() {
      this.input.blur();
      return true;
    };


    /*
    Section: actions
     */

    TermrkView.prototype.write = function(text) {
      return this.model.write(text);
    };


    /*
    Section: helpers/utils
     */

    TermrkView.prototype.registerCommands = function(target, commands) {
      return this.subscriptions.add(atom.commands.add(target, commands));
    };

    TermrkView.prototype.serialize = function() {};

    TermrkView.prototype.destroy = function() {
      var _ref2;
      this.modelSubscriptions.dispose();
      this.subscriptions.dispose();
      if ((_ref2 = this.model) != null) {
        _ref2.destroy();
      }
      return this.element.remove();
    };

    TermrkView.prototype.getElement = function() {
      return this.element;
    };

    TermrkView.prototype.getModel = function() {
      return this.model;
    };

    return TermrkView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybXJrL2xpYi90ZXJtcmstdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsMEpBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQU0sT0FBQSxDQUFRLGlCQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBTSxPQUFBLENBQVEsZ0JBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUlDLFVBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLE9BSkQsQ0FBQTs7QUFBQSxFQUtDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFMRCxDQUFBOztBQUFBLEVBTUEsT0FBd0IsT0FBQSxDQUFRLFdBQVIsQ0FBeEIsRUFBQyxVQUFBLEVBQUQsRUFBSyxZQUFBLElBTkwsQ0FBQTs7QUFBQSxFQU9BLFFBQXdCLE9BQUEsQ0FBUSxRQUFSLENBQXhCLEVBQUMsWUFBQSxHQUFELEVBQU0sZUFBQSxNQVBOLENBQUE7O0FBQUEsRUFTQSxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVIsQ0FUZCxDQUFBOztBQUFBLEVBV0EsUUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBWGQsQ0FBQTs7QUFBQSxFQVlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FaZCxDQUFBOztBQUFBLEVBY0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBZFQsQ0FBQTs7QUFBQSxFQWVBLEtBQUEsR0FBUyxPQUFBLENBQVEsU0FBUixDQWZULENBQUE7O0FBQUEsRUFnQkEsSUFBQSxHQUFTLEtBQUssQ0FBQyxJQWhCZixDQUFBOztBQUFBLEVBaUJBLE1BQUEsR0FBUyxLQUFL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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/termrk/lib/termrk-view.coffee
