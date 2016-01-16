
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  Class containing all builtin variables.
 */

(function() {
  var $, BuiltinVariables, dirname, extname, os, resolve, _ref;

  $ = include('atom-space-pen-views').$;

  _ref = include('path'), resolve = _ref.resolve, dirname = _ref.dirname, extname = _ref.extname;

  os = include('os');

  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        return o.handler();
      }
    }
  };

  BuiltinVariables = (function() {
    function BuiltinVariables() {}

    BuiltinVariables.prototype.list = {
      "%(project.root)": "first currently opened project directory",
      "%(project:INDEX)": "n-th currently opened project directory",
      "%(project.count)": "number of currently opened projects",
      "%(atom)": "atom directory.",
      "%(path)": "current working directory",
      "%(file)": "currenly opened file in the editor",
      "%(editor.path)": "path of the file currently opened in the editor",
      "%(editor.file)": "full path of the file currently opened in the editor",
      "%(editor.name)": "name of the file currently opened in the editor",
      "%(cwd)": "current working directory",
      "%(hostname)": "computer name",
      "%(computer-name)": "computer name",
      "%(username)": "currently logged in user",
      "%(user)": "currently logged in user",
      "%(home)": "home directory of the user",
      "%(osname)": "name of the operating system",
      "%(os)": "name of the operating system",
      "%(env.*)": "list of all available native environment variables",
      "%(.day)": "current date: day number (without leading zeros)",
      "%(.month)": "current date: month number (without leading zeros)",
      "%(.year)": "current date: year (without leading zeros)",
      "%(.hours)": "current date: hour 24-format (without leading zeros)",
      "%(.hours12)": "current date: hour 12-format (without leading zeros)",
      "%(.minutes)": "current date: minutes (without leading zeros)",
      "%(.seconds)": "current date: seconds (without leading zeros)",
      "%(.milis)": "current date: miliseconds (without leading zeros)",
      "%(day)": "current date: day number",
      "%(month)": "current date: month number",
      "%(year)": "current date: year",
      "%(hours)": "current date: hour 24-format",
      "%(hours12)": "current date: hour 12-format",
      "%(minutes)": "current date: minutes",
      "%(seconds)": "current date: seconds",
      "%(milis)": "current date: miliseconds",
      "%(ampm)": "displays am/pm (12-hour format)",
      "%(AMPM)": "displays AM/PM (12-hour format)",
      "%(line)": "input line number",
      "%(disc)": "current working directory disc name",
      "%(label:TYPE:TEXT": "(styling-annotation) creates a label of the specified type",
      "%(tooltip:TEXT:content:CONTENT)": "(styling-annotation) creates a tooltip message",
      "%(link)": "(styling-annotation) starts the file link - see %(endlink)",
      "%(endlink)": "(styling-annotation) ends the file link - see %(link)",
      "%(^)": "(styling-annotation) ends text formatting",
      "%(^COLOR)": "(styling-annotation) creates coloured text",
      "%(^b)": "(styling-annotation) creates bolded text",
      "%(^bold)": "(styling-annotation) creates bolded text",
      "%(^i)": "(styling-annotation) creates italics text",
      "%(^italics)": "(styling-annotation) creates italics text",
      "%(^u)": "(styling-annotation) creates underline text",
      "%(^underline)": "(styling-annotation) creates underline text",
      "%(^l)": "(styling-annotation) creates a line through the text",
      "%(^line-trough)": "(styling-annotation) creates a line through the text",
      "%(path:INDEX)": "refers to the %(path) components",
      "%(*)": "(only user-defined commands) refers to the all passed parameters",
      "%(*^)": "(only user-defined commands) refers to the full command string",
      "%(INDEX)": "(only user-defined commands) refers to the passed parameters",
      "%(raw)": "Makes the entire expression evaluated only when printing to output (delayed-evaluation)",
      "%(dynamic)": "Indicates that the expression should be dynamically updated."
    };

    BuiltinVariables.prototype.customVariables = [];

    BuiltinVariables.prototype.putVariable = function(entry) {
      this.customVariables.push(entry);
      return this.list['%(' + entry.name + ')'] = entry.description || "";
    };

    BuiltinVariables.prototype.removeAnnotation = function(consoleInstance, prompt) {
      return prompt.replace(/%\((?!cwd-original\))(?!file-original\))([^\(\)]*)\)/img, (function(_this) {
        return function(match, text, urlId) {
          return '';
        };
      })(this));
    };

    BuiltinVariables.prototype.parseHtml = function(consoleInstance, prompt, values, startRefreshTask) {
      var o;
      if (startRefreshTask == null) {
        startRefreshTask = true;
      }
      o = this.parseFull(consoleInstance, prompt, values, startRefreshTask);
      if (o.modif != null) {
        o.modif((function(_this) {
          return function(i) {
            i = consoleInstance.util.replaceAll('%(file-original)', consoleInstance.getCurrentFilePath(), i);
            i = consoleInstance.util.replaceAll('%(cwd-original)', consoleInstance.getCwd(), i);
            i = consoleInstance.util.replaceAll('&fs;', '/', i);
            i = consoleInstance.util.replaceAll('&bs;', '\\', i);
            return i;
          };
        })(this));
      }
      if (o.getHtml != null) {
        return o.getHtml();
      }
      return o;
    };

    BuiltinVariables.prototype.parse = function(consoleInstance, prompt, values) {
      var o;
      o = this.parseFull(consoleInstance, prompt, values);
      if (o.getText != null) {
        return o.getText();
      }
      return o;
    };

    BuiltinVariables.prototype.parseFull = function(consoleInstance, prompt, values, startRefreshTask) {
      var ampm, ampmC, atomPath, breadcrumbIdFwd, breadcrumbIdRwd, cmd, day, disc, dynamicExpressionUpdateDelay, entry, file, homelocation, hours, hours12, i, isDynamicExpression, key, m, milis, minutes, month, o, orig, osname, panelPath, pathBreadcrumbs, pathBreadcrumbsSize, preservedPathsString, projectPaths, projectPathsCount, repl, seconds, text, today, username, value, year, _i, _j, _k, _len, _ref1;
      if (startRefreshTask == null) {
        startRefreshTask = true;
      }
      orig = prompt;
      text = '';
      isDynamicExpression = false;
      dynamicExpressionUpdateDelay = 100;
      if (consoleInstance == null) {
        return '';
      }
      if (prompt == null) {
        return '';
      }
      cmd = null;
      file = consoleInstance.getCurrentFilePath();
      if (values != null) {
        if (values.cmd != null) {
          cmd = values.cmd;
        }
        if (values.file != null) {
          file = values.file;
        }
      }
      if ((!atom.config.get('atom-terminal-panel.parseSpecialTemplateTokens')) && (!consoleInstance.specsMode)) {
        consoleInstance.preserveOriginalPaths(prompt.replace(/%\([^ ]*\)/ig, ''));
      }
      if (prompt.indexOf('%') === -1) {
        consoleInstance.preserveOriginalPaths(prompt);
      }
      prompt.replace(/%\(dynamic:?([0-9]+)?\)/ig, (function(_this) {
        return function(match, p1) {
          if (p1 != null) {
            dynamicExpressionUpdateDelay = parseInt(p1);
          }
          isDynamicExpression = true;
          return '';
        };
      })(this));
      for (key in values) {
        value = values[key];
        if (key !== 'cmd' && key !== 'file') {
          prompt = consoleInstance.util.replaceAll("%(" + key + ")", value, prompt);
        }
      }
      if (prompt.indexOf('%(raw)') === -1) {
        panelPath = atom.packages.resolvePackagePath('atom-terminal-panel');
        atomPath = resolve(panelPath + '/../..');
        prompt = consoleInstance.util.replaceAll('%(atom)', atomPath, prompt);
        prompt = consoleInstance.util.replaceAll('%(path)', consoleInstance.getCwd(), prompt);
        prompt = consoleInstance.util.replaceAll('%(file)', file, prompt);
        prompt = consoleInstance.util.replaceAll('%(editor.path)', consoleInstance.getCurrentFileLocation(), prompt);
        prompt = consoleInstance.util.replaceAll('%(editor.file)', consoleInstance.getCurrentFilePath(), prompt);
        prompt = consoleInstance.util.replaceAll('%(editor.name)', consoleInstance.getCurrentFileName(), prompt);
        prompt = consoleInstance.util.replaceAll('%(cwd)', consoleInstance.getCwd(), prompt);
        prompt = consoleInstance.util.replaceAll('%(hostname)', os.hostname(), prompt);
        prompt = consoleInstance.util.replaceAll('%(computer-name)', os.hostname(), prompt);
        username = process.env.USERNAME || process.env.LOGNAME || process.env.USER;
        prompt = consoleInstance.util.replaceAll('%(username)', username, prompt);
        prompt = consoleInstance.util.replaceAll('%(user)', username, prompt);
        homelocation = process.env.HOME || process.env.HOMEPATH || process.env.HOMEDIR;
        prompt = consoleInstance.util.replaceAll('%(home)', homelocation, prompt);
        osname = process.platform || process.env.OS;
        prompt = consoleInstance.util.replaceAll('%(osname)', osname, prompt);
        prompt = consoleInstance.util.replaceAll('%(os)', osname, prompt);
        prompt = prompt.replace(/%\(env\.[A-Za-z_\*]*\)/ig, (function(_this) {
          return function(match, text, urlId) {
            var nativeVarName, ret, _ref1;
            nativeVarName = match;
            nativeVarName = consoleInstance.util.replaceAll('%(env.', '', nativeVarName);
            nativeVarName = nativeVarName.substring(0, nativeVarName.length - 1);
            if (nativeVarName === '*') {
              ret = 'process.env {\n';
              _ref1 = process.env;
              for (key in _ref1) {
                value = _ref1[key];
                ret += '\t' + key + '\n';
              }
              ret += '}';
              return ret;
            }
            return process.env[nativeVarName];
          };
        })(this));
        if (cmd != null) {
          prompt = consoleInstance.util.replaceAll('%(command)', cmd, prompt);
        }
        today = new Date();
        day = today.getDate();
        month = today.getMonth() + 1;
        year = today.getFullYear();
        minutes = today.getMinutes();
        hours = today.getHours();
        hours12 = today.getHours() % 12;
        milis = today.getMilliseconds();
        seconds = today.getSeconds();
        ampm = 'am';
        ampmC = 'AM';
        if (hours >= 12) {
          ampm = 'pm';
          ampmC = 'PM';
        }
        prompt = consoleInstance.util.replaceAll('%(.day)', day, prompt);
        prompt = consoleInstance.util.replaceAll('%(.month)', month, prompt);
        prompt = consoleInstance.util.replaceAll('%(.year)', year, prompt);
        prompt = consoleInstance.util.replaceAll('%(.hours)', hours, prompt);
        prompt = consoleInstance.util.replaceAll('%(.hours12)', hours12, prompt);
        prompt = consoleInstance.util.replaceAll('%(.minutes)', minutes, prompt);
        prompt = consoleInstance.util.replaceAll('%(.seconds)', seconds, prompt);
        prompt = consoleInstance.util.replaceAll('%(.milis)', milis, prompt);
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        if (day < 10) {
          day = '0' + day;
        }
        if (month < 10) {
          month = '0' + month;
        }
        if (milis < 10) {
          milis = '000' + milis;
        } else if (milis < 100) {
          milis = '00' + milis;
        } else if (milis < 1000) {
          milis = '0' + milis;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (hours >= 12) {
          ampm = 'pm';
        }
        if (hours < 10) {
          hours = '0' + hours;
        }
        if (hours12 < 10) {
          hours12 = '0' + hours12;
        }
        prompt = consoleInstance.util.replaceAll('%(day)', day, prompt);
        prompt = consoleInstance.util.replaceAll('%(month)', month, prompt);
        prompt = consoleInstance.util.replaceAll('%(year)', year, prompt);
        prompt = consoleInstance.util.replaceAll('%(hours)', hours, prompt);
        prompt = consoleInstance.util.replaceAll('%(hours12)', hours12, prompt);
        prompt = consoleInstance.util.replaceAll('%(ampm)', ampm, prompt);
        prompt = consoleInstance.util.replaceAll('%(AMPM)', ampmC, prompt);
        prompt = consoleInstance.util.replaceAll('%(minutes)', minutes, prompt);
        prompt = consoleInstance.util.replaceAll('%(seconds)', seconds, prompt);
        prompt = consoleInstance.util.replaceAll('%(milis)', milis, prompt);
        prompt = consoleInstance.util.replaceAll('%(line)', consoleInstance.inputLine + 1, prompt);
        projectPaths = atom.project.getPaths();
        projectPathsCount = projectPaths.length - 1;
        prompt = consoleInstance.util.replaceAll('%(project.root)', projectPaths[0], prompt);
        prompt = consoleInstance.util.replaceAll('%(project.count)', projectPaths.length, prompt);
        for (i = _i = 0; _i <= projectPathsCount; i = _i += 1) {
          breadcrumbIdFwd = i - projectPathsCount - 1;
          breadcrumbIdRwd = i;
          prompt = consoleInstance.util.replaceAll("%(project:" + breadcrumbIdFwd + ")", projectPaths[i], prompt);
          prompt = consoleInstance.util.replaceAll("%(project:" + breadcrumbIdRwd + ")", projectPaths[i], prompt);
        }
        pathBreadcrumbs = consoleInstance.getCwd().split(/\\|\//ig);
        pathBreadcrumbs[0] = pathBreadcrumbs[0].charAt(0).toUpperCase() + pathBreadcrumbs[0].slice(1);
        disc = consoleInstance.util.replaceAll(':', '', pathBreadcrumbs[0]);
        prompt = consoleInstance.util.replaceAll('%(disc)', disc, prompt);
        pathBreadcrumbsSize = pathBreadcrumbs.length - 1;
        for (i = _j = 0; _j <= pathBreadcrumbsSize; i = _j += 1) {
          breadcrumbIdFwd = i - pathBreadcrumbsSize - 1;
          breadcrumbIdRwd = i;
          prompt = consoleInstance.util.replaceAll("%(path:" + breadcrumbIdFwd + ")", pathBreadcrumbs[i], prompt);
          prompt = consoleInstance.util.replaceAll("%(path:" + breadcrumbIdRwd + ")", pathBreadcrumbs[i], prompt);
        }
        prompt = prompt.replace(/%\(tooltip:[^\n\t\[\]{}%\)\(]*\)/ig, (function(_this) {
          return function(match, text, urlId) {
            var content, target, target_tokens;
            target = consoleInstance.util.replaceAll('%(tooltip:', '', match);
            target = target.substring(0, target.length - 1);
            target_tokens = target.split(':content:');
            target = target_tokens[0];
            content = target_tokens[1];
            return "<font data-toggle=\"tooltip\" data-placement=\"top\" title=\"" + target + "\">" + content + "</font>";
          };
        })(this));
        if (prompt.indexOf('%(link:') !== -1) {
          throw 'Error:\nUsage of %(link:) is deprecated.\nUse %(link)target%(endlink) notation\ninstead of %(link:target)!\nAt: [' + prompt + ']';
        }
        prompt = prompt.replace(/%\(link\)[^%]*%\(endlink\)/ig, (function(_this) {
          return function(match, text, urlId) {
            var ret, target;
            target = match;
            target = consoleInstance.util.replaceAll('%(link)', '', target);
            target = consoleInstance.util.replaceAll('%(endlink)', '', target);
            ret = consoleInstance.consoleLink(target, true);
            return ret;
          };
        })(this));
        prompt = prompt.replace(/%\(\^[^\s\(\)]*\)/ig, (function(_this) {
          return function(match, text, urlId) {
            var target;
            target = consoleInstance.util.replaceAll('%(^', '', match);
            target = target.substring(0, target.length - 1);
            if (target === '') {
              return '</font>';
            } else if (target.charAt(0) === '#') {
              return "<font style=\"color:" + target + ";\">";
            } else if (target === 'b' || target === 'bold') {
              return "<font style=\"font-weight:bold;\">";
            } else if (target === 'u' || target === 'underline') {
              return "<font style=\"text-decoration:underline;\">";
            } else if (target === 'i' || target === 'italic') {
              return "<font style=\"font-style:italic;\">";
            } else if (target === 'l' || target === 'line-through') {
              return "<font style=\"text-decoration:line-through;\">";
            }
            return '';
          };
        })(this));
        if ((atom.config.get('atom-terminal-panel.enableConsoleLabels')) || consoleInstance.specsMode) {
          prompt = prompt.replace(/%\(label:[^\n\t\[\]{}%\)\(]*\)/ig, (function(_this) {
            return function(match, text, urlId) {
              var content, target, target_tokens;
              target = consoleInstance.util.replaceAll('%(label:', '', match);
              target = target.substring(0, target.length - 1);
              target_tokens = target.split(':text:');
              target = target_tokens[0];
              content = target_tokens[1];
              return consoleInstance.consoleLabel(target, content);
            };
          })(this));
        } else {
          prompt = prompt.replace(/%\(label:[^\n\t\[\]{}%\)\(]*\)/ig, (function(_this) {
            return function(match, text, urlId) {
              var content, target, target_tokens;
              target = consoleInstance.util.replaceAll('%(label:', '', match);
              target = target.substring(0, target.length - 1);
              target_tokens = target.split(':text:');
              target = target_tokens[0];
              content = target_tokens[1];
              return content;
            };
          })(this));
        }
        _ref1 = this.customVariables;
        for (_k = 0, _len = _ref1.length; _k < _len; _k++) {
          entry = _ref1[_k];
          if (prompt.indexOf('%(' + entry.name + ')') > -1) {
            repl = entry.variable(consoleInstance);
            if (repl != null) {
              prompt = consoleInstance.util.replaceAll('%(' + entry.name + ')', repl, prompt);
            }
          }
        }
        preservedPathsString = consoleInstance.preserveOriginalPaths(prompt);
        text = this.removeAnnotation(consoleInstance, preservedPathsString);
      } else {
        text = prompt;
      }
      o = {
        enclosedVarInstance: null,
        text: text,
        isDynamicExpression: isDynamicExpression,
        dynamicExpressionUpdateDelay: dynamicExpressionUpdateDelay,
        orig: orig,
        textModifiers: [],
        modif: function(modifier) {
          this.textModifiers.push(modifier);
          return this;
        },
        runTextModifiers: function(input) {
          var _l, _ref2;
          for (i = _l = 0, _ref2 = this.textModifiers.length - 1; _l <= _ref2; i = _l += 1) {
            input = this.textModifiers[i](input) || input;
          }
          return input;
        },
        getText: function() {
          return this.runTextModifiers(this.text);
        },
        getHtml: function() {
          var htmlObj, refresh, refreshTask, taskRunning;
          htmlObj = $('<span>' + this.runTextModifiers(this.text) + '</span>');
          taskRunning = false;
          if (window.taskWorkingThreadsNumber == null) {
            window.taskWorkingThreadsNumber = 0;
          }
          refresh = (function(_this) {
            return function() {
              var t;
              t = _this.enclosedVarInstance.parseHtml(consoleInstance, _this.orig, values, false);
              htmlObj.html('');
              return htmlObj.append(t);
            };
          })(this);
          refreshTask = (function(_this) {
            return function() {
              if (_this.dynamicExpressionUpdateDelay <= 0 || !taskRunning) {
                --window.taskWorkingThreadsNumber;
                return;
              }
              return setTimeout(function() {
                refresh();
                return refreshTask();
              }, _this.dynamicExpressionUpdateDelay);
            };
          })(this);
          if (startRefreshTask && this.isDynamicExpression) {
            taskRunning = true;
            htmlObj.bind('destroyed', function() {
              return taskRunning = false;
            });
            ++window.taskWorkingThreadsNumber;
            refreshTask();
          }
          return htmlObj;
        }
      };
      m = function(i) {
        i = consoleInstance.util.replaceAll('%(file-original)', consoleInstance.getCurrentFilePath(), i);
        i = consoleInstance.util.replaceAll('%(cwd-original)', consoleInstance.getCwd(), i);
        i = consoleInstance.util.replaceAll('&fs;', '/', i);
        i = consoleInstance.util.replaceAll('&bs;', '\\', i);
        return i;
      };
      o.modif(m);
      o.enclosedVarInstance = this;
      return o;
    };

    return BuiltinVariables;

  })();

  module.exports = new BuiltinVariables();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLWJ1aWx0aW5zLXZhcmlhYmxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOzs7Ozs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLHdEQUFBOztBQUFBLEVBUUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQVJELENBQUE7O0FBQUEsRUFTQSxPQUE4QixPQUFBLENBQVEsTUFBUixDQUE5QixFQUFDLGVBQUEsT0FBRCxFQUFVLGVBQUEsT0FBVixFQUFtQixlQUFBLE9BVG5CLENBQUE7O0FBQUEsRUFVQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FWTCxDQUFBOztBQUFBLEVBWUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBaEIsR0FBNEI7QUFBQSxJQUMxQixNQUFBLEVBQVEsU0FBQyxDQUFELEdBQUE7QUFDTixNQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUw7ZUFDRSxDQUFDLENBQUMsT0FBRixDQUFBLEVBREY7T0FETTtJQUFBLENBRGtCO0dBWjVCLENBQUE7O0FBQUEsRUFrQk07a0NBQ0o7O0FBQUEsK0JBQUEsSUFBQSxHQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUFvQiwwQ0FBcEI7QUFBQSxNQUNBLGtCQUFBLEVBQXFCLHlDQURyQjtBQUFBLE1BRUEsa0JBQUEsRUFBcUIscUNBRnJCO0FBQUEsTUFHQSxTQUFBLEVBQVksaUJBSFo7QUFBQSxNQUlBLFNBQUEsRUFBWSwyQkFKWjtBQUFBLE1BS0EsU0FBQSxFQUFZLG9DQUxaO0FBQUEsTUFNQSxnQkFBQSxFQUFtQixpREFObkI7QUFBQSxNQU9BLGdCQUFBLEVBQW1CLHNEQVBuQjtBQUFBLE1BUUEsZ0JBQUEsRUFBbUIsaURB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-builtins-variables.coffee
