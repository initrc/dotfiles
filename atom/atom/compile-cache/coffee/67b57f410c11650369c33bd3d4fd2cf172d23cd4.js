(function() {
  var CommandOutputView, TextEditorView, View, addClass, ansihtml, exec, fs, lastOpenedView, readline, removeClass, resolve, spawn, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  View = require('atom-space-pen-views').View;

  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;

  ansihtml = require('ansi-html-stream');

  readline = require('readline');

  _ref1 = require('domutil'), addClass = _ref1.addClass, removeClass = _ref1.removeClass;

  resolve = require('path').resolve;

  fs = require('fs');

  lastOpenedView = null;

  module.exports = CommandOutputView = (function(_super) {
    __extends(CommandOutputView, _super);

    function CommandOutputView() {
      this.flashIconClass = __bind(this.flashIconClass, this);
      return CommandOutputView.__super__.constructor.apply(this, arguments);
    }

    CommandOutputView.prototype.cwd = null;

    CommandOutputView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'panel cli-status panel-bottom'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'killBtn',
                click: 'kill',
                "class": 'btn hide'
              }, function() {
                return _this.span('kill');
              });
              _this.button({
                click: 'destroy',
                "class": 'btn'
              }, function() {
                return _this.span('destroy');
              });
              return _this.button({
                click: 'close',
                "class": 'btn'
              }, function() {
                _this.span({
                  "class": "icon icon-x"
                });
                return _this.span('close');
              });
            });
          });
          return _this.div({
            "class": 'cli-panel-body'
          }, function() {
            _this.pre({
              "class": "terminal",
              outlet: "cliOutput"
            }, "Welcome to terminal status. http://github.com/guileen/terminal-status");
            return _this.subview('cmdEditor', new TextEditorView({
              mini: true,
              placeholderText: 'input your command here'
            }));
          });
        };
      })(this));
    };

    CommandOutputView.prototype.initialize = function() {
      var assigned, cmd, command, _fn, _i, _len;
      this.userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      assigned = false;
      cmd = [['test -e /etc/profile && source /etc/profile', 'test -e ~/.profile && source ~/.profile', ['node -pe "JSON.stringify(process.env)"', 'nodejs -pe "JSON.stringify(process.env)"', 'iojs -pe "JSON.stringify(process.env)"'].join("||")].join(";"), 'node -pe "JSON.stringify(process.env)"', 'nodejs -pe "JSON.stringify(process.env)"', 'iojs -pe "JSON.stringify(process.env)"'];
      _fn = function(command) {
        if (!assigned) {
          return exec(command, function(code, stdout, stderr) {
            if (!assigned && !stderr) {
              try {
                process.env = JSON.parse(stdout);
                return assigned = true;
              } catch (_error) {
                return console.log("" + command + " couldn't be loaded");
              }
            }
          });
        }
      };
      for (_i = 0, _len = cmd.length; _i < _len; _i++) {
        command = cmd[_i];
        _fn(command);
      }
      atom.commands.add('atom-workspace', "cli-status:toggle-output", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      return atom.commands.add('atom-workspace', "core:confirm", (function(_this) {
        return function() {
          return _this.readLine();
        };
      })(this));
    };

    CommandOutputView.prototype.readLine = function() {
      var args, cmd, inputCmd;
      inputCmd = this.cmdEditor.getModel().getText();
      this.cliOutput.append("\n$>" + inputCmd + "\n");
      this.scrollToBottom();
      args = [];
      inputCmd.replace(/("[^"]*"|'[^']*'|[^\s'"]+)/g, (function(_this) {
        return function(s) {
          if (s[0] !== '"' && s[0] !== "'") {
            s = s.replace(/~/g, _this.userHome);
          }
          return args.push(s);
        };
      })(this));
      cmd = args.shift();
      if (cmd === 'cd') {
        return this.cd(args);
      }
      if (cmd === 'ls') {
        return this.ls(args);
      }
      return this.spawn(inputCmd, cmd, args);
    };

    CommandOutputView.prototype.adjustWindowHeight = function() {
      var maxHeight;
      maxHeight = atom.config.get('terminal-status.WindowHeight');
      return this.cliOutput.css("max-height", "" + maxHeight + "px");
    };

    CommandOutputView.prototype.showCmd = function() {
      this.cmdEditor.show();
      this.cmdEditor.getModel().selectAll();
      this.cmdEditor.focus();
      return this.scrollToBottom();
    };

    CommandOutputView.prototype.scrollToBottom = function() {
      return this.cliOutput.scrollTop(10000000);
    };

    CommandOutputView.prototype.flashIconClass = function(className, time) {
      var onStatusOut;
      if (time == null) {
        time = 100;
      }
      console.log('addClass', className);
      addClass(this.statusIcon, className);
      this.timer && clearTimeout(this.timer);
      onStatusOut = (function(_this) {
        return function() {
          return removeClass(_this.statusIcon, className);
        };
      })(this);
      return this.timer = setTimeout(onStatusOut, time);
    };

    CommandOutputView.prototype.destroy = function() {
      var _destroy;
      _destroy = (function(_this) {
        return function() {
          if (_this.hasParent()) {
            _this.close();
          }
          if (_this.statusIcon && _this.statusIcon.parentNode) {
            _this.statusIcon.parentNode.removeChild(_this.statusIcon);
          }
          return _this.statusView.removeCommandView(_this);
        };
      })(this);
      if (this.program) {
        this.program.once('exit', _destroy);
        return this.program.kill();
      } else {
        return _destroy();
      }
    };

    CommandOutputView.prototype.kill = function() {
      if (this.program) {
        return this.program.kill();
      }
    };

    CommandOutputView.prototype.open = function() {
      this.lastLocation = atom.workspace.getActivePane();
      if (!this.hasParent()) {
        atom.workspace.addBottomPanel({
          item: this
        });
      }
      if (lastOpenedView && lastOpenedView !== this) {
        lastOpenedView.close();
      }
      lastOpenedView = this;
      this.scrollToBottom();
      this.statusView.setActiveCommandView(this);
      return this.cmdEditor.focus();
    };

    CommandOutputView.prototype.close = function() {
      this.lastLocation.activate();
      this.detach();
      return lastOpenedView = null;
    };

    CommandOutputView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    CommandOutputView.prototype.cd = function(args) {
      var dir;
      if (!args[0]) {
        args = [this.getCwd()];
      }
      dir = resolve(this.getCwd(), args[0]);
      return fs.stat(dir, (function(_this) {
        return function(err, stat) {
          if (err) {
            if (err.code === 'ENOENT') {
              return _this.errorMessage("cd: " + args[0] + ": No such file or directory");
            }
            return _this.errorMessage(err.message);
          }
          if (!stat.isDirectory()) {
            return _this.errorMessage("cd: not a directory: " + args[0]);
          }
          _this.cwd = dir;
          return _this.message("cwd: " + _this.cwd);
        };
      })(this));
    };

    CommandOutputView.prototype.ls = function(args) {
      var files, filesBlocks;
      files = fs.readdirSync(this.getCwd());
      filesBlocks = [];
      files.forEach((function(_this) {
        return function(filename) {
          try {
            return filesBlocks.push(_this._fileInfoHtml(filename, _this.getCwd()));
          } catch (_error) {
            return console.log("" + filename + " couln't be read");
          }
        };
      })(this));
      filesBlocks = filesBlocks.sort(function(a, b) {
        var aDir, bDir;
        aDir = a[1].isDirectory();
        bDir = b[1].isDirectory();
        if (aDir && !bDir) {
          return -1;
        }
        if (!aDir && bDir) {
          return 1;
        }
        return a[2] > b[2] && 1 || -1;
      });
      filesBlocks = filesBlocks.map(function(b) {
        return b[0];
      });
      return this.message(filesBlocks.join('') + '<div class="clear"/>');
    };

    CommandOutputView.prototype._fileInfoHtml = function(filename, parent) {
      var classes, filepath, stat;
      classes = ['icon', 'file-info'];
      filepath = parent + '/' + filename;
      stat = fs.lstatSync(filepath);
      if (stat.isSymbolicLink()) {
        classes.push('stat-link');
        stat = fs.statSync(filepath);
      }
      if (stat.isFile()) {
        if (stat.mode & 73) {
          classes.push('stat-program');
        }
        classes.push('icon-file-text');
      }
      if (stat.isDirectory()) {
        classes.push('icon-file-directory');
      }
      if (stat.isCharacterDevice()) {
        classes.push('stat-char-dev');
      }
      if (stat.isFIFO()) {
        classes.push('stat-fifo');
      }
      if (stat.isSocket()) {
        classes.push('stat-sock');
      }
      if (filename[0] === '.') {
        classes.push('status-ignored');
      }
      return ["<span class=\"" + (classes.join(' ')) + "\">" + filename + "</span>", stat, filename];
    };

    CommandOutputView.prototype.getGitStatusName = function(path, gitRoot, repo) {
      var status;
      status = (repo.getCachedPathStatus || repo.getPathStatus)(path);
      console.log('path status', path, status);
      if (status) {
        if (repo.isStatusModified(status)) {
          return 'modified';
        }
        if (repo.isStatusNew(status)) {
          return 'added';
        }
      }
      if (repo.isPathIgnore(path)) {
        return 'ignored';
      }
    };

    CommandOutputView.prototype.message = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-error');
      return addClass(this.statusIcon, 'status-success');
    };

    CommandOutputView.prototype.errorMessage = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-success');
      return addClass(this.statusIcon, 'status-error');
    };

    CommandOutputView.prototype.getCwd = function() {
      var activeRootDir, editor, i, rootDirs, _i, _ref2;
      editor = atom.workspace.getActiveTextEditor();
      rootDirs = atom.project.rootDirectories;
      activeRootDir = 0;
      for (i = _i = 0, _ref2 = rootDirs.length; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if (editor && rootDirs[i] && rootDirs[i].contains(editor.getPath())) {
          activeRootDir = i;
        }
      }
      if (rootDirs.length === 0) {
        rootDirs = false;
      }
      this.cwd = this.cwd || (rootDirs[activeRootDir] && rootDirs[activeRootDir].path) || this.userHome;
      return this.cwd;
    };

    CommandOutputView.prototype.spawn = function(inputCmd, cmd, args) {
      var err, htmlStream;
      this.cmdEditor.hide();
      htmlStream = ansihtml();
      htmlStream.on('data', (function(_this) {
        return function(data) {
          _this.cliOutput.append(data);
          return _this.scrollToBottom();
        };
      })(this));
      try {
        this.program = exec(inputCmd, {
          stdio: 'pipe',
          env: process.env,
          cwd: this.getCwd()
        });
        this.program.stdout.pipe(htmlStream);
        this.program.stderr.pipe(htmlStream);
        removeClass(this.statusIcon, 'status-success');
        removeClass(this.statusIcon, 'status-error');
        addClass(this.statusIcon, 'status-running');
        this.killBtn.removeClass('hide');
        this.program.once('exit', (function(_this) {
          return function(code) {
            console.log('exit', code);
            _this.killBtn.addClass('hide');
            removeClass(_this.statusIcon, 'status-running');
            _this.program = null;
            addClass(_this.statusIcon, code === 0 && 'status-success' || 'status-error');
            return _this.showCmd();
          };
        })(this));
        this.program.on('error', (function(_this) {
          return function(err) {
            console.log('error');
            _this.cliOutput.append(err.message);
            _this.showCmd();
            return addClass(_this.statusIcon, 'status-error');
          };
        })(this));
        this.program.stdout.on('data', (function(_this) {
          return function() {
            _this.flashIconClass('status-info');
            return removeClass(_this.statusIcon, 'status-error');
          };
        })(this));
        return this.program.stderr.on('data', (function(_this) {
          return function() {
            console.log('stderr');
            return _this.flashIconClass('status-error', 300);
          };
        })(this));
      } catch (_error) {
        err = _error;
        this.cliOutput.append(err.message);
        return this.showCmd();
      }
    };

    return CommandOutputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtc3RhdHVzL2xpYi9jb21tYW5kLW91dHB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5SUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLGlCQUFrQixPQUFBLENBQVEsc0JBQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxPQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixFQUFDLGFBQUEsS0FBRCxFQUFRLFlBQUEsSUFGUixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsUUFBMEIsT0FBQSxDQUFRLFNBQVIsQ0FBMUIsRUFBQyxpQkFBQSxRQUFELEVBQVcsb0JBQUEsV0FMWCxDQUFBOztBQUFBLEVBTUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BTkQsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVBMLENBQUE7O0FBQUEsRUFTQSxjQUFBLEdBQWlCLElBVGpCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osd0NBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxHQUFBLEdBQUssSUFBTCxDQUFBOztBQUFBLElBQ0EsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsUUFBQSxFQUFVLENBQUEsQ0FBVjtBQUFBLFFBQWMsT0FBQSxFQUFP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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-status/lib/command-output-view.coffee
