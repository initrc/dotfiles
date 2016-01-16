(function() {
  var child, filteredEnvironment, fs, path, pty, systemLanguage, _;

  pty = require('pty.js');

  path = require('path');

  fs = require('fs');

  _ = require('underscore');

  child = require('child_process');

  systemLanguage = (function() {
    var command, language;
    language = "en_US.UTF-8";
    if (process.platform === 'darwin') {
      try {
        command = 'plutil -convert json -o - ~/Library/Preferences/.GlobalPreferences.plist';
        language = "" + (JSON.parse(child.execSync(command).toString()).AppleLocale) + ".UTF-8";
      } catch (_error) {}
    }
    return language;
  })();

  filteredEnvironment = (function() {
    var env;
    env = _.omit(process.env, 'ATOM_HOME', 'ATOM_SHELL_INTERNAL_RUN_AS_NODE', 'GOOGLE_API_KEY', 'NODE_ENV', 'NODE_PATH', 'userAgent', 'taskPath');
    if (env.LANG == null) {
      env.LANG = systemLanguage;
    }
    env.TERM_PROGRAM = 'Terminal-Plus';
    return env;
  })();

  module.exports = function(pwd, shell, args, options) {
    var callback, emitTitle, ptyProcess, title;
    if (options == null) {
      options = {};
    }
    callback = this.async();
    if (/zsh|bash/.test(shell) && args.indexOf('--login') === -1) {
      args.unshift('--login');
    }
    ptyProcess = pty.fork(shell, args, {
      cwd: pwd,
      env: filteredEnvironment,
      name: 'xterm-256color'
    });
    title = shell = path.basename(shell);
    emitTitle = _.throttle(function() {
      return emit('terminal-plus:title', ptyProcess.process);
    }, 500, true);
    ptyProcess.on('data', function(data) {
      emit('terminal-plus:data', data);
      return emitTitle();
    });
    ptyProcess.on('exit', function() {
      emit('terminal-plus:exit');
      return callback();
    });
    return process.on('message', function(_arg) {
      var cols, event, rows, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, cols = _ref.cols, rows = _ref.rows, text = _ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(text);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvcHJvY2Vzcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNERBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBSlIsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBb0IsQ0FBQSxTQUFBLEdBQUE7QUFDbEIsUUFBQSxpQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLGFBQVgsQ0FBQTtBQUNBLElBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixRQUF2QjtBQUNFO0FBQ0UsUUFBQSxPQUFBLEdBQVUsMEVBQVYsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxHQUFXLEVBQUEsR0FBRSxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBSyxDQUFDLFFBQU4sQ0FBZSxPQUFmLENBQXVCLENBQUMsUUFBeEIsQ0FBQSxDQUFYLENBQThDLENBQUMsV0FBaEQsQ0FBRixHQUE4RCxRQUR6RSxDQURGO09BQUEsa0JBREY7S0FEQTtBQUtBLFdBQU8sUUFBUCxDQU5rQjtFQUFBLENBQUEsQ0FBSCxDQUFBLENBTmpCLENBQUE7O0FBQUEsRUFjQSxtQkFBQSxHQUF5QixDQUFBLFNBQUEsR0FBQTtBQUN2QixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/process.coffee
