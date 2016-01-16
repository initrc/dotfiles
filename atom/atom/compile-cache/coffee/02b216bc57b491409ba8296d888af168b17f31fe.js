(function() {
  var Dialog, InputDialog, os,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require("./dialog");

  os = require("os");

  module.exports = InputDialog = (function(_super) {
    __extends(InputDialog, _super);

    function InputDialog(terminalView) {
      this.terminalView = terminalView;
      InputDialog.__super__.constructor.call(this, {
        prompt: "Insert Text",
        iconClass: "icon-keyboard",
        stayOpen: true
      });
    }

    InputDialog.prototype.onConfirm = function(input) {
      var data, eol;
      if (atom.config.get('terminal-plus.toggles.runInsertedText')) {
        eol = os.EOL;
      } else {
        eol = '';
      }
      data = "" + input + eol;
      this.terminalView.input(data);
      return this.cancel();
    };

    return InputDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvaW5wdXQtZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBYSxJQUFBLHFCQUFFLFlBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGVBQUEsWUFDYixDQUFBO0FBQUEsTUFBQSw2Q0FDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxRQUNBLFNBQUEsRUFBVyxlQURYO0FBQUEsUUFFQSxRQUFBLEVBQVUsSUFGVjtPQURGLENBQUEsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBTUEsU0FBQSxHQUFXLFNBQUMsS0FBRCxHQUFBO0FBQ1QsVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsQ0FBSDtBQUNFLFFBQUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxHQUFULENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxHQUFBLEdBQU0sRUFBTixDQUhGO09BQUE7QUFBQSxNQUtBLElBQUEsR0FBTyxFQUFBLEdBQUcsS0FBSCxHQUFXLEdBTGxCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFvQixJQUFwQixDQU5BLENBQUE7YUFPQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBUlM7SUFBQSxDQU5YLENBQUE7O3VCQUFBOztLQUR3QixPQUoxQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/input-dialog.coffee
