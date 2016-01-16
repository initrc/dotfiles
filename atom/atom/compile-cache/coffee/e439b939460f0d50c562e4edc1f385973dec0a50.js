(function() {
  var $, CompositeDisposable, Emitter, InputDialog, Pty, Task, Terminal, TerminalPlusView, View, lastActiveElement, lastOpenedView, os, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Task = _ref.Task, CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, View = _ref1.View;

  Pty = require.resolve('./process');

  Terminal = require('term.js');

  InputDialog = null;

  path = require('path');

  os = require('os');

  lastOpenedView = null;

  lastActiveElement = null;

  module.exports = TerminalPlusView = (function(_super) {
    __extends(TerminalPlusView, _super);

    function TerminalPlusView() {
      this.blurTerminal = __bind(this.blurTerminal, this);
      this.focusTerminal = __bind(this.focusTerminal, this);
      this.blur = __bind(this.blur, this);
      this.focus = __bind(this.focus, this);
      this.resizePanel = __bind(this.resizePanel, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.hide = __bind(this.hide, this);
      this.open = __bind(this.open, this);
      this.recieveItemOrFile = __bind(this.recieveItemOrFile, this);
      this.setAnimationSpeed = __bind(this.setAnimationSpeed, this);
      return TerminalPlusView.__super__.constructor.apply(this, arguments);
    }

    TerminalPlusView.prototype.animating = false;

    TerminalPlusView.prototype.id = '';

    TerminalPlusView.prototype.maximized = false;

    TerminalPlusView.prototype.opened = false;

    TerminalPlusView.prototype.pwd = '';

    TerminalPlusView.prototype.windowHeight = $(window).height();

    TerminalPlusView.prototype.rowHeight = 20;

    TerminalPlusView.prototype.shell = '';

    TerminalPlusView.prototype.tabView = false;

    TerminalPlusView.content = function() {
      return this.div({
        "class": 'terminal-plus terminal-view',
        outlet: 'terminalPlusView'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-divider',
            outlet: 'panelDivider'
          });
          _this.div({
            "class": 'btn-toolbar',
            outlet: 'toolbar'
          }, function() {
            _this.button({
              outlet: 'closeBtn',
              "class": 'btn inline-block-tight right',
              click: 'destroy'
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              });
            });
            _this.button({
              outlet: 'hideBtn',
              "class": 'btn inline-block-tight right',
              click: 'hide'
            }, function() {
              return _this.span({
                "class": 'icon icon-chevron-down'
              });
            });
            _this.button({
              outlet: 'maximizeBtn',
              "class": 'btn inline-block-tight right',
              click: 'maximize'
            }, function() {
              return _this.span({
                "class": 'icon icon-screen-full'
              });
            });
            return _this.button({
              outlet: 'inputBtn',
              "class": 'btn inline-block-tight left',
              click: 'inputDialog'
            }, function() {
              return _this.span({
                "class": 'icon icon-keyboard'
              });
            });
          });
          return _this.div({
            "class": 'xterm',
            outlet: 'xterm'
          });
        };
      })(this));
    };

    TerminalPlusView.getFocusedTerminal = function() {
      return Terminal.Terminal.focus;
    };

    TerminalPlusView.prototype.initialize = function(id, pwd, statusIcon, statusBar, shell, args) {
      var bottomHeight, override, percent;
      this.id = id;
      this.pwd = pwd;
      this.statusIcon = statusIcon;
      this.statusBar = statusBar;
      this.shell = shell;
      this.args = args != null ? args : [];
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close'
      }));
      this.subscriptions.add(atom.tooltips.add(this.hideBtn, {
        title: 'Hide'
      }));
      this.subscriptions.add(this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
        title: 'Fullscreen'
      }));
      this.inputBtn.tooltip = atom.tooltips.add(this.inputBtn, {
        title: 'Insert Text'
      });
      this.prevHeight = atom.config.get('terminal-plus.style.defaultPanelHeight');
      if (this.prevHeight.indexOf('%') > 0) {
        percent = Math.abs(Math.min(parseFloat(this.prevHeight) / 100.0, 1));
        bottomHeight = $('atom-panel.bottom').children(".terminal-view").height() || 0;
        this.prevHeight = percent * ($('.item-views').height() + bottomHeight);
      }
      this.xterm.height(0);
      this.setAnimationSpeed();
      this.subscriptions.add(atom.config.onDidChange('terminal-plus.style.animationSpeed', this.setAnimationSpeed));
      override = function(event) {
        if (event.originalEvent.dataTransfer.getData('terminal-plus') === 'true') {
          return;
        }
        event.preventDefault();
        return event.stopPropagation();
      };
      this.xterm.on('mouseup', (function(_this) {
        return function(event) {
          var text;
          if (event.which !== 3) {
            text = window.getSelection().toString();
            if (!text) {
              return _this.focus();
            }
          }
        };
      })(this));
      this.xterm.on('dragenter', override);
      this.xterm.on('dragover', override);
      this.xterm.on('drop', this.recieveItemOrFile);
      this.on('focus', this.focus);
      return this.subscriptions.add({
        dispose: (function(_this) {
          return function() {
            return _this.off('focus', _this.focus);
          };
        })(this)
      });
    };

    TerminalPlusView.prototype.attach = function() {
      if (this.panel != null) {
        return;
      }
      return this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
    };

    TerminalPlusView.prototype.setAnimationSpeed = function() {
      this.animationSpeed = atom.config.get('terminal-plus.style.animationSpeed');
      if (this.animationSpeed === 0) {
        this.animationSpeed = 100;
      }
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    TerminalPlusView.prototype.recieveItemOrFile = function(event) {
      var dataTransfer, file, filePath, _i, _len, _ref2, _results;
      event.preventDefault();
      event.stopPropagation();
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('atom-event') === 'true') {
        filePath = dataTransfer.getData('text/plain');
        if (filePath) {
          return this.input("" + filePath + " ");
        }
      } else if (filePath = dataTransfer.getData('initialPath')) {
        return this.input("" + filePath + " ");
      } else if (dataTransfer.files.length > 0) {
        _ref2 = dataTransfer.files;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          file = _ref2[_i];
          _results.push(this.input("" + file.path + " "));
        }
        return _results;
      }
    };

    TerminalPlusView.prototype.forkPtyProcess = function() {
      return Task.once(Pty, path.resolve(this.pwd), this.shell, this.args, (function(_this) {
        return function() {
          _this.input = function() {};
          return _this.resize = function() {};
        };
      })(this));
    };

    TerminalPlusView.prototype.getId = function() {
      return this.id;
    };

    TerminalPlusView.prototype.displayTerminal = function() {
      var cols, rows, _ref2;
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      this.ptyProcess = this.forkPtyProcess();
      this.terminal = new Terminal({
        cursorBlink: false,
        scrollback: atom.config.get('terminal-plus.core.scrollback'),
        cols: cols,
        rows: rows
      });
      this.attachListeners();
      this.attachResizeEvents();
      this.attachWindowEvents();
      return this.terminal.open(this.xterm.get(0));
    };

    TerminalPlusView.prototype.attachListeners = function() {
      this.ptyProcess.on("terminal-plus:data", (function(_this) {
        return function(data) {
          return _this.terminal.write(data);
        };
      })(this));
      this.ptyProcess.on("terminal-plus:exit", (function(_this) {
        return function() {
          if (atom.config.get('terminal-plus.toggles.autoClose')) {
            return _this.destroy();
          }
        };
      })(this));
      this.terminal.end = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      this.terminal.on("data", (function(_this) {
        return function(data) {
          return _this.input(data);
        };
      })(this));
      this.ptyProcess.on("terminal-plus:title", (function(_this) {
        return function(title) {
          return _this.process = title;
        };
      })(this));
      this.terminal.on("title", (function(_this) {
        return function(title) {
          return _this.title = title;
        };
      })(this));
      return this.terminal.once("open", (function(_this) {
        return function() {
          var autoRunCommand;
          _this.applyStyle();
          _this.resizeTerminalToView();
          if (_this.ptyProcess.childProcess == null) {
            return;
          }
          autoRunCommand = atom.config.get('terminal-plus.core.autoRunCommand');
          if (autoRunCommand) {
            return _this.input("" + autoRunCommand + os.EOL);
          }
        };
      })(this));
    };

    TerminalPlusView.prototype.destroy = function() {
      var _ref2, _ref3;
      this.subscriptions.dispose();
      this.statusIcon.destroy();
      this.statusBar.removeTerminalView(this);
      this.detachResizeEvents();
      this.detachWindowEvents();
      if (this.panel.isVisible()) {
        this.hide();
        this.onTransitionEnd((function(_this) {
          return function() {
            return _this.panel.destroy();
          };
        })(this));
      } else {
        this.panel.destroy();
      }
      if (this.statusIcon && this.statusIcon.parentNode) {
        this.statusIcon.parentNode.removeChild(this.statusIcon);
      }
      if ((_ref2 = this.ptyProcess) != null) {
        _ref2.terminate();
      }
      return (_ref3 = this.terminal) != null ? _ref3.destroy() : void 0;
    };

    TerminalPlusView.prototype.maximize = function() {
      var btn;
      this.subscriptions.remove(this.maximizeBtn.tooltip);
      this.maximizeBtn.tooltip.dispose();
      this.maxHeight = this.prevHeight + $('.item-views').height();
      btn = this.maximizeBtn.children('span');
      this.onTransitionEnd((function(_this) {
        return function() {
          return _this.focus();
        };
      })(this));
      if (this.maximized) {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Fullscreen'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.adjustHeight(this.prevHeight);
        btn.removeClass('icon-screen-normal').addClass('icon-screen-full');
        return this.maximized = false;
      } else {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Normal'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.adjustHeight(this.maxHeight);
        btn.removeClass('icon-screen-full').addClass('icon-screen-normal');
        return this.maximized = true;
      }
    };

    TerminalPlusView.prototype.open = function() {
      var icon;
      if (lastActiveElement == null) {
        lastActiveElement = $(document.activeElement);
      }
      if (lastOpenedView && lastOpenedView !== this) {
        if (lastOpenedView.maximized) {
          this.subscriptions.remove(this.maximizeBtn.tooltip);
          this.maximizeBtn.tooltip.dispose();
          icon = this.maximizeBtn.children('span');
          this.maxHeight = lastOpenedView.maxHeight;
          this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
            title: 'Normal'
          });
          this.subscriptions.add(this.maximizeBtn.tooltip);
          icon.removeClass('icon-screen-full').addClass('icon-screen-normal');
          this.maximized = true;
        }
        lastOpenedView.hide();
      }
      lastOpenedView = this;
      this.statusBar.setActiveTerminalView(this);
      this.statusIcon.activate();
      this.onTransitionEnd((function(_this) {
        return function() {
          if (!_this.opened) {
            _this.opened = true;
            _this.displayTerminal();
            _this.prevHeight = _this.nearestRow(_this.xterm.height());
            return _this.xterm.height(_this.prevHeight);
          } else {
            return _this.focus();
          }
        };
      })(this));
      this.panel.show();
      this.xterm.height(0);
      this.animating = true;
      return this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
    };

    TerminalPlusView.prototype.hide = function() {
      var _ref2;
      if ((_ref2 = this.terminal) != null) {
        _ref2.blur();
      }
      lastOpenedView = null;
      this.statusIcon.deactivate();
      this.onTransitionEnd((function(_this) {
        return function() {
          _this.panel.hide();
          if (lastOpenedView == null) {
            if (lastActiveElement != null) {
              lastActiveElement.focus();
              return lastActiveElement = null;
            }
          }
        };
      })(this));
      this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
      this.animating = true;
      return this.xterm.height(0);
    };

    TerminalPlusView.prototype.toggle = function() {
      if (this.animating) {
        return;
      }
      if (this.panel.isVisible()) {
        return this.hide();
      } else {
        return this.open();
      }
    };

    TerminalPlusView.prototype.input = function(data) {
      if (this.ptyProcess.childProcess == null) {
        return;
      }
      this.terminal.stopScrolling();
      return this.ptyProcess.send({
        event: 'input',
        text: data
      });
    };

    TerminalPlusView.prototype.resize = function(cols, rows) {
      if (this.ptyProcess.childProcess == null) {
        return;
      }
      return this.ptyProcess.send({
        event: 'resize',
        rows: rows,
        cols: cols
      });
    };

    TerminalPlusView.prototype.applyStyle = function() {
      var config, defaultFont, editorFont, editorFontSize, overrideFont, overrideFontSize, _ref2, _ref3;
      config = atom.config.get('terminal-plus');
      this.xterm.addClass(config.style.theme);
      if (config.toggles.cursorBlink) {
        this.xterm.addClass('cursor-blink');
      }
      editorFont = atom.config.get('editor.fontFamily');
      defaultFont = "Menlo, Consolas, 'DejaVu Sans Mono', monospace";
      overrideFont = config.style.fontFamily;
      this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
      this.subscriptions.add(atom.config.onDidChange('editor.fontFamily', (function(_this) {
        return function(event) {
          editorFont = event.newValue;
          return _this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('terminal-plus.style.fontFamily', (function(_this) {
        return function(event) {
          overrideFont = event.newValue;
          return _this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
        };
      })(this)));
      editorFontSize = atom.config.get('editor.fontSize');
      overrideFontSize = config.style.fontSize;
      this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
      this.subscriptions.add(atom.config.onDidChange('editor.fontSize', (function(_this) {
        return function(event) {
          editorFontSize = event.newValue;
          _this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
          return _this.resizeTerminalToView();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('terminal-plus.style.fontSize', (function(_this) {
        return function(event) {
          overrideFontSize = event.newValue;
          _this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
          return _this.resizeTerminalToView();
        };
      })(this)));
      [].splice.apply(this.terminal.colors, [0, 8].concat(_ref2 = [config.ansiColors.normal.black.toHexString(), config.ansiColors.normal.red.toHexString(), config.ansiColors.normal.green.toHexString(), config.ansiColors.normal.yellow.toHexString(), config.ansiColors.normal.blue.toHexString(), config.ansiColors.normal.magenta.toHexString(), config.ansiColors.normal.cyan.toHexString(), config.ansiColors.normal.white.toHexString()])), _ref2;
      return ([].splice.apply(this.terminal.colors, [8, 8].concat(_ref3 = [config.ansiColors.zBright.brightBlack.toHexString(), config.ansiColors.zBright.brightRed.toHexString(), config.ansiColors.zBright.brightGreen.toHexString(), config.ansiColors.zBright.brightYellow.toHexString(), config.ansiColors.zBright.brightBlue.toHexString(), config.ansiColors.zBright.brightMagenta.toHexString(), config.ansiColors.zBright.brightCyan.toHexString(), config.ansiColors.zBright.brightWhite.toHexString()])), _ref3);
    };

    TerminalPlusView.prototype.attachWindowEvents = function() {
      return $(window).on('resize', this.onWindowResize);
    };

    TerminalPlusView.prototype.detachWindowEvents = function() {
      return $(window).off('resize', this.onWindowResize);
    };

    TerminalPlusView.prototype.attachResizeEvents = function() {
      return this.panelDivider.on('mousedown', this.resizeStarted);
    };

    TerminalPlusView.prototype.detachResizeEvents = function() {
      return this.panelDivider.off('mousedown');
    };

    TerminalPlusView.prototype.onWindowResize = function() {
      var bottomPanel, clamped, delta, newHeight, overflow;
      if (!this.tabView) {
        this.xterm.css('transition', '');
        newHeight = $(window).height();
        bottomPanel = $('atom-panel-container.bottom').first().get(0);
        overflow = bottomPanel.scrollHeight - bottomPanel.offsetHeight;
        delta = newHeight - this.windowHeight;
        this.windowHeight = newHeight;
        if (this.maximized) {
          clamped = Math.max(this.maxHeight + delta, this.rowHeight);
          if (this.panel.isVisible()) {
            this.adjustHeight(clamped);
          }
          this.maxHeight = clamped;
          this.prevHeight = Math.min(this.prevHeight, this.maxHeight);
        } else if (overflow > 0) {
          clamped = Math.max(this.nearestRow(this.prevHeight + delta), this.rowHeight);
          if (this.panel.isVisible()) {
            this.adjustHeight(clamped);
          }
          this.prevHeight = clamped;
        }
        this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
      }
      return this.resizeTerminalToView();
    };

    TerminalPlusView.prototype.resizeStarted = function() {
      if (this.maximized) {
        return;
      }
      this.maxHeight = this.prevHeight + $('.item-views').height();
      $(document).on('mousemove', this.resizePanel);
      $(document).on('mouseup', this.resizeStopped);
      return this.xterm.css('transition', '');
    };

    TerminalPlusView.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizePanel);
      $(document).off('mouseup', this.resizeStopped);
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    TerminalPlusView.prototype.nearestRow = function(value) {
      var rows;
      rows = Math.floor(value / this.rowHeight);
      return rows * this.rowHeight;
    };

    TerminalPlusView.prototype.resizePanel = function(event) {
      var clamped, delta, mouseY;
      if (event.which !== 1) {
        return this.resizeStopped();
      }
      mouseY = $(window).height() - event.pageY;
      delta = mouseY - $('atom-panel-container.bottom').height();
      if (!(Math.abs(delta) > (this.rowHeight * 5 / 6))) {
        return;
      }
      clamped = Math.max(this.nearestRow(this.prevHeight + delta), this.rowHeight);
      if (clamped > this.maxHeight) {
        return;
      }
      this.xterm.height(clamped);
      $(this.terminal.element).height(clamped);
      this.prevHeight = clamped;
      return this.resizeTerminalToView();
    };

    TerminalPlusView.prototype.adjustHeight = function(height) {
      this.xterm.height(height);
      return $(this.terminal.element).height(height);
    };

    TerminalPlusView.prototype.copy = function() {
      var lines, rawLines, rawText, text, textarea;
      if (this.terminal._selected) {
        textarea = this.terminal.getCopyTextarea();
        text = this.terminal.grabText(this.terminal._selected.x1, this.terminal._selected.x2, this.terminal._selected.y1, this.terminal._selected.y2);
      } else {
        rawText = this.terminal.context.getSelection().toString();
        rawLines = rawText.split(/\r?\n/g);
        lines = rawLines.map(function(line) {
          return line.replace(/\s/g, " ").trimRight();
        });
        text = lines.join("\n");
      }
      return atom.clipboard.write(text);
    };

    TerminalPlusView.prototype.paste = function() {
      return this.input(atom.clipboard.read());
    };

    TerminalPlusView.prototype.insertSelection = function() {
      var cursor, editor, line, runCommand, selection;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      runCommand = atom.config.get('terminal-plus.toggles.runInsertedText');
      if (selection = editor.getSelectedText()) {
        this.terminal.stopScrolling();
        return this.input("" + selection + (runCommand ? os.EOL : ''));
      } else if (cursor = editor.getCursorBufferPosition()) {
        line = editor.lineTextForBufferRow(cursor.row);
        this.terminal.stopScrolling();
        this.input("" + line + (runCommand ? os.EOL : ''));
        return editor.moveDown(1);
      }
    };

    TerminalPlusView.prototype.focus = function() {
      this.resizeTerminalToView();
      this.focusTerminal();
      this.statusBar.setActiveTerminalView(this);
      return TerminalPlusView.__super__.focus.call(this);
    };

    TerminalPlusView.prototype.blur = function() {
      this.blurTerminal();
      return TerminalPlusView.__super__.blur.call(this);
    };

    TerminalPlusView.prototype.focusTerminal = function() {
      if (!this.terminal) {
        return;
      }
      this.terminal.focus();
      if (this.terminal._textarea) {
        return this.terminal._textarea.focus();
      } else {
        return this.terminal.element.focus();
      }
    };

    TerminalPlusView.prototype.blurTerminal = function() {
      if (!this.terminal) {
        return;
      }
      this.terminal.blur();
      return this.terminal.element.blur();
    };

    TerminalPlusView.prototype.resizeTerminalToView = function() {
      var cols, rows, _ref2;
      if (!(this.panel.isVisible() || this.tabView)) {
        return;
      }
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      if (!(cols > 0 && rows > 0)) {
        return;
      }
      if (!this.terminal) {
        return;
      }
      if (this.terminal.rows === rows && this.terminal.cols === cols) {
        return;
      }
      this.resize(cols, rows);
      return this.terminal.resize(cols, rows);
    };

    TerminalPlusView.prototype.getDimensions = function() {
      var cols, fakeCol, fakeRow, rows;
      fakeRow = $("<div><span>&nbsp;</span></div>");
      if (this.terminal) {
        this.find('.terminal').append(fakeRow);
        fakeCol = fakeRow.children().first()[0].getBoundingClientRect();
        cols = Math.floor(this.xterm.width() / (fakeCol.width || 9));
        rows = Math.floor(this.xterm.height() / (fakeCol.height || 20));
        this.rowHeight = fakeCol.height;
        fakeRow.remove();
      } else {
        cols = Math.floor(this.xterm.width() / 9);
        rows = Math.floor(this.xterm.height() / 20);
      }
      return {
        cols: cols,
        rows: rows
      };
    };

    TerminalPlusView.prototype.onTransitionEnd = function(callback) {
      return this.xterm.one('webkitTransitionEnd', (function(_this) {
        return function() {
          callback();
          return _this.animating = false;
        };
      })(this));
    };

    TerminalPlusView.prototype.inputDialog = function() {
      var dialog;
      if (InputDialog == null) {
        InputDialog = require('./input-dialog');
      }
      dialog = new InputDialog(this);
      return dialog.attach();
    };

    TerminalPlusView.prototype.rename = function() {
      return this.statusIcon.rename();
    };

    TerminalPlusView.prototype.toggleTabView = function() {
      if (this.tabView) {
        this.panel = atom.workspace.addBottomPanel({
          item: this,
          visible: false
        });
        this.attachResizeEvents();
        this.closeBtn.show();
        this.hideBtn.show();
        this.maximizeBtn.show();
        return this.tabView = false;
      } else {
        this.panel.destroy();
        this.detachResizeEvents();
        this.closeBtn.hide();
        this.hideBtn.hide();
        this.maximizeBtn.hide();
        this.xterm.css("height", "");
        this.tabView = true;
        if (lastOpenedView === this) {
          return lastOpenedView = null;
        }
      }
    };

    TerminalPlusView.prototype.getTitle = function() {
      return this.statusIcon.getName() || "Terminal-Plus";
    };

    TerminalPlusView.prototype.getIconName = function() {
      return "terminal";
    };

    TerminalPlusView.prototype.getShell = function() {
      return path.basename(this.shell);
    };

    TerminalPlusView.prototype.getShellPath = function() {
      return this.shell;
    };

    TerminalPlusView.prototype.emit = function(event, data) {
      return this.emitter.emit(event, data);
    };

    TerminalPlusView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    TerminalPlusView.prototype.getPath = function() {
      return this.getTerminalTitle();
    };

    TerminalPlusView.prototype.getTerminalTitle = function() {
      return this.title || this.process;
    };

    TerminalPlusView.prototype.getTerminal = function() {
      return this.terminal;
    };

    TerminalPlusView.prototype.isAnimating = function() {
      return this.animating;
    };

    return TerminalPlusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUpBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QyxPQUFBLENBQVEsTUFBUixDQUF2QyxFQUFDLFlBQUEsSUFBRCxFQUFPLDJCQUFBLG1CQUFQLEVBQTRCLGVBQUEsT0FBNUIsQ0FBQTs7QUFBQSxFQUNBLFFBQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxVQUFBLENBQUQsRUFBSSxhQUFBLElBREosQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFPLENBQUMsT0FBUixDQUFnQixXQUFoQixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLElBTGQsQ0FBQTs7QUFBQSxFQU9BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVBQLENBQUE7O0FBQUEsRUFRQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FSTCxDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUFpQixJQVZqQixDQUFBOztBQUFBLEVBV0EsaUJBQUEsR0FBb0IsSUFYcEIsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsK0JBQUEsU0FBQSxHQUFXLEtBQVgsQ0FBQTs7QUFBQSwrQkFDQSxFQUFBLEdBQUksRUFESixDQUFBOztBQUFBLCtCQUVBLFNBQUEsR0FBVyxLQUZYLENBQUE7O0FBQUEsK0JBR0EsTUFBQSxHQUFRLEtBSFIsQ0FBQTs7QUFBQSwrQkFJQSxHQUFBLEdBQUssRUFKTCxDQUFB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/view.coffee
