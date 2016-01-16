(function() {
  var Config, Emitter, Task, Termrk, TermrkModel, TermrkView, Utils, pty, _, _ref;

  _ = require('underscore-plus');

  pty = require('pty.js');

  _ref = require('atom'), Task = _ref.Task, Emitter = _ref.Emitter;

  Termrk = require('./termrk');

  TermrkView = require('./termrk-view');

  Config = require('./config');

  Utils = require('./utils');

  module.exports = TermrkModel = (function() {

    /*
    Section: Events
     */
    TermrkModel.prototype.onDidExitProcess = function(callback) {
      return this.emitter.on('exit', callback);
    };

    TermrkModel.prototype.onDidStartProcess = function(callback) {
      return this.emitter.on('start', callback);
    };

    TermrkModel.prototype.onDidReceiveData = function(callback) {
      return this.emitter.on('data', callback);
    };


    /*
    Section: instance
     */

    TermrkModel.prototype.pty = null;

    TermrkModel.prototype.emitter = null;

    TermrkModel.prototype.options = null;

    function TermrkModel(options) {
      this.options = options != null ? options : {};
      this.emitter = new Emitter;
      this.spawnProcess();
    }

    TermrkModel.prototype.spawnProcess = function(shell, options) {
      var error, _base, _base1, _base2, _base3, _base4;
      if (this.pty != null) {
        return;
      }
      if (this.options == null) {
        this.options = {};
      }
      if (shell != null) {
        this.options.shell = shell;
      }
      _.extend(this.options, options);
      if ((_base = this.options).shell == null) {
        _base.shell = Config.getDefaultShell();
      }
      if ((_base1 = this.options).cwd == null) {
        _base1.cwd = Config.getStartingDir();
      }
      if ((_base2 = this.options).cols == null) {
        _base2.cols = 200;
      }
      if ((_base3 = this.options).rows == null) {
        _base3.rows = 24;
      }
      if ((_base4 = this.options).parameters == null) {
        _base4.parameters = Config.getDefaultParameters();
      }
      try {
        this.pty = Task.once(require.resolve('./pty-task'), this.options.shell, this.options.parameters, this.options);
      } catch (_error) {
        error = _error;
        error.message += "\n" + (JSON.stringify(this.options));
        throw error;
      }
      this.pty.on('data', (function(_this) {
        return function(data) {
          return _this.emitter.emit('data', data);
        };
      })(this));
      this.pty.on('exit', (function(_this) {
        return function(code, signal) {
          delete _this.pty;
          return _this.emitter.emit('exit', {
            code: code,
            signal: signal
          });
        };
      })(this));
      return this.emitter.emit('start', this.options.shell);
    };


    /*
    Section: commands
     */

    TermrkModel.prototype.write = function(data) {
      var _ref1;
      return (_ref1 = this.pty) != null ? _ref1.send({
        event: 'input',
        text: data
      }) : void 0;
    };

    TermrkModel.prototype.resize = function(cols, rows) {
      var _ref1;
      return (_ref1 = this.pty) != null ? _ref1.send({
        event: 'resize',
        cols: cols,
        rows: rows
      }) : void 0;
    };


    /*
    Section: get/set/utils
     */

    TermrkModel.prototype.getProcess = function() {
      return this.pty;
    };

    TermrkModel.prototype.getPID = function() {
      return this.pty.pid;
    };

    TermrkModel.prototype.kill = function() {
      var _ref1;
      return (_ref1 = this.pty) != null ? _ref1.kill() : void 0;
    };

    TermrkModel.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.pty) != null ? _ref1.destroy() : void 0;
    };

    TermrkModel.prototype.getView = function() {
      return this.view;
    };

    TermrkModel.prototype.setView = function(view) {
      return this.view = view;
    };

    return TermrkModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybXJrL2xpYi90ZXJtcmstbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDJFQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FETixDQUFBOztBQUFBLEVBR0EsT0FBa0IsT0FBQSxDQUFRLE1BQVIsQ0FBbEIsRUFBQyxZQUFBLElBQUQsRUFBTyxlQUFBLE9BSFAsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FOYixDQUFBOztBQUFBLEVBUUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBUlQsQ0FBQTs7QUFBQSxFQVNBLEtBQUEsR0FBUyxPQUFBLENBQVEsU0FBUixDQVRULENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUY7QUFBQTs7T0FBQTtBQUFBLDBCQUlBLGdCQUFBLEdBQWtCLFNBQUMsUUFBRCxHQUFBO2FBQ2QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksTUFBWixFQUFvQixRQUFwQixFQURjO0lBQUEsQ0FKbEIsQ0FBQTs7QUFBQSwwQkFPQSxpQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTthQUNmLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsUUFBckIsRUFEZTtJQUFBLENBUG5CLENBQUE7O0FBQUEsMEJBVUEsZ0JBQUEsR0FBa0IsU0FBQyxRQUFELEdBQUE7YUFDZCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxN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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/termrk/lib/termrk-model.coffee
