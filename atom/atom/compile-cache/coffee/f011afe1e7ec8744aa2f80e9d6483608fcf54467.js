
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  This file contains basic, simple utilities used by coffeescript files.
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof global === "undefined" || global === null) {
    throw "apt-utils: No global node.js namespace present.";
  }

  global.include = function(name) {
    var e, e2, r;
    if (window.cliUtilsIncludeLog == null) {
      window.cliUtilsIncludeLog = [];
    }
    if (name == null) {
      setTimeout((function(_this) {
        return function() {
          return atom.notifications.addError("atom-terminal-panel: Dependency error. Module with null-value name cannot be required.");
        };
      })(this), 500);
      return;
    }
    if ((name.indexOf('atp-')) === 0) {
      name = './' + name;
    }
    r = null;
    try {
      r = require(name);
    } catch (_error) {
      e = _error;
      if (__indexOf.call(window.cliUtilsIncludeLog, name) >= 0) {
        return r;
      } else {
        window.cliUtilsIncludeLog.push(name);
      }
      try {
        setTimeout((function(_this) {
          return function() {
            return atom.notifications.addError("atom-terminal-panel: Dependency error. Module [" + name + "] cannot be required.");
          };
        })(this), 500);
      } catch (_error) {
        e2 = _error;
      }
      throw e;
      throw "Dependency error. Module [" + name + "] cannot be required.";
    }
    return r;
  };

  global.generateRandomID = function() {
    var chars, i, length, result, _i;
    length = 32;
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    result = '';
    for (i = _i = length; _i > 1; i = _i += -1) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLXV0aWxzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEscUpBQUE7O0FBUUEsRUFBQSxJQUFPLGdEQUFQO0FBQ0UsVUFBTSxpREFBTixDQURGO0dBUkE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsR0FBQTtBQUNmLFFBQUEsUUFBQTtBQUFBLElBQUEsSUFBTyxpQ0FBUDtBQUNFLE1BQUEsTUFBTSxDQUFDLGtCQUFQLEdBQTRCLEVBQTVCLENBREY7S0FBQTtBQUVBLElBQUEsSUFBTyxZQUFQO0FBQ0UsTUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLHdGQUE1QixFQURTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVFLEdBRkYsQ0FBQSxDQUFBO0FBR0EsWUFBQSxDQUpGO0tBRkE7QUFPQSxJQUFBLElBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsQ0FBRCxDQUFBLEtBQXlCLENBQTVCO0FBQ0UsTUFBQSxJQUFBLEdBQU8sSUFBQSxHQUFLLElBQVosQ0FERjtLQVBBO0FBQUEsSUFVQSxDQUFBLEdBQUksSUFWSixDQUFBO0FBV0E7QUFDRSxNQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsSUFBUixDQUFKLENBREY7S0FBQSxjQUFBO0FBR0UsTUFESSxVQUNKLENBQUE7QUFBQSxNQUFBLElBQUcsZUFBUSxNQUFNLENBQUMsa0JBQWYsRUFBQSxJQUFBLE1BQUg7QUFDRSxlQUFPLENBQVAsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUExQixDQUErQixJQUEvQixDQUFBLENBSEY7T0FBQTtBQUlBO0FBQ0UsUUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixpREFBQSxHQUFrRCxJQUFsRCxHQUF1RCx1QkFBbkYsRUFEUztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFFRSxHQUZGLENBQUEsQ0FERjtPQUFBLGNBQUE7QUFJTyxRQUFELFdBQUMsQ0FKUDtPQUpBO0FBU0EsWUFBTSxDQUFOLENBVEE7QUFVQSxZQUFNLDRCQUFBLEdBQTZCLElBQTdCLEdBQWtDLHVCQUF4QyxDQWJGO0tBWEE7QUF5QkEsV0FBTyxDQUFQLENBMUJlO0VBQUEsQ0FYakIsQ0FBQTs7QUFBQSxFQXdDQSxNQUFNLENBQUMsZ0JBQVAsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsNEJBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxnRUFEUixDQUFBO0FBQUEsSUFFQSxNQUFBLEdBQVMsRUFGVCxDQUFBO0FBR0EsU0FBUyxxQ0FBVCxHQUFBO0FBQ0UsTUFBQSxNQUFBLElBQVUsS0FBTSxDQUFBLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFoQixDQUEzQixDQUFBLENBQWhCLENBREY7QUFBQSxLQUhBO0FBS0EsV0FBTyxNQUFQLENBTndCO0VBQUEsQ0F4QzFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-utils.coffee
