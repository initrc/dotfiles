(function() {
  var CompositeDisposable, TermrkConfig, Utils, name;

  CompositeDisposable = require('atom').CompositeDisposable;

  Utils = require('./utils');

  TermrkConfig = (function() {
    TermrkConfig.prototype.prefix = null;

    TermrkConfig.prototype.schema = {
      'shellCommand': {
        title: 'Shell',
        description: 'Command to call to start the shell. ' + '(auto-detect or executable file)',
        type: 'string',
        "default": 'auto-detect'
      },
      'startingDir': {
        title: 'Start dir',
        description: 'Dir where the shell should be started.' + '\n*cwd* means current file\'s directory',
        type: 'string',
        "default": 'project',
        "enum": ['home', 'project', 'cwd']
      },
      'shellParameters': {
        title: 'Shell Parameters',
        description: 'The parameters to pass through when creating the shell',
        type: 'string',
        "default": ''
      },
      'restartShell': {
        title: 'Auto-restart',
        description: 'Restarts the shell as soon as it is terminated.',
        type: 'boolean',
        "default": 'true'
      },
      'useDefaultKeymap': {
        title: 'Default keymap',
        description: 'Use keymap provided by Termrk package.\n' + 'Do not forget to add your own bindings if ' + 'you disable this.',
        type: 'boolean',
        "default": 'true'
      },
      'userCommandsFile': {
        title: 'User commands file',
        description: 'File where your commands are stored.\n' + '(absolute or relative to ' + atom.getConfigDirPath() + ')',
        type: 'string',
        "default": 'userCommands.cson'
      },
      'defaultHeight': {
        title: 'Panel height',
        description: 'Height of the terminal-panel (in px)',
        type: 'integer',
        "default": 300
      },
      'fontSize': {
        title: 'Font size',
        description: 'Size of the font in terminal',
        type: 'string',
        "default": '14px'
      },
      'fontFamily': {
        title: 'Font family',
        type: 'string',
        "default": 'Monospace'
      }
    };

    function TermrkConfig(packageName) {
      var descriptor, getKey, key, setKey, value, _ref;
      this.prefix = packageName + '.';
      _ref = this.schema;
      for (key in _ref) {
        value = _ref[key];
        getKey = this.get.bind(this, key);
        setKey = this.set.bind(this, key);
        descriptor = {
          get: getKey,
          set: setKey
        };
        Object.defineProperty(this, key, descriptor);
      }
    }

    TermrkConfig.prototype.get = function(k) {
      return atom.config.get(this.prefix + k);
    };

    TermrkConfig.prototype.set = function(k, v) {
      return atom.config.set(this.prefix + k, v);
    };

    TermrkConfig.prototype.observe = function(key, callback) {
      var disposable, fn, k, _results;
      if (typeof key === 'object') {
        disposable = new CompositeDisposable;
        _results = [];
        for (k in key) {
          fn = key[k];
          _results.push(disposable.add(atom.config.onDidChange(this.prefix + k, fn)));
        }
        return _results;
      } else {
        return atom.config.onDidChange(this.prefix + key, callback);
      }
    };

    TermrkConfig.prototype.getDefaultShell = function() {
      var shell, _ref, _ref1;
      shell = this.get('shellCommand');
      if (shell !== 'auto-detect') {
        return shell;
      }
      if (process.env.SHELL != null) {
        return process.env.SHELL;
      } else if (/win/.test(process.platform)) {
        return (_ref = (_ref1 = process.env.TERM) != null ? _ref1 : process.env.COMSPEC) != null ? _ref : 'cmd.exe';
      } else {
        return 'sh';
      }
    };

    TermrkConfig.prototype.getStartingDir = function() {
      switch (this.get('startingDir')) {
        case 'home':
          return Utils.getHomeDir();
        case 'project':
          return Utils.getProjectDir();
        case 'cwd':
          return Utils.getCurrentDir();
        default:
          return process.cwd();
      }
    };

    TermrkConfig.prototype.getDefaultParameters = function() {
      var parameters;
      parameters = this.get('shellParameters');
      return parameters.split(/\s+/g).filter(function(arg) {
        return arg;
      });
    };

    return TermrkConfig;

  })();

  if (atom.packages.getLoadedPackage('termrk') != null) {
    name = 'termrk';
  } else {
    name = 'Termrk';
  }

  module.exports = new TermrkConfig(name);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybXJrL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDhDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSU07QUFFRiwyQkFBQSxNQUFBLEdBQVEsSUFBUixDQUFBOztBQUFBLDJCQUVBLE1BQUEsR0FFSTtBQUFBLE1BQUEsY0FBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQWEsT0FBYjtBQUFBLFFBQ0EsV0FBQSxFQUFhLHNDQUFBLEdBQ0Esa0NBRmI7QUFBQSxRQUdBLElBQUEsRUFBYSxRQUhiO0FBQUEsUUFJQSxTQUFBLEVBQWEsYUFKYjtPQURKO0FBQUEsTUFNQSxhQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBYSxXQUFiO0FBQUEsUUFDQSxXQUFBLEVBQWEsd0NBQUEsR0FDQSx5Q0FGYjtBQUFBLFFBR0EsSUFBQSxFQUFhLFFBSGI7QUFBQSxRQUlBLFNBQUEsRUFBYSxTQUpiO0FBQUEsUUFLQSxNQUFBLEVBQWEsQ0FBQyxNQUFELEVBQVMsU0FBVCxFQUFvQixLQUFwQixDQUxiO09BUEo7QUFBQSxNQWFBLGlCQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxrQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7T0FkSjtBQUFBLE1Ba0JBLGNBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxpREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxNQUhUO09BbkJKO0FBQUEsTUF5QkEsa0JBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFhLGdCQUFiO0FBQUEsUUFDQSxXQUFBLEVBQWEsMENBQUEsR0FDQSw0Q0FEQSxHQUVBLG1CQUhiO0FBQUEsUUFJQSxJQUFBLEVBQWEsU0FKYjtBQUFBLFFBS0EsU0FBQSxFQUFhLE1BTGI7T0ExQko7QUFBQSxNQWdDQSxrQkFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx3Q0FBQSxHQUNBLDJCQURBLEdBRUEsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FGQSxHQUUwQixHQUh2QztBQUFBLFFBSUEsSUFBQSxFQUFNLFFBSk47QUFBQSxRQUtBLFNBQUEsRUFBUyxtQkFMVDtPQWpDSjtBQUFBLE1BMENBLGVBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFhLGNBQWI7QUFBQSxRQUNBLFdBQUEsRUFBYSxzQ0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFhLFNBRmI7QUFBQSxRQUdBLFNBQUEsRUFBYSxHQUhiO09BM0NKO0FBQUEsTUErQ0EsVUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQWEsV0FBYjtBQUFBLFFBQ0EsV0FBQSxFQUFhLDhCQURiO0FBQUEsUUFFQSxJQUFBLEVBQWEsUUFGYjtBQUFBLFFBR0EsU0FBQSxFQUFhLE1BSGI7T0FoREo7QUFBQSxNQW9EQSxZQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBYSxhQUFiO0FBQUEsUUFDQSxJQUFBLEVBQWEsUUFEYjtBQUFBLFFBRUEsU0FBQSxFQUFhLFdBRmI7T0FyREo7S0FKSixDQUFBOztBQThEYSxJQUFBLHNCQUFDLFdBQUQsR0FBQTtBQUNULFVBQUEsNENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsV0FBQSxHQUFjLEdBQXhCLENBQUE7QUFFQTtBQUFBLFdBQUEsV0FBQTswQkFBQTtBQUNJLFFBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBYSxHQUFiLENBQVQsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBYSxHQUFiLENBRFQsQ0FBQTtBQUFBLFFBRUEsVUFBQSxHQUNJO0FBQUEsVUFBQSxHQUFBLEVBQUssTUFBTDtBQUFBLFVBQ0EsR0FBQSxFQUFLLE1BREw7U0FISixDQUFBO0FBQUEsUUFLQSxNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixHQUE1QixFQUFpQyxVQUFqQyxDQUxBLENBREo7QUFBQSxPQUhTO0lBQUEsQ0E5RGI7O0FBQUEsMkJBeUVBLEdBQUEsR0FBSyxTQUFDLENBQUQsR0FBQTtBQUNELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBM0IsQ0FBUCxDQURDO0lBQUEsQ0F6RUwsQ0FBQTs7QUFBQSwyQkE0RUEsR0FBQSxHQUFLLFNBQUMsQ0FBRCxFQUFJLENBQUosR0FBQTtBQUNELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBM0IsRUFBK0IsQ0FBL0IsQ0FBUCxDQURDO0lBQUEsQ0E1RUwsQ0FBQTs7QUFBQSwyQkFxRkEsT0FBQSxHQUFTLFNBQUMsR0FBRCxFQUFNLFFBQU4sR0FBQTtBQUNMLFVBQUEsMkJBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLEdBQUEsS0FBYyxRQUFqQjtBQUNJLFFBQUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxtQkFBYixDQUFBO0FBQ0E7YUFBQSxRQUFBO3NCQUFBO0FBQ0ksd0JBQUEsVUFBVSxDQUFDLEdBQVgsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLE1BQUQsR0FBUSxDQUFoQyxFQUFtQyxFQUFuQyxDQUFmLEVBQUEsQ0FESjtBQUFBO3dCQUZKO09BQUEsTUFBQTtlQUtJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsTUFBRCxHQUFRLEdBQWhDLEVBQXFDLFFBQXJDLEVBTEo7T0FESztJQUFBLENBckZULENBQUE7O0FBQUEsMkJBOEZBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2IsVUFBQSxrQkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxHQUFELENBQUssY0FBTCxDQUFSLENBQUE7QUFDQSxNQUFBLElBQU8sS0FBQSxLQUFTLGFBQWhCO0FBQ0ksZUFBTyxLQUFQLENBREo7T0FEQTtBQUlBLE1BQUEsSUFBRyx5QkFBSDtBQUNJLGVBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFuQixDQURKO09BQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBTyxDQUFDLFFBQW5CLENBQUg7QUFDRCwwR0FBZ0QsU0FBaEQsQ0FEQztPQUFBLE1BQUE7QUFHRCxlQUFPLElBQVAsQ0FIQztPQVBRO0lBQUEsQ0E5RmpCLENBQUE7O0FBQUEsMkJBMkdBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ1osY0FBTyxJQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsQ0FBUDtBQUFBLGFBQ1MsTUFEVDtpQkFDcUIsS0FBSyxDQUFDLFVBQU4sQ0FBQSxFQURyQjtBQUFBLGFBRVMsU0FGVDtpQkFFd0IsS0FBSyxDQUFDLGFBQU4sQ0FBQSxFQUZ4QjtBQUFBLGFBR1MsS0FIVDtpQkFHb0IsS0FBSyxDQUFDLGFBQU4sQ0FBQSxFQUhwQjtBQUFBO2lCQUlTLE9BQU8sQ0FBQyxHQUFSLENBQUEsRUFKVDtBQUFBLE9BRFk7SUFBQSxDQTNHaEIsQ0FBQTs7QUFBQSwyQkFrSEEsb0JBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxHQUFELENBQUssaUJBQUwsQ0FBYixDQUFBO0FBRUEsYUFBTyxVQUFVLENBQUMsS0FBWCxDQUFpQixNQUFqQixDQUF3QixDQUFDLE1BQXpCLENBQWdDLFNBQUMsR0FBRCxHQUFBO2VBQVEsSUFBUjtNQUFBLENBQWhDLENBQVAsQ0FIa0I7SUFBQSxDQWxIdEIsQ0FBQTs7d0JBQUE7O01BTkosQ0FBQTs7QUE2SEEsRUFBQSxJQUFHLGdEQUFIO0FBQ0ksSUFBQSxJQUFBLEdBQU8sUUFBUCxDQURKO0dBQUEsTUFBQTtBQUdJLElBQUEsSUFBQSxHQUFPLFFBQVAsQ0FISjtHQTdIQTs7QUFBQSxFQWtJQSxNQUFNLENBQUMsT0FBUCxHQUFxQixJQUFBLFlBQUEsQ0FBYSxJQUFiLENBbElyQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/termrk/lib/config.coffee
