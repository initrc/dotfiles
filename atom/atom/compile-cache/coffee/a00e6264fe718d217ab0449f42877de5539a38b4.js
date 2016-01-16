(function() {
  var Dialog, RenameDialog,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require("./dialog");

  module.exports = RenameDialog = (function(_super) {
    __extends(RenameDialog, _super);

    function RenameDialog(statusIcon) {
      this.statusIcon = statusIcon;
      RenameDialog.__super__.constructor.call(this, {
        prompt: "Rename",
        iconClass: "icon-pencil",
        placeholderText: this.statusIcon.getName()
      });
    }

    RenameDialog.prototype.onConfirm = function(newTitle) {
      this.statusIcon.updateName(newTitle.trim());
      return this.cancel();
    };

    return RenameDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvcmVuYW1lLWRpYWxvZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBYSxJQUFBLHNCQUFFLFVBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFBQSw4Q0FDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLFFBQVI7QUFBQSxRQUNBLFNBQUEsRUFBVyxhQURYO0FBQUEsUUFFQSxlQUFBLEVBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBRmpCO09BREYsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSwyQkFNQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFBWixDQUF1QixRQUFRLENBQUMsSUFBVCxDQUFBLENBQXZCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGUztJQUFBLENBTlgsQ0FBQTs7d0JBQUE7O0tBRHlCLE9BSDNCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/rename-dialog.coffee
