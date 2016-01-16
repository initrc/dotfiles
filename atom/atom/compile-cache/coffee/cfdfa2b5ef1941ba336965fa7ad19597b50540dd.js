(function() {
  var pty;

  pty = require('pty.js');

  module.exports = function(ptyCwd, args, options) {
    var callback, ptyProcess;
    callback = this.async();
    ptyProcess = pty.fork(ptyCwd, args, options);
    ptyProcess.on('data', function(data) {
      return emit('data', data);
    });
    ptyProcess.on('exit', function(code, signal) {
      emit('exit', {
        code: code,
        signal: signal
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybXJrL2xpYi9wdHktdGFzay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsR0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsT0FBZixHQUFBO0FBQ2IsUUFBQSxvQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBWCxDQUFBO0FBQUEsSUFDQSxVQUFBLEdBQWEsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLE9BQXZCLENBRGIsQ0FBQTtBQUFBLElBR0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsSUFBRCxHQUFBO2FBQVUsSUFBQSxDQUFLLE1BQUwsRUFBYSxJQUFiLEVBQVY7SUFBQSxDQUF0QixDQUhBLENBQUE7QUFBQSxJQUlBLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDbEIsTUFBQSxJQUFBLENBQUssTUFBTCxFQUFhO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFFBQUEsTUFBUDtPQUFiLENBQUEsQ0FBQTthQUNBLFFBQUEsQ0FBQSxFQUZrQjtJQUFBLENBQXRCLENBSkEsQ0FBQTtXQVFBLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxFQUFzQixTQUFDLElBQUQsR0FBQTtBQUNsQixVQUFBLDZCQUFBO0FBQUEsNEJBRG1CLE9BQTBCLElBQXpCLGFBQUEsT0FBTyxZQUFBLE1BQU0sWUFBQSxNQUFNLFlBQUEsSUFDdkMsQ0FBQTtBQUFBLGNBQU8sS0FBUDtBQUFBLGFBQ1MsUUFEVDtpQkFDdUIsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFEdkI7QUFBQSxhQUVTLE9BRlQ7aUJBRXNCLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBRnRCO0FBQUEsT0FEa0I7SUFBQSxDQUF0QixFQVRhO0VBQUEsQ0FGakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/termrk/lib/pty-task.coffee
