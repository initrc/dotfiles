(function() {
  var CliStatusView;

  CliStatusView = require('./cli-status-view');

  module.exports = {
    cliStatusView: null,
    activate: function(state) {
      var createStatusEntry;
      createStatusEntry = (function(_this) {
        return function() {
          return _this.cliStatusView = new CliStatusView(state.cliStatusViewState);
        };
      })(this);
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return createStatusEntry();
        };
      })(this));
    },
    deactivate: function() {
      return this.cliStatusView.destroy();
    },
    config: {
      WindowHeight: {
        type: 'integer',
        "default": 300
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtc3RhdHVzL2xpYi9jbGktc3RhdHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLGFBQUEsRUFBZSxJQUFmO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDTixVQUFBLGlCQUFBO0FBQUEsTUFBQSxpQkFBQSxHQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoQixLQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLGFBQUEsQ0FBYyxLQUFLLENBQUMsa0JBQXBCLEVBREw7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQUFBO2FBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBZCxDQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLGlCQUFBLENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDLEVBSE07SUFBQSxDQUZWO0FBQUEsSUFPQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEUTtJQUFBLENBUFo7QUFBQSxJQVVBLE1BQUEsRUFDSTtBQUFBLE1BQUEsWUFBQSxFQUNJO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEdBRFQ7T0FESjtLQVhKO0dBSEosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-status/lib/cli-status.coffee
