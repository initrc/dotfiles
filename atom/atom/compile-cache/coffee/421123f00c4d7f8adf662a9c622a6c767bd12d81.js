
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  The main terminal view class, which does the most of all the work.
 */

(function() {
  var $, ATPCommandFinderView, ATPCommandsBuiltins, ATPCore, ATPOutputView, ATPVariablesBuiltins, TextEditorView, View, ansihtml, dirname, exec, execSync, extname, fs, iconv, lastOpenedView, os, resolve, sep, spawn, stream, _ref, _ref1, _ref2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  lastOpenedView = null;

  fs = include('fs');

  os = include('os');

  _ref = include('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  _ref1 = include('child_process'), spawn = _ref1.spawn, exec = _ref1.exec, execSync = _ref1.execSync;

  _ref2 = include('path'), resolve = _ref2.resolve, dirname = _ref2.dirname, extname = _ref2.extname, sep = _ref2.sep;

  ansihtml = include('ansi-html-stream');

  stream = include('stream');

  iconv = include('iconv-lite');

  ATPCommandFinderView = include('atp-command-finder');

  ATPCore = include('atp-core');

  ATPCommandsBuiltins = include('atp-builtins-commands');

  ATPVariablesBuiltins = include('atp-builtins-variables');

  window.$ = window.jQuery = $;

  include('jquery-autocomplete-js');

  module.exports = ATPOutputView = (function(_super) {
    __extends(ATPOutputView, _super);

    function ATPOutputView() {
      this.spawn = __bind(this.spawn, this);
      this.flashIconClass = __bind(this.flashIconClass, this);
      this.parseSpecialStringTemplate = __bind(this.parseSpecialStringTemplate, this);
      return ATPOutputView.__super__.constructor.apply(this, arguments);
    }

    ATPOutputView.prototype.cwd = null;

    ATPOutputView.prototype.streamsEncoding = 'iso-8859-3';

    ATPOutputView.prototype._cmdintdel = 50;

    ATPOutputView.prototype.echoOn = true;

    ATPOutputView.prototype.redirectOutput = '';

    ATPOutputView.prototype.specsMode = false;

    ATPOutputView.prototype.inputLine = 0;

    ATPOutputView.prototype.helloMessageShown = false;

    ATPOutputView.prototype.minHeight = 250;

    ATPOutputView.prototype.util = include('atp-terminal-util');

    ATPOutputView.prototype.currentInputBox = null;

    ATPOutputView.prototype.currentInputBox = null;

    ATPOutputView.prototype.currentInputBoxTmr = null;

    ATPOutputView.prototype.volatileSuggestions = [];

    ATPOutputView.prototype.disposables = {
      dispose: function(field) {
        var a, i, _i, _ref3, _results;
        if (ATPOutputView[field] == null) {
          ATPOutputView[field] = [];
        }
        a = ATPOutputView[field];
        _results = [];
        for (i = _i = 0, _ref3 = a.length - 1; _i <= _ref3; i = _i += 1) {
          _results.push(a[i].dispose());
        }
        return _results;
      },
      add: function(field, value) {
        if (ATPOutputView[field] == null) {
          ATPOutputView[field] = [];
        }
        return ATPOutputView[field].push(value);
      }
    };

    ATPOutputView.prototype.keyCodes = {
      enter: 13,
      arrowUp: 38,
      arrowDown: 40,
      arrowLeft: 37,
      arrowRight: 39
    };

    ATPOutputView.prototype.localCommandAtomBindings = [];

    ATPOutputView.prototype.localCommands = ATPCommandsBuiltins;

    ATPOutputView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'panel atp-panel panel-bottom',
        outlet: 'atpView'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'terminal panel-divider',
            style: 'cursor:n-resize;width:100%;height:8px;',
            outlet: 'panelDivider'
          });
          _this.button({
            outlet: 'maximizeIconBtn',
            "class": 'atp-maximize-btn',
            click: 'maximize'
          });
          _this.button({
            outlet: 'closeIconBtn',
            "class": 'atp-close-btn',
            click: 'close'
          });
          _this.button({
            outlet: 'destroyIconBtn',
            "class": 'atp-destroy-btn',
            click: 'destroy'
          });
          _this.div({
            "class": 'panel-heading btn-toolbar',
            outlet: 'consoleToolbarHeading'
          }, function() {
            _this.div({
              "class": 'btn-group',
              outlet: 'consoleToolbar'
            }, function() {
              _this.button({
                outlet: 'killBtn',
                click: 'kill',
                "class": 'btn hide'
              }, function() {
                return _this.span('kill');
              });
              _this.button({
                outlet: 'exitBtn',
                click: 'destroy',
                "class": 'btn'
              }, function() {
                return _this.span('exit');
              });
              return _this.button({
                outlet: 'closeBtn',
                click: 'close',
                "class": 'btn'
              }, function() {
                _this.span({
                  "class": "icon icon-x"
                });
                return _this.span('close');
              });
            });
            _this.button({
              outlet: 'openConfigBtn',
              "class": 'btn icon icon-gear inline-block-tight button-settings',
              click: 'showSettings'
            }, function() {
              return _this.span('Open config');
            });
            return _this.button({
              outlet: 'reloadConfigBtn',
              "class": 'btn icon icon-gear inline-block-tight button-settings',
              click: 'reloadSettings'
            }, function() {
              return _this.span('Reload config');
            });
          });
          return _this.div({
            "class": 'atp-panel-body'
          }, function() {
            return _this.pre({
              "class": "terminal",
              outlet: "cliOutput"
            });
          });
        };
      })(this));
    };

    ATPOutputView.prototype.toggleAutoCompletion = function() {
      if (this.currentInputBoxCmp != null) {
        this.currentInputBoxCmp.enable();
        this.currentInputBoxCmp.repaint();
        this.currentInputBoxCmp.showDropDown();
        return this.currentInputBox.find('.terminal-input').height('100px');
      }
    };

    ATPOutputView.prototype.fsSpy = function() {
      this.volatileSuggestions = [];
      if (this.cwd != null) {
        return fs.readdir(this.cwd, (function(_this) {
          return function(err, files) {
            var file, _i, _len, _results;
            if (files != null) {
              _results = [];
              for (_i = 0, _len = files.length; _i < _len; _i++) {
                file = files[_i];
                _results.push(_this.volatileSuggestions.push(file));
              }
              return _results;
            }
          };
        })(this));
      }
    };

    ATPOutputView.prototype.turnSpecsMode = function(state) {
      return this.specsMode = state;
    };

    ATPOutputView.prototype.getRawOutput = function() {
      var t;
      t = this.getHtmlOutput().replace(/<[^>]*>/igm, "");
      t = this.util.replaceAll("&gt;", ">", t);
      t = this.util.replaceAll("&lt;", "<", t);
      t = this.util.replaceAll("&quot;", "\"", t);
      return t;
    };

    ATPOutputView.prototype.getHtmlOutput = function() {
      return this.cliOutput.html();
    };

    ATPOutputView.prototype.resolvePath = function(path) {
      var filepath;
      path = this.util.replaceAll('\"', '', path);
      filepath = '';
      if (path.match(/([A-Za-z]):/ig) !== null) {
        filepath = path;
      } else {
        filepath = this.getCwd() + '/' + path;
      }
      filepath = this.util.replaceAll('\\', '/', filepath);
      return this.util.replaceAll('\\', '/', resolve(filepath));
    };

    ATPOutputView.prototype.reloadSettings = function() {
      return this.onCommand('update');
    };

    ATPOutputView.prototype.showSettings = function() {
      ATPCore.reload();
      return setTimeout((function(_this) {
        return function() {
          var atomPath, configPath, panelPath;
          panelPath = atom.packages.resolvePackagePath('atom-terminal-panel');
          atomPath = resolve(panelPath + '/../..');
          configPath = atomPath + '/terminal-commands.json';
          return atom.workspace.open(configPath);
        };
      })(this), 50);
    };

    ATPOutputView.prototype.focusInputBox = function() {
      if (this.currentInputBoxCmp != null) {
        return this.currentInputBoxCmp.input.focus();
      }
    };

    ATPOutputView.prototype.updateInputCursor = function(textarea) {
      var val;
      this.rawMessage('test\n');
      val = textarea.val();
      return textarea.blur().focus().val("").val(val);
    };

    ATPOutputView.prototype.removeInputBox = function() {
      return this.cliOutput.find('.atp-dynamic-input-box').remove();
    };

    ATPOutputView.prototype.putInputBox = function() {
      var endsWith, history, inputComp, prompt;
      if (this.currentInputBoxTmr != null) {
        clearInterval(this.currentInputBoxTmr);
        this.currentInputBoxTmr = null;
      }
      this.cliOutput.find('.atp-dynamic-input-box').remove();
      prompt = this.getCommandPrompt('');
      this.currentInputBox = $('<div style="width: 100%; white-space:nowrap; overflow:hidden; display:inline-block;" class="atp-dynamic-input-box">' + '<div style="position:relative; top:5px; max-height:500px; width: 100%; bottom: -10px; height: 20px; white-space:nowrap; overflow:hidden; display:inline-block;" class="terminal-input native-key-bindings"></div>' + '</div>');
      this.currentInputBox.prepend('&nbsp;&nbsp;');
      this.currentInputBox.prepend(prompt);
      history = [];
      if (this.currentInputBoxCmp != null) {
        history = this.currentInputBoxCmp.getInputHistory();
      }
      inputComp = this.currentInputBox.find('.terminal-input');
      this.currentInputBoxCmp = inputComp.autocomplete({
        animation: [['opacity', 0, 0.8]],
        isDisabled: true,
        inputHistory: history,
        inputWidth: '80%',
        dropDownWidth: '30%',
        dropDownDescriptionBoxWidth: '30%',
        dropDownPosition: 'top',
        showDropDown: atom.config.get('atom-terminal-panel.enableConsoleSuggestionsDropdown')
      });
      this.currentInputBoxCmp.confirmed((function(_this) {
        return function() {
          _this.currentInputBoxCmp.disable().repaint();
          return _this.onCommand();
        };
      })(this)).changed((function(_this) {
        return function(inst, text) {
          if (inst.getText().length <= 0) {
            _this.currentInputBoxCmp.disable().repaint();
            return _this.currentInputBox.find('.terminal-input').height('20px');
          }
        };
      })(this));
      this.currentInputBoxCmp.input.keydown((function(_this) {
        return function(e) {
          if ((e.keyCode === 17) && (_this.currentInputBoxCmp.getText().length > 0)) {

            /*
            @currentInputBoxCmp.enable().repaint()
            @currentInputBoxCmp.showDropDown()
            @currentInputBox.find('.terminal-input').height('100px');
             */
          } else if ((e.keyCode === 32) || (e.keyCode === 8)) {
            _this.currentInputBoxCmp.disable().repaint();
            return _this.currentInputBox.find('.terminal-input').height('20px');
          }
        };
      })(this));
      endsWith = function(text, suffix) {
        return text.indexOf(suffix, text.length - suffix.length) !== -1;
      };
      this.currentInputBoxCmp.options = (function(_this) {
        return function(instance, text, lastToken) {
          var e, fsStat, i, o, ret, token, _i, _ref3;
          token = lastToken;
          if (token == null) {
            token = '';
          }
          if (!(endsWith(token, '/') || endsWith(token, '\\'))) {
            token = _this.util.replaceAll('\\', sep, token);
            token = token.split(sep);
            token.pop();
            token = token.join(sep);
            if (!endsWith(token, sep)) {
              token = token + sep;
            }
          }
          o = _this.getCommandsNames().concat(_this.volatileSuggestions);
          fsStat = [];
          if (token != null) {
            try {
              fsStat = fs.readdirSync(token);
              for (i = _i = 0, _ref3 = fsStat.length - 1; _i <= _ref3; i = _i += 1) {
                fsStat[i] = token + fsStat[i];
              }
            } catch (_error) {
              e = _error;
            }
          }
          ret = o.concat(fsStat);
          return ret;
        };
      })(this);
      this.currentInputBoxCmp.hideDropDown();
      setTimeout((function(_this) {
        return function() {
          return _this.currentInputBoxCmp.input.focus();
        };
      })(this), 0);
      this.currentInputBox.appendTo(this.cliOutput);
      return this.focusInputBox();
    };

    ATPOutputView.prototype.readInputBox = function() {
      var ret;
      ret = '';
      if (this.currentInputBoxCmp != null) {
        ret = this.currentInputBoxCmp.getText();
      }
      return ret;
    };

    ATPOutputView.prototype.requireCSS = function(location) {
      if (location == null) {
        return;
      }
      location = resolve(location);
      if (atom.config.get('atom-terminal-panel.logConsole') || this.specsMode) {
        console.log("Require atom-terminal-panel plugin CSS file: " + location + "\n");
      }
      return $('head').append("<link rel='stylesheet' type='text/css' href='" + location + "'/>");
    };

    ATPOutputView.prototype.resolvePluginDependencies = function(path, plugin) {
      var config, css_dependencies, css_dependency, _i, _len;
      config = plugin.dependencies;
      if (config == null) {
        return;
      }
      css_dependencies = config.css;
      if (css_dependencies == null) {
        css_dependencies = [];
      }
      for (_i = 0, _len = css_dependencies.length; _i < _len; _i++) {
        css_dependency = css_dependencies[_i];
        this.requireCSS(path + "/" + css_dependency);
      }
      return delete plugin['dependencies'];
    };

    ATPOutputView.prototype.init = function() {

      /*
      TODO: test-autocomplete Remove this!
      el = $('<div style="z-index: 9999; position: absolute; left: 200px; top: 200px;" id="glotest"></div>')
      el.autocomplete({
        inputWidth: '80%'
      })
      $('body').append(el)
       */
      var action, actions, atomCommands, bt, caller, com, comName, command, eleqr, lastY, mouseDown, normalizedPath, obj, panelDraggingActive, toolbar, _i, _j, _k, _len, _len1, _len2, _ref3;
      lastY = -1;
      mouseDown = false;
      panelDraggingActive = false;
      this.panelDivider.mousedown((function(_this) {
        return function() {
          return panelDraggingActive = true;
        };
      })(this)).mouseup((function(_this) {
        return function() {
          return panelDraggingActive = false;
        };
      })(this));
      $(document).mousedown((function(_this) {
        return function() {
          return mouseDown = true;
        };
      })(this)).mouseup((function(_this) {
        return function() {
          return mouseDown = false;
        };
      })(this)).mousemove((function(_this) {
        return function(e) {
          var delta;
          if (mouseDown && panelDraggingActive) {
            if (lastY !== -1) {
              delta = e.pageY - lastY;
              _this.cliOutput.height(_this.cliOutput.height() - delta);
            }
            return lastY = e.pageY;
          } else {
            return lastY = -1;
          }
        };
      })(this));
      normalizedPath = require("path").join(__dirname, "../commands");
      if (atom.config.get('atom-terminal-panel.logConsole') || this.specsMode) {
        console.log("Loading atom-terminal-panel plugins from the directory: " + normalizedPath + "\n");
      }
      fs.readdirSync(normalizedPath).forEach((function(_this) {
        return function(folder) {
          var fullpath, key, obj, value, _results;
          fullpath = resolve("../commands/" + folder);
          if (atom.config.get('atom-terminal-panel.logConsole') || _this.specsMode) {
            console.log("Require atom-terminal-panel plugin: " + folder + "\n");
          }
          obj = require("../commands/" + folder + "/index.coffee");
          if (atom.config.get('atom-terminal-panel.logConsole')) {
            console.log("Plugin loaded.");
          }
          _this.resolvePluginDependencies(fullpath, obj);
          _results = [];
          for (key in obj) {
            value = obj[key];
            if (value.command != null) {
              _this.localCommands[key] = value;
              _this.localCommands[key].source = 'external-functional';
              _results.push(_this.localCommands[key].sourcefile = folder);
            } else if (value.variable != null) {
              value.name = key;
              _results.push(ATPVariablesBuiltins.putVariable(value));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      if (atom.config.get('atom-terminal-panel.logConsole')) {
        console.log("All plugins were loaded.");
      }
      if (ATPCore.getConfig() != null) {
        actions = ATPCore.getConfig().actions;
        if (actions != null) {
          for (_i = 0, _len = actions.length; _i < _len; _i++) {
            action = actions[_i];
            if (action.length > 1) {
              obj = {};
              obj['atom-terminal-panel:' + action[0]] = (function(_this) {
                return function() {
                  _this.open();
                  return _this.onCommand(action[1]);
                };
              })(this);
              atom.commands.add('atom-workspace', obj);
            }
          }
        }
      }
      if (atom.workspace != null) {
        eleqr = (_ref3 = atom.workspace.getActivePaneItem()) != null ? _ref3 : atom.workspace;
        eleqr = atom.views.getView(eleqr);
        atomCommands = atom.commands.findCommands({
          target: eleqr
        });
        for (_j = 0, _len1 = atomCommands.length; _j < _len1; _j++) {
          command = atomCommands[_j];
          comName = command.name;
          com = {};
          com.description = command.displayName;
          com.command = (function(comNameP) {
            return function(state, args) {
              var ele, _ref4;
              ele = (_ref4 = atom.workspace.getActivePaneItem()) != null ? _ref4 : atom.workspace;
              ele = atom.views.getView(ele);
              atom.commands.dispatch(ele, comNameP);
              return (state.consoleLabel('info', "info")) + (state.consoleText('info', 'Atom command executed: ' + comNameP));
            };
          })(comName);
          com.source = "internal-atom";
          this.localCommands[comName] = com;
        }
      }
      toolbar = ATPCore.getConfig().toolbar;
      if (toolbar != null) {
        toolbar.reverse();
        for (_k = 0, _len2 = toolbar.length; _k < _len2; _k++) {
          com = toolbar[_k];
          bt = $("<div class=\"btn\" data-action=\"" + com[1] + "\" ><span>" + com[0] + "</span></div>");
          if (com[2] != null) {
            atom.tooltips.add(bt, {
              title: com[2]
            });
          }
          this.consoleToolbar.prepend(bt);
          caller = this;
          bt.click(function() {
            return caller.onCommand($(this).data('action'));
          });
        }
      }
      return this;
    };

    ATPOutputView.prototype.commandLineNotCounted = function() {
      return this.inputLine--;
    };

    ATPOutputView.prototype.parseSpecialStringTemplate = function(prompt, values, isDOM) {
      if (isDOM == null) {
        isDOM = false;
      }
      if (isDOM) {
        return ATPVariablesBuiltins.parseHtml(this, prompt, values);
      } else {
        return ATPVariablesBuiltins.parse(this, prompt, values);
      }
    };

    ATPOutputView.prototype.getCommandPrompt = function(cmd) {
      return this.parseTemplate(atom.config.get('atom-terminal-panel.commandPrompt'), {
        cmd: cmd
      }, true);
    };

    ATPOutputView.prototype.delay = function(callback, delay) {
      if (delay == null) {
        delay = 100;
      }
      return setTimeout(callback, delay);
    };

    ATPOutputView.prototype.execDelayedCommand = function(delay, cmd, args, state) {
      var callback, caller;
      caller = this;
      callback = function() {
        return caller.exec(cmd, args, state);
      };
      return setTimeout(callback, delay);
    };

    ATPOutputView.prototype.moveToCurrentDirectory = function() {
      var CURRENT_LOCATION;
      CURRENT_LOCATION = this.getCurrentFileLocation();
      if (CURRENT_LOCATION != null) {
        return this.cd([CURRENT_LOCATION]);
      }
    };

    ATPOutputView.prototype.getCurrentFileName = function() {
      var current_file, matcher;
      current_file = this.getCurrentFilePath();
      if (current_file !== null) {
        matcher = /(.*:)((.*)\\)*/ig;
        return current_file.replace(matcher, "");
      }
      return null;
    };

    ATPOutputView.prototype.getCurrentFileLocation = function() {
      if (this.getCurrentFilePath() === null) {
        return null;
      }
      return this.util.replaceAll(this.getCurrentFileName(), "", this.getCurrentFilePath());
    };

    ATPOutputView.prototype.getCurrentFilePath = function() {
      var te;
      if (atom.workspace == null) {
        return null;
      }
      te = atom.workspace.getActiveTextEditor();
      if (te != null) {
        if (te.getPath() != null) {
          return te.getPath();
        }
      }
      return null;
    };

    ATPOutputView.prototype.parseTemplate = function(text, vars, isDOM) {
      var ret;
      if (isDOM == null) {
        isDOM = false;
      }
      if (vars == null) {
        vars = {};
      }
      ret = '';
      if (isDOM) {
        ret = ATPVariablesBuiltins.parseHtml(this, text, vars);
      } else {
        ret = this.parseSpecialStringTemplate(text, vars);
        ret = this.util.replaceAll('%(file-original)', this.getCurrentFilePath(), ret);
        ret = this.util.replaceAll('%(cwd-original)', this.getCwd(), ret);
        ret = this.util.replaceAll('&fs;', '/', ret);
        ret = this.util.replaceAll('&bs;', '\\', ret);
      }
      return ret;
    };

    ATPOutputView.prototype.parseExecToken__ = function(cmd, args, strArgs) {
      var argsNum, i, v, _i;
      if (strArgs != null) {
        cmd = this.util.replaceAll("%(*)", strArgs, cmd);
      }
      cmd = this.util.replaceAll("%(*^)", this.util.replaceAll("%(*^)", "", cmd), cmd);
      if (args != null) {
        argsNum = args.length;
        for (i = _i = 0; _i <= argsNum; i = _i += 1) {
          if (args[i] != null) {
            v = args[i].replace(/\n/ig, '');
            cmd = this.util.replaceAll("%(" + i + ")", args[i], cmd);
          }
        }
      }
      cmd = this.parseTemplate(cmd, {
        file: this.getCurrentFilePath()
      });
      return cmd;
    };

    ATPOutputView.prototype.execStackCounter = 0;

    ATPOutputView.prototype.exec = function(cmdStr, ref_args, state, callback) {
      var cmdStrC;
      if (state == null) {
        state = this;
      }
      if (ref_args == null) {
        ref_args = {};
      }
      if (cmdStr.split != null) {
        cmdStrC = cmdStr.split(';;');
        if (cmdStrC.length > 1) {
          cmdStr = cmdStrC;
        }
      }
      this.execStackCounter = 0;
      return this.exec_(cmdStr, ref_args, state, callback);
    };

    ATPOutputView.prototype.exec_ = function(cmdStr, ref_args, state, callback) {
      var args, cmd, com, command, e, ref_args_str, ret, val, _i, _len;
      if (callback == null) {
        callback = function() {
          return null;
        };
      }
      ++this.execStackCounter;
      if (cmdStr instanceof Array) {
        ret = '';
        for (_i = 0, _len = cmdStr.length; _i < _len; _i++) {
          com = cmdStr[_i];
          val = this.exec(com, ref_args, state);
          if (val != null) {
            ret += val;
          }
        }
        --this.execStackCounter;
        if (this.execStackCounter === 0) {
          callback();
        }
        if (ret == null) {
          return null;
        }
        return ret;
      } else {
        cmdStr = this.util.replaceAll("\\\"", '&hquot;', cmdStr);
        cmdStr = this.util.replaceAll("&bs;\"", '&hquot;', cmdStr);
        cmdStr = this.util.replaceAll("\\\'", '&lquot;', cmdStr);
        cmdStr = this.util.replaceAll("&bs;\'", '&lquot;', cmdStr);
        ref_args_str = null;
        if (ref_args != null) {
          if (ref_args.join != null) {
            ref_args_str = ref_args.join(' ');
          }
        }
        cmdStr = this.parseExecToken__(cmdStr, ref_args, ref_args_str);
        args = [];
        cmd = cmdStr;
        cmd.replace(/("[^"]*"|'[^']*'|[^\s'"]+)/g, (function(_this) {
          return function(s) {
            if (s[0] !== '"' && s[0] !== "'") {
              s = s.replace(/~/g, _this.userHome);
            }
            s = _this.util.replaceAll('&hquot;', '"', s);
            s = _this.util.replaceAll('&lquot;', '\'', s);
            return args.push(s);
          };
        })(this));
        args = this.util.dir(args, this.getCwd());
        cmd = args.shift();
        command = null;
        if (this.isCommandEnabled(cmd)) {
          command = ATPCore.findUserCommand(cmd);
        }
        if (command != null) {
          if (state == null) {
            ret = null;
            throw 'The console functional (not native) command cannot be executed without caller information: \'' + cmd + '\'.';
          }
          if (command != null) {
            try {
              ret = command(state, args);
            } catch (_error) {
              e = _error;
              throw new Error("Error at executing terminal command: '" + cmd + "' ('" + cmdStr + "'): " + e.message);
            }
          }
          --this.execStackCounter;
          if (this.execStackCounter === 0) {
            callback();
          }
          if (ret == null) {
            return null;
          }
          return ret;
        } else {
          if (atom.config.get('atom-terminal-panel.enableExtendedCommands') || this.specsMode) {
            if (this.isCommandEnabled(cmd)) {
              command = this.getLocalCommand(cmd);
            }
          }
          if (command != null) {
            ret = command(state, args);
            --this.execStackCounter;
            if (this.execStackCounter === 0) {
              callback();
            }
            if (ret == null) {
              return null;
            }
            return ret;
          } else {
            cmdStr = this.util.replaceAll('&hquot;', '"', cmdStr);
            cmd = this.util.replaceAll('&hquot;', '"', cmd);
            cmdStr = this.util.replaceAll('&lquot;', '\'', cmdStr);
            cmd = this.util.replaceAll('&lquot;', '\'', cmd);
            this.spawn(cmdStr, cmd, args);
            --this.execStackCounter;
            if (this.execStackCounter === 0) {
              callback();
            }
            if (cmd == null) {
              return null;
            }
            return null;
          }
        }
      }
    };

    ATPOutputView.prototype.isCommandEnabled = function(name) {
      var disabledCommands;
      disabledCommands = atom.config.get('atom-terminal-panel.disabledExtendedCommands') || this.specsMode;
      if (disabledCommands == null) {
        return true;
      }
      if (__indexOf.call(disabledCommands, name) >= 0) {
        return false;
      }
      return true;
    };

    ATPOutputView.prototype.getLocalCommand = function(name) {
      var cmd_body, cmd_name, _ref3;
      _ref3 = this.localCommands;
      for (cmd_name in _ref3) {
        cmd_body = _ref3[cmd_name];
        if (cmd_name === name) {
          if (cmd_body.command != null) {
            return cmd_body.command;
          } else {
            return cmd_body;
          }
        }
      }
      return null;
    };

    ATPOutputView.prototype.getCommandsRegistry = function() {
      var cmd, cmd_, cmd_body, cmd_forbd, cmd_item, cmd_len, cmd_name, descr, global_vars, key, value, var_name, _i, _len, _ref3, _ref4, _ref5, _ref6;
      global_vars = ATPVariablesBuiltins.list;
      _ref3 = process.env;
      for (key in _ref3) {
        value = _ref3[key];
        global_vars['%(env.' + key + ')'] = "access native environment variable: " + key;
      }
      cmd = [];
      _ref4 = this.localCommands;
      for (cmd_name in _ref4) {
        cmd_body = _ref4[cmd_name];
        cmd.push({
          name: cmd_name,
          description: cmd_body.description,
          example: cmd_body.example,
          params: cmd_body.params,
          deprecated: cmd_body.deprecated,
          sourcefile: cmd_body.sourcefile,
          source: cmd_body.source || 'internal'
        });
      }
      _ref5 = ATPCore.getUserCommands();
      for (cmd_name in _ref5) {
        cmd_body = _ref5[cmd_name];
        cmd.push({
          name: cmd_name,
          description: cmd_body.description,
          example: cmd_body.example,
          params: cmd_body.params,
          deprecated: cmd_body.deprecated,
          sourcefile: cmd_body.sourcefile,
          source: 'external'
        });
      }
      for (var_name in global_vars) {
        descr = global_vars[var_name];
        cmd.push({
          name: var_name,
          description: descr,
          source: 'global-variable'
        });
      }
      cmd_ = [];
      cmd_len = cmd.length;
      cmd_forbd = (atom.config.get('atom-terminal-panel.disabledExtendedCommands')) || [];
      for (_i = 0, _len = cmd.length; _i < _len; _i++) {
        cmd_item = cmd[_i];
        if (_ref6 = cmd_item.name, __indexOf.call(cmd_forbd, _ref6) >= 0) {

        } else {
          cmd_.push(cmd_item);
        }
      }
      return cmd_;
    };

    ATPOutputView.prototype.getCommandsNames = function() {
      var cmd_names, cmds, deprecated, descr, descr_prefix, example, icon_style, item, name, params, sourcefile, _i, _len;
      cmds = this.getCommandsRegistry();
      cmd_names = [];
      for (_i = 0, _len = cmds.length; _i < _len; _i++) {
        item = cmds[_i];
        descr = "";
        example = "";
        params = "";
        sourcefile = "";
        deprecated = false;
        name = item.name;
        if (item.sourcefile != null) {
          sourcefile = "<div style='float:bottom'><b style='float:right'>Plugin " + item.sourcefile + "&nbsp;&nbsp;&nbsp;<b></div>";
        }
        if (item.example != null) {
          example = "<br><b><u>Example:</u></b><br><code>" + item.example + "</code>";
        }
        if (item.params != null) {
          params = item.params;
        }
        if (item.deprecated) {
          deprecated = true;
        }
        icon_style = '';
        descr_prefix = '';
        if (item.source === 'external') {
          icon_style = 'book';
          descr_prefix = 'External: ';
        } else if (item.source === 'internal') {
          icon_style = 'repo';
          descr_prefix = 'Builtin: ';
        } else if (item.source === 'internal-atom') {
          icon_style = 'repo';
          descr_prefix = 'Atom command: ';
        } else if (item.source === 'external-functional') {
          icon_style = 'plus';
          descr_prefix = 'Functional: ';
        } else if (item.source === 'global-variable') {
          icon_style = 'briefcase';
          descr_prefix = 'Global variable: ';
        }
        if (deprecated) {
          name = "<strike style='color:gray;font-weight:normal;'>" + name + "</strike>";
        }
        descr = "<div style='float:left; padding-top:10px;' class='status status-" + icon_style + " icon icon-" + icon_style + "'></div><div style='padding-left: 10px;'><b>" + name + " " + params + "</b><br>" + item.description + " " + example + " " + sourcefile + "</div>";
        cmd_names.push({
          name: item.name,
          description: descr,
          html: true
        });
      }
      return cmd_names;
    };

    ATPOutputView.prototype.getLocalCommandsMemdump = function() {
      var cmd, commandFinder, commandFinderPanel;
      cmd = this.getCommandsRegistry();
      commandFinder = new ATPCommandFinderView(cmd);
      commandFinderPanel = atom.workspace.addModalPanel({
        item: commandFinder
      });
      commandFinder.shown(commandFinderPanel, this);
    };

    ATPOutputView.prototype.commandProgress = function(value) {
      if (value < 0) {
        this.cliProgressBar.hide();
        return this.cliProgressBar.attr('value', '0');
      } else {
        this.cliProgressBar.show();
        return this.cliProgressBar.attr('value', value / 2);
      }
    };

    ATPOutputView.prototype.showInitMessage = function(forceShow) {
      var changelog_path, hello_message, readme_path;
      if (forceShow == null) {
        forceShow = false;
      }
      if (!forceShow) {
        if (this.helloMessageShown) {
          return;
        }
      }
      if (atom.config.get('atom-terminal-panel.enableConsoleStartupInfo' || forceShow || (!this.specsMode))) {
        changelog_path = require("path").join(__dirname, "../CHANGELOG.md");
        readme_path = require("path").join(__dirname, "../README.md");
        hello_message = this.consolePanel('ATOM Terminal', 'Please enter new commands to the box below. (ctrl-to show suggestions dropdown)<br>The console supports special anotattion like: %(path), %(file), %(link)file.something%(endlink).<br>It also supports special HTML elements like: %(tooltip:A:content:B) and so on.<br>Hope you\'ll enjoy the terminal.' + ("<br><a class='changelog-link' href='" + changelog_path + "'>See changelog</a>&nbsp;&nbsp;<a class='readme-link' href='" + readme_path + "'>and the README! :)</a>"));
        this.rawMessage(hello_message);
        $('.changelog-link').css('font-weight', '300%').click((function(_this) {
          return function() {
            return atom.workspace.open(changelog_path);
          };
        })(this));
        $('.readme-link').css('font-weight', '300%').click((function(_this) {
          return function() {
            return atom.workspace.open(readme_path);
          };
        })(this));
        this.helloMessageShown = true;
      }
      return this;
    };

    ATPOutputView.prototype.onCommand = function(inputCmd) {
      var ret;
      this.fsSpy();
      if (inputCmd == null) {
        inputCmd = this.readInputBox();
      }
      this.disposables.dispose('statusIconTooltips');
      this.disposables.add('statusIconTooltips', atom.tooltips.add(this.statusIcon, {
        title: 'Task: \"' + inputCmd + '\"',
        delay: 0,
        animation: false
      }));
      this.inputLine++;
      inputCmd = this.parseSpecialStringTemplate(inputCmd);
      if (this.echoOn) {
        console.log('echo-on');
      }
      ret = this.exec(inputCmd, null, this, (function(_this) {
        return function() {
          return setTimeout(function() {
            return _this.putInputBox();
          }, 750);
        };
      })(this));
      if (ret != null) {
        this.message(ret + '\n');
      }
      this.scrollToBottom();
      this.putInputBox();
      setTimeout((function(_this) {
        return function() {
          return _this.putInputBox();
        };
      })(this), 750);
      return null;
    };

    ATPOutputView.prototype.initialize = function() {
      var cmd;
      this.userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      cmd = 'test -e /etc/profile && source /etc/profile;test -e ~/.profile && source ~/.profile; node -pe "JSON.stringify(process.env)"';
      exec(cmd, function(code, stdout, stderr) {
        var e;
        try {
          return process.env = JSON.parse(stdout);
        } catch (_error) {
          e = _error;
        }
      });
      return atom.commands.add('atom-workspace', {
        "atp-status:toggle-output": (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
    };

    ATPOutputView.prototype.clear = function() {
      this.cliOutput.empty();
      this.message('\n');
      return this.putInputBox();
    };

    ATPOutputView.prototype.adjustWindowHeight = function() {
      var maxHeight;
      maxHeight = atom.config.get('atom-terminal-panel.WindowHeight');
      this.cliOutput.css("max-height", "" + maxHeight + "px");
      return $('.terminal-input').css("max-height", "" + maxHeight + "px");
    };

    ATPOutputView.prototype.showCmd = function() {
      this.focusInputBox();
      return this.scrollToBottom();
    };

    ATPOutputView.prototype.scrollToBottom = function() {
      return this.cliOutput.scrollTop(10000000);
    };

    ATPOutputView.prototype.flashIconClass = function(className, time) {
      var onStatusOut;
      if (time == null) {
        time = 100;
      }
      this.statusIcon.addClass(className);
      this.timer && clearTimeout(this.timer);
      onStatusOut = (function(_this) {
        return function() {
          return _this.statusIcon.removeClass(className);
        };
      })(this);
      return this.timer = setTimeout(onStatusOut, time);
    };

    ATPOutputView.prototype.destroy = function() {
      var _destroy;
      this.statusIcon.remove();
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

    ATPOutputView.prototype.terminateProcessTree = function() {
      var killProcess, pid, psTree;
      pid = this.program.pid;
      psTree = require('ps-tree');
      killProcess = (function(_this) {
        return function(pid, signal, callback) {
          var ex, killTree;
          signal = signal || 'SIGKILL';
          callback = callback || function() {
            return {};
          };
          killTree = true;
          if (killTree) {
            return psTree(pid, function(err, children) {
              [pid].concat(children.map(function(p) {
                return p.PID;
              })).forEach(function(tpid) {
                var ex;
                try {
                  return process.kill(tpid, signal);
                } catch (_error) {
                  ex = _error;
                }
              });
              return callback();
            });
          } else {
            try {
              process.kill(pid, signal);
            } catch (_error) {
              ex = _error;
            }
            return callback();
          }
        };
      })(this);
      return killProcess(pid, 'SIGINT');
    };

    ATPOutputView.prototype.kill = function() {
      if (this.program) {
        this.terminateProcessTree(this.program.pid);
        this.program.stdin.pause();
        this.program.kill('SIGINT');
        this.program.kill();
        return this.message((this.consoleLabel('info', 'info')) + (this.consoleText('info', 'Process has been stopped')));
      }
    };

    ATPOutputView.prototype.maximize = function() {
      return this.cliOutput.height(this.cliOutput.height() + 9999);
    };

    ATPOutputView.prototype.open = function() {
      if ((atom.config.get('atom-terminal-panel.moveToCurrentDirOnOpen')) && (!this.specsMode)) {
        this.moveToCurrentDirectory();
      }
      if ((atom.config.get('atom-terminal-panel.moveToCurrentDirOnOpenLS')) && (!this.specsMode)) {
        this.clear();
        this.execDelayedCommand(this._cmdintdel, 'ls', null, this);
      }
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
      this.focusInputBox();
      this.showInitMessage();
      this.putInputBox();
      atom.tooltips.add(this.killBtn, {
        title: 'Kill the long working process.'
      });
      atom.tooltips.add(this.exitBtn, {
        title: 'Destroy the terminal session.'
      });
      atom.tooltips.add(this.closeBtn, {
        title: 'Hide the terminal window.'
      });
      atom.tooltips.add(this.openConfigBtn, {
        title: 'Open the terminal config file.'
      });
      atom.tooltips.add(this.reloadConfigBtn, {
        title: 'Reload the terminal configuration.'
      });
      if (atom.config.get('atom-terminal-panel.enableWindowAnimations')) {
        this.WindowMinHeight = this.cliOutput.height() + 50;
        this.height(0);
        this.consoleToolbarHeading.css({
          opacity: 0
        });
        return this.animate({
          height: this.WindowMinHeight
        }, 250, (function(_this) {
          return function() {
            _this.attr('style', '');
            return _this.consoleToolbarHeading.animate({
              opacity: 1
            }, 250, function() {
              return _this.consoleToolbarHeading.attr('style', '');
            });
          };
        })(this));
      }
    };

    ATPOutputView.prototype.close = function() {
      if (atom.config.get('atom-terminal-panel.enableWindowAnimations')) {
        this.WindowMinHeight = this.cliOutput.height() + 50;
        this.height(this.WindowMinHeight);
        return this.animate({
          height: 0
        }, 250, (function(_this) {
          return function() {
            _this.attr('style', '');
            _this.consoleToolbar.attr('style', '');
            _this.detach();
            return lastOpenedView = null;
          };
        })(this));
      } else {
        this.detach();
        return lastOpenedView = null;
      }
    };

    ATPOutputView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    ATPOutputView.prototype.removeQuotes = function(text) {
      var ret, t, _i, _len;
      if (text == null) {
        return '';
      }
      if (text instanceof Array) {
        ret = [];
        for (_i = 0, _len = text.length; _i < _len; _i++) {
          t = text[_i];
          ret.push(this.removeQuotes(t));
        }
        return ret;
      }
      return text.replace(/['"]+/g, '');
    };

    ATPOutputView.prototype.cd = function(args) {
      var dir, e, stat;
      if (!args[0]) {
        args = [atom.project.path];
      }
      args = this.removeQuotes(args);
      dir = resolve(this.getCwd(), args[0]);
      try {
        stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
          return this.errorMessage("cd: not a directory: " + args[0]);
        }
        this.cwd = dir;
        this.putInputBox();
      } catch (_error) {
        e = _error;
        return this.errorMessage("cd: " + args[0] + ": No such file or directory");
      }
      return null;
    };

    ATPOutputView.prototype.ls = function(args) {
      var e, files, filesBlocks, ret;
      try {
        files = fs.readdirSync(this.getCwd());
      } catch (_error) {
        e = _error;
        return false;
      }
      if (atom.config.get('atom-terminal-panel.XExperimentEnableForceLinking')) {
        ret = '';
        files.forEach((function(_this) {
          return function(filename) {
            return ret += _this.resolvePath(filename + '\t%(break)');
          };
        })(this));
        this.message(ret);
        return true;
      }
      filesBlocks = [];
      files.forEach((function(_this) {
        return function(filename) {
          return filesBlocks.push(_this._fileInfoHtml(filename, _this.getCwd()));
        };
      })(this));
      filesBlocks = filesBlocks.sort(function(a, b) {
        var aDir, bDir;
        aDir = false;
        bDir = false;
        if (a[1] != null) {
          aDir = a[1].isDirectory();
        }
        if (b[1] != null) {
          bDir = b[1].isDirectory();
        }
        if (aDir && !bDir) {
          return -1;
        }
        if (!aDir && bDir) {
          return 1;
        }
        return a[2] > b[2] && 1 || -1;
      });
      filesBlocks.unshift(this._fileInfoHtml('..', this.getCwd()));
      filesBlocks = filesBlocks.map(function(b) {
        return b[0];
      });
      this.message(filesBlocks.join('%(break)') + '<div class="clear"/>');
      return true;
    };

    ATPOutputView.prototype.parseSpecialNodes = function() {
      var caller;
      caller = this;
      if (atom.config.get('atom-terminal-panel.enableConsoleInteractiveHints')) {
        $('.atp-tooltip[data-toggle="tooltip"]').each(function() {
          var title;
          title = $(this).attr('title');
          return atom.tooltips.add($(this), {});
        });
      }
      if (atom.config.get('atom-terminal-panel.enableConsoleInteractiveLinks')) {
        return this.find('.console-link').each((function() {
          var el, link_target, link_target_column, link_target_line, link_target_name, link_type;
          el = $(this);
          link_target = el.data('target');
          if (link_target !== null && link_target !== void 0) {
            el.data('target', null);
            link_type = el.data('targettype');
            link_target_name = el.data('targetname');
            link_target_line = el.data('line');
            link_target_column = el.data('column');
            if (link_target_line == null) {
              link_target_line = 0;
            }
            if (link_target_column == null) {
              link_target_column = 0;
            }
            return el.click(function() {
              var moveToDir;
              el.addClass('link-used');
              if (link_type === 'file') {
                atom.workspace.open(link_target, {
                  initialLine: link_target_line,
                  initialColumn: link_target_column
                });
              }
              if (link_type === 'directory') {
                moveToDir = function(directory, messageDisp) {
                  if (messageDisp == null) {
                    messageDisp = false;
                  }
                  caller.clear();
                  caller.cd([directory]);
                  return setTimeout(function() {
                    if (!caller.ls()) {
                      if (!messageDisp) {
                        caller.errorMessage('The directory is inaccesible.\n');
                        messageDisp = true;
                        return setTimeout(function() {
                          return moveToDir('..', messageDisp);
                        }, 1500);
                      }
                    }
                  }, caller._cmdintdel);
                };
                return setTimeout(function() {
                  return moveToDir(link_target_name);
                }, caller._cmdintdel);
              }
            });
          }
        }));
      }
    };

    ATPOutputView.prototype.consoleAlert = function(text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong> ' + text + '</div>';
    };

    ATPOutputView.prototype.consolePanel = function(title, content) {
      return '<div class="panel panel-info welcome-panel"><div class="panel-heading">' + title + '</div><div class="panel-body">' + content + '</div></div><br><br>';
    };

    ATPOutputView.prototype.consoleText = function(type, text) {
      if (type === 'info') {
        return '<span class="text-info" style="margin-left:10px;">' + text + '</span>';
      }
      if (type === 'error') {
        return '<span class="text-error" style="margin-left:10px;">' + text + '</span>';
      }
      if (type === 'warning') {
        return '<span class="text-warning" style="margin-left:10px;">' + text + '</span>';
      }
      if (type === 'success') {
        return '<span class="text-success" style="margin-left:10px;">' + text + '</span>';
      }
      return text;
    };

    ATPOutputView.prototype.consoleLabel = function(type, text) {
      if ((!atom.config.get('atom-terminal-panel.enableConsoleLabels')) && (!this.specsMode)) {
        return text;
      }
      if (text == null) {
        text = type;
      }
      if (type === 'badge') {
        return '<span class="badge">' + text + '</span>';
      }
      if (type === 'default') {
        return '<span class="inline-block highlight">' + text + '</span>';
      }
      if (type === 'primary') {
        return '<span class="label label-primary">' + text + '</span>';
      }
      if (type === 'success') {
        return '<span class="inline-block highlight-success">' + text + '</span>';
      }
      if (type === 'info') {
        return '<span class="inline-block highlight-info">' + text + '</span>';
      }
      if (type === 'warning') {
        return '<span class="inline-block highlight-warning">' + text + '</span>';
      }
      if (type === 'danger') {
        return '<span class="inline-block highlight-error">' + text + '</span>';
      }
      if (type === 'error') {
        return '<span class="inline-block highlight-error">' + text + '</span>';
      }
      return '<span class="label label-default">' + text + '</span>';
    };

    ATPOutputView.prototype.consoleLink = function(name, forced) {
      if (forced == null) {
        forced = true;
      }
      if ((atom.config.get('atom-terminal-panel.XExperimentEnableForceLinking')) && (!forced)) {
        return name;
      }
      return this._fileInfoHtml(name, this.getCwd(), 'font', false)[0];
    };

    ATPOutputView.prototype._fileInfoHtml = function(filename, parent, wrapper_class, use_file_info_class) {
      var classes, dataname, e, exattrs, extension, file_exists, filecolumn, fileline, filepath, filepath_tooltip, href, matcher, name_tokens, stat, str, target_type;
      if (wrapper_class == null) {
        wrapper_class = 'span';
      }
      if (use_file_info_class == null) {
        use_file_info_class = 'true';
      }
      str = filename;
      name_tokens = filename;
      filename = filename.replace(/:[0-9]+:[0-9]/ig, '');
      name_tokens = this.util.replaceAll(filename, '', name_tokens);
      name_tokens = name_tokens.split(':');
      fileline = name_tokens[0];
      filecolumn = name_tokens[1];
      filename = this.util.replaceAll('/', '\\', filename);
      filename = this.util.replaceAll(parent, '', filename);
      filename = this.util.replaceAll(this.util.replaceAll('/', '\\', parent), '', filename);
      if (filename[0] === '\\' || filename[0] === '/') {
        filename = filename.substring(1);
      }
      if (filename === '..') {
        if (use_file_info_class) {
          return ["<font class=\"file-extension\"><" + wrapper_class + " data-targetname=\"" + filename + "\" data-targettype=\"directory\" data-target=\"" + filename + "\" class=\"console-link icon-file-directory parent-folder\">" + filename + "</" + wrapper_class + "></font>", null, filename];
        } else {
          return ["<font class=\"file-extension\"><" + wrapper_class + " data-targetname=\"" + filename + "\" data-targettype=\"directory\" data-target=\"" + filename + "\" class=\"console-link icon-file-directory file-info parent-folder\">" + filename + "</" + wrapper_class + "></font>", null, filename];
        }
      }
      file_exists = true;
      filepath = this.resolvePath(filename);
      classes = [];
      dataname = '';
      if (atom.config.get('atom-terminal-panel.useAtomIcons')) {
        classes.push('name');
        classes.push('icon');
        classes.push('icon-file-text');
        dataname = filepath;
      } else {
        classes.push('name');
      }
      if (use_file_info_class) {
        classes.push('file-info');
      }
      stat = null;
      if (file_exists) {
        try {
          stat = fs.lstatSync(filepath);
        } catch (_error) {
          e = _error;
          file_exists = false;
        }
      }
      if (file_exists) {
        if (atom.config.get('atom-terminal-panel.enableConsoleInteractiveLinks') || this.specsMode) {
          classes.push('console-link');
        }
        if (stat.isSymbolicLink()) {
          classes.push('stat-link');
          stat = fs.statSync(filepath);
          target_type = 'null';
        }
        if (stat.isFile()) {
          if (stat.mode & 73) {
            classes.push('stat-program');
          }
          matcher = /(.:)((.*)\\)*((.*\.)*)/ig;
          extension = filepath.replace(matcher, "");
          classes.push(this.util.replaceAll(' ', '', extension));
          classes.push('icon-file-text');
          target_type = 'file';
        }
        if (stat.isDirectory()) {
          classes.push('icon-file-directory');
          target_type = 'directory';
        }
        if (stat.isCharacterDevice()) {
          classes.push('stat-char-dev');
          target_type = 'device';
        }
        if (stat.isFIFO()) {
          classes.push('stat-fifo');
          target_type = 'fifo';
        }
        if (stat.isSocket()) {
          classes.push('stat-sock');
          target_type = 'sock';
        }
      } else {
        classes.push('file-not-found');
        classes.push('icon-file-text');
        target_type = 'file';
      }
      if (filename[0] === '.') {
        classes.push('status-ignored');
        target_type = 'ignored';
      }
      href = 'file:///' + this.util.replaceAll('\\', '/', filepath);
      classes.push('atp-tooltip');
      exattrs = [];
      if (fileline != null) {
        exattrs.push('data-line="' + fileline + '"');
      }
      if (filecolumn != null) {
        exattrs.push('data-column="' + filecolumn + '"');
      }
      filepath_tooltip = this.util.replaceAll('\\', '/', filepath);
      filepath = this.util.replaceAll('\\', '/', filepath);
      return ["<font class=\"file-extension\"><" + wrapper_class + " " + (exattrs.join(' ')) + " tooltip=\"\" data-targetname=\"" + filename + "\" data-targettype=\"" + target_type + "\" data-target=\"" + filepath + "\" data-name=\"" + dataname + "\" class=\"" + (classes.join(' ')) + "\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"" + filepath_tooltip + "\" >" + filename + "</" + wrapper_class + "></font>", stat, filename];
    };

    ATPOutputView.prototype.getGitStatusName = function(path, gitRoot, repo) {
      var status;
      status = (repo.getCachedPathStatus || repo.getPathStatus)(path);
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

    ATPOutputView.prototype.preserveOriginalPaths = function(text) {
      text = this.util.replaceAll(this.getCurrentFilePath(), '%(file-original)', text);
      text = this.util.replaceAll(this.getCwd(), '%(cwd-original)', text);
      text = this.util.replaceAll(this.getCwd(), '%(cwd-original)', text);
      text = this.util.replaceAll('/', '&fs;', text);
      text = this.util.replaceAll('\\', '&bs;', text);
      return text;
    };

    ATPOutputView.prototype.parseMessage = function(message, matchSpec, parseCustomRules) {
      var instance, n;
      if (matchSpec == null) {
        matchSpec = true;
      }
      if (parseCustomRules == null) {
        parseCustomRules = true;
      }
      instance = this;
      message = '<div>' + (instance.parseMessage_(message, false, true, true)) + '</div>';
      n = $(message);
      n.contents().filter(function() {
        return this.nodeType === 3;
      }).each(function() {
        var out, thiz;
        thiz = $(this);
        out = thiz.text();
        out = instance.parseMessage_(out, matchSpec, parseCustomRules);
        return thiz.replaceWith('<span>' + out + '</span>');
      });
      return n.html();
    };

    ATPOutputView.prototype.parseMessage_ = function(message, matchSpec, parseCustomRules, isForcelyPreparsering) {
      var cwdE, cwdN, flags, forceParse, i, key, matchAllLine, matchExp, matchNextLines, path, regex, regex2, regexString, replExp, rules, value, _i;
      if (matchSpec == null) {
        matchSpec = true;
      }
      if (parseCustomRules == null) {
        parseCustomRules = true;
      }
      if (isForcelyPreparsering == null) {
        isForcelyPreparsering = false;
      }
      if (message === null) {
        return '';
      }
      if (matchSpec) {
        if (atom.config.get('atom-terminal-panel.XExperimentEnableForceLinking')) {
          if (atom.config.get('atom-terminal-panel.textReplacementFileAdress') != null) {
            if (atom.config.get('atom-terminal-panel.textReplacementFileAdress') !== '') {
              regex = /(\.(\\|\/))?(([A-Za-z]:)(\\|\/))?(([^\s#@$%&!;<>\.\^:]| )+(\\|\/))((([^\s#@$%&!;<>\.\^:]| )+(\\|\/))*([^\s<>:#@$%\^;]| )+(\.([^\s#@$%&!;<>\.0-9:\^]| )*)*)?/ig;
              regex2 = /(\.(\\|\/))((([^\s#@$%&!;<>\.\^:]| )+(\\|\/))*([^\s<>:#@$%\^;]| )+(\.([^\s#@$%&!;<>\.0-9:\^]| )*)*)?/ig;
              message = message.replace(regex, (function(_this) {
                return function(match, text, urlId) {
                  return _this.parseSpecialStringTemplate(atom.config.get('atom-terminal-panel.textReplacementFileAdress'), {
                    file: match
                  });
                };
              })(this));
              message = message.replace(regex2, (function(_this) {
                return function(match, text, urlId) {
                  return _this.parseSpecialStringTemplate(atom.config.get('atom-terminal-panel.textReplacementFileAdress'), {
                    file: match
                  });
                };
              })(this));
            }
          }
        } else {
          if (atom.config.get('atom-terminal-panel.textReplacementFileAdress') != null) {
            if (atom.config.get('atom-terminal-panel.textReplacementFileAdress') !== '') {
              cwdN = this.getCwd();
              cwdE = this.util.replaceAll('/', '\\', this.getCwd());
              regexString = '(' + (this.util.escapeRegExp(cwdN)) + '|' + (this.util.escapeRegExp(cwdE)) + ')\\\\([^\\s:#$%^&!:]| )+\\.?([^\\s:#$@%&\\*\\^!0-9:\\.+\\-,\\\\\\/\"]| )*';
              regex = new RegExp(regexString, 'ig');
              message = message.replace(regex, (function(_this) {
                return function(match, text, urlId) {
                  return _this.parseSpecialStringTemplate(atom.config.get('atom-terminal-panel.textReplacementFileAdress'), {
                    file: match
                  });
                };
              })(this));
            }
          }
        }
        if (atom.config.get('atom-terminal-panel.textReplacementCurrentFile') != null) {
          if (atom.config.get('atom-terminal-panel.textReplacementCurrentFile') !== '') {
            path = this.getCurrentFilePath();
            regex = new RegExp(this.util.escapeRegExp(path), 'g');
            message = message.replace(regex, (function(_this) {
              return function(match, text, urlId) {
                return _this.parseSpecialStringTemplate(atom.config.get('atom-terminal-panel.textReplacementCurrentFile'), {
                  file: match
                });
              };
            })(this));
          }
        }
        message = this.preserveOriginalPaths(message);
        if (atom.config.get('atom-terminal-panel.textReplacementCurrentPath') != null) {
          if (atom.config.get('atom-terminal-panel.textReplacementCurrentPath') !== '') {
            path = this.getCwd();
            regex = new RegExp(this.util.escapeRegExp(path), 'g');
            message = message.replace(regex, (function(_this) {
              return function(match, text, urlId) {
                return _this.parseSpecialStringTemplate(atom.config.get('atom-terminal-panel.textReplacementCurrentPath'), {
                  file: match
                });
              };
            })(this));
          }
        }
      }
      message = this.util.replaceAll('%(file-original)', this.getCurrentFilePath(), message);
      message = this.util.replaceAll('%(cwd-original)', this.getCwd(), message);
      message = this.util.replaceAll('&fs;', '/', message);
      message = this.util.replaceAll('&bs;', '\\', message);
      rules = ATPCore.getConfig().rules;
      for (key in rules) {
        value = rules[key];
        matchExp = key;
        replExp = '%(content)';
        matchAllLine = false;
        matchNextLines = 0;
        flags = 'gm';
        forceParse = false;
        if (value.match != null) {
          if (value.match.flags != null) {
            flags = value.match.flags.join('');
          }
          if (value.match.replace != null) {
            replExp = value.match.replace;
          }
          if (value.match.matchLine != null) {
            matchAllLine = value.match.matchLine;
          }
          if (value.match.matchNextLines != null) {
            matchNextLines = value.match.matchNextLines;
          }
          if (value.match.forced != null) {
            forceParse = value.match.forced;
          }
        }
        if ((forceParse || parseCustomRules) && ((isForcelyPreparsering && forceParse) || (!isForcelyPreparsering))) {
          if (matchAllLine) {
            matchExp = '.*' + matchExp;
          }
          if (matchNextLines > 0) {
            for (i = _i = 0; _i <= matchNextLines; i = _i += 1) {
              matchExp = matchExp + '[\\r\\n].*';
            }
          }
          regex = new RegExp(matchExp, flags);
          message = message.replace(regex, (function(_this) {
            return function() {
              var groups, groupsNumber, match, repl, style, vars, _j;
              match = arguments[0], groups = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
              style = '';
              if (value.css != null) {
                style = ATPCore.jsonCssToInlineStyle(value.css);
              } else if (value.match == null) {
                style = ATPCore.jsonCssToInlineStyle(value);
              }
              vars = {
                content: match,
                0: match
              };
              groupsNumber = groups.length - 1;
              for (i = _j = 0; _j <= groupsNumber; i = _j += 1) {
                if (groups[i] != null) {
                  vars[i + 1] = groups[i];
                }
              }
              repl = _this.parseSpecialStringTemplate(replExp, vars);
              return "<font style=\"" + style + "\">" + repl + "</font>";
            };
          })(this));
        }
      }
      message = this.util.replaceAll('%(file-original)', this.getCurrentFilePath(), message);
      message = this.util.replaceAll('%(cwd-original)', this.getCwd(), message);
      message = this.util.replaceAll('&fs;', '/', message);
      message = this.util.replaceAll('&bs;', '\\', message);
      return message;
    };

    ATPOutputView.prototype.redirect = function(streamName) {
      return this.redirectOutput = streamName;
    };

    ATPOutputView.prototype.rawMessage = function(message) {
      if (this.redirectOutput === 'console') {
        console.log(message);
        return;
      }
      this.cliOutput.append(message);
      this.showCmd();
      this.statusIcon.removeClass('status-error');
      return this.statusIcon.addClass('status-success');
    };

    ATPOutputView.prototype.message = function(message, matchSpec) {
      var m, mes, _i, _len;
      if (matchSpec == null) {
        matchSpec = true;
      }
      if (this.redirectOutput === 'console') {
        console.log(message);
        return;
      }
      if (typeof message === 'object') {
        mes = message;
      } else {
        if (message == null) {
          return;
        }
        mes = message.split('%(break)');
        if (mes.length > 1) {
          for (_i = 0, _len = mes.length; _i < _len; _i++) {
            m = mes[_i];
            this.message(m);
          }
          return;
        } else {
          mes = mes[0];
        }
        mes = this.parseMessage(message, matchSpec, matchSpec);
        mes = this.util.replaceAll('%(raw)', '', mes);
        mes = this.parseTemplate(mes, [], true);
      }
      this.cliOutput.append(mes);
      this.showCmd();
      this.statusIcon.removeClass('status-error');
      this.statusIcon.addClass('status-success');
      this.parseSpecialNodes();
      return this.scrollToBottom();
    };

    ATPOutputView.prototype.errorMessage = function(message) {
      this.cliOutput.append(this.parseMessage(message));
      this.showCmd();
      this.statusIcon.removeClass('status-success');
      this.statusIcon.addClass('status-error');
      return this.parseSpecialNodes();
    };

    ATPOutputView.prototype.correctFilePath = function(path) {
      return this.util.replaceAll('\\', '/', path);
    };

    ATPOutputView.prototype.getCwd = function() {
      var cwd, extFile, projectDir;
      if (atom.project == null) {
        return null;
      }
      extFile = extname(atom.project.path);
      if (extFile === "") {
        if (atom.project.path) {
          projectDir = atom.project.path;
        } else {
          if (process.env.HOME) {
            projectDir = process.env.HOME;
          } else if (process.env.USERPROFILE) {
            projectDir = process.env.USERPROFILE;
          } else {
            projectDir = '/';
          }
        }
      } else {
        projectDir = dirname(atom.project.path);
      }
      cwd = this.cwd || projectDir || this.userHome;
      return this.correctFilePath(cwd);
    };

    ATPOutputView.prototype.spawn = function(inputCmd, cmd, args) {
      var dataCallback, err, htmlStream, instance;
      this.spawnProcessActive = true;
      instance = this;
      dataCallback = function(data) {
        instance.message(data);
        return instance.scrollToBottom();
      };
      htmlStream = ansihtml();
      htmlStream.on('data', (function(_this) {
        return function(data) {
          return setTimeout(function() {
            return dataCallback(data);
          }, 100);
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
        this.statusIcon.removeClass('status-success');
        this.statusIcon.removeClass('status-error');
        this.statusIcon.addClass('status-running');
        this.killBtn.removeClass('hide');
        this.program.once('exit', (function(_this) {
          return function(code) {
            if (atom.config.get('atom-terminal-panel.logConsole') || _this.specsMode) {
              console.log('exit', code);
            }
            _this.killBtn.addClass('hide');
            _this.statusIcon.removeClass('status-running');
            _this.program = null;
            _this.statusIcon.addClass(code === 0 && 'status-success' || 'status-error');
            _this.showCmd();
            return _this.spawnProcessActive = false;
          };
        })(this));
        this.program.on('error', (function(_this) {
          return function(err) {
            if (atom.config.get('atom-terminal-panel.logConsole') || _this.specsMode) {
              console.log('error');
            }
            _this.message(err.message);
            _this.showCmd();
            return _this.statusIcon.addClass('status-error');
          };
        })(this));
        this.program.stdout.on('data', (function(_this) {
          return function() {
            _this.flashIconClass('status-info');
            return _this.statusIcon.removeClass('status-error');
          };
        })(this));
        return this.program.stderr.on('data', (function(_this) {
          return function() {
            if (atom.config.get('atom-terminal-panel.logConsole') || _this.specsMode) {
              console.log('stderr');
            }
            return _this.flashIconClass('status-error', 300);
          };
        })(this));
      } catch (_error) {
        err = _error;
        this.message(err.message);
        return this.showCmd();
      }
    };

    return ATPOutputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSw0T0FBQTtJQUFBOzs7O3NCQUFBOztBQUFBLEVBUUEsY0FBQSxHQUFpQixJQVJqQixDQUFBOztBQUFBLEVBVUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBVkwsQ0FBQTs7QUFBQSxFQVdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVhMLENBQUE7O0FBQUEsRUFZQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxzQkFBQSxjQUFKLEVBQW9CLFlBQUEsSUFacEIsQ0FBQTs7QUFBQSxFQWFBLFFBQTBCLE9BQUEsQ0FBUSxlQUFSLENBQTFCLEVBQUMsY0FBQSxLQUFELEVBQVEsYUFBQSxJQUFSLEVBQWMsaUJBQUEsUUFiZCxDQUFBOztBQUFBLEVBY0EsUUFBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQyxnQkFBQSxPQUFELEVBQVUsZ0JBQUEsT0FBVixFQUFtQixnQkFBQSxPQUFuQixFQUE0QixZQUFBLEdBZDVCLENBQUE7O0FBQUEsRUFnQkEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQWhCWCxDQUFBOztBQUFBLEVBaUJBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQWpCVCxDQUFBOztBQUFBLEVBa0JBLEtBQUEsR0FBUSxPQUFBLENBQVEsWUFBUixDQWxCUixDQUFBOztBQUFBLEVBb0JBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSxvQkFBUixDQXBCdkIsQ0FBQTs7QUFBQSxFQXFCQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-view.coffee
