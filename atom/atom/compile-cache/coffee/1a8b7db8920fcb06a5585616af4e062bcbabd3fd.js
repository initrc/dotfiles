(function() {
  var Dialog, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = Dialog = (function(_super) {
    __extends(Dialog, _super);

    function Dialog() {
      return Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.content = function(_arg) {
      var prompt;
      prompt = (_arg != null ? _arg : {}).prompt;
      return this.div({
        "class": 'terminal-plus-dialog'
      }, (function(_this) {
        return function() {
          _this.label(prompt, {
            "class": 'icon',
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.label('Escape (Esc) to exit', {
            style: 'float: left;'
          });
          return _this.label('Enter (\u21B5) to confirm', {
            style: 'float: right;'
          });
        };
      })(this));
    };

    Dialog.prototype.initialize = function(_arg) {
      var iconClass, placeholderText, stayOpen, _ref1;
      _ref1 = _arg != null ? _arg : {}, iconClass = _ref1.iconClass, placeholderText = _ref1.placeholderText, stayOpen = _ref1.stayOpen;
      if (iconClass) {
        this.promptText.addClass(iconClass);
      }
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.onConfirm(_this.miniEditor.getText());
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      if (!stayOpen) {
        this.miniEditor.on('blur', (function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
      }
      if (placeholderText) {
        this.miniEditor.getModel().setText(placeholderText);
        return this.miniEditor.getModel().selectAll();
      }
    };

    Dialog.prototype.attach = function() {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      return this.miniEditor.getModel().scrollToCursorPosition();
    };

    Dialog.prototype.close = function() {
      var panelToDestroy;
      panelToDestroy = this.panel;
      this.panel = null;
      if (panelToDestroy != null) {
        panelToDestroy.destroy();
      }
      return atom.workspace.getActivePane().activate();
    };

    Dialog.prototype.cancel = function() {
      return this.close();
    };

    return Dialog;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsc0JBQUEsY0FBRCxFQUFpQixZQUFBLElBQWpCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsTUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFVBQUEsTUFBQTtBQUFBLE1BRFUseUJBQUQsT0FBVyxJQUFWLE1BQ1YsQ0FBQTthQUFBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxzQkFBUDtPQUFMLEVBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDbEMsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLE1BQVAsRUFBZTtBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7QUFBQSxZQUFlLE1BQUEsRUFBUSxZQUF2QjtXQUFmLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFmLENBQTNCLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxzQkFBUCxFQUErQjtBQUFBLFlBQUEsS0FBQSxFQUFPLGNBQVA7V0FBL0IsQ0FGQSxDQUFBO2lCQUdBLEtBQUMsQ0FBQSxLQUFELENBQU8sMkJBQVAsRUFBb0M7QUFBQSxZQUFBLEtBQUEsRUFBTyxlQUFQO1dBQXBDLEVBSmtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxxQkFPQSxVQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixVQUFBLDJDQUFBO0FBQUEsNkJBRFcsT0FBeUMsSUFBeEMsa0JBQUEsV0FBVyx3QkFBQSxpQkFBaUIsaUJBQUEsUUFDeEMsQ0FBQTtBQUFBLE1BQUEsSUFBbUMsU0FBbkM7QUFBQSxRQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFxQixTQUFyQixDQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNFO0FBQUEsUUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQVcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBWCxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7QUFBQSxRQUNBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURmO09BREYsQ0FEQSxDQUFBO0FBS0EsTUFBQSxJQUFBLENBQUEsUUFBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxFQUFaLENBQWUsTUFBZixFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QixDQUFBLENBREY7T0FMQTtBQVFBLE1BQUEsSUFBRyxlQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLE9BQXZCLENBQStCLGVBQS9CLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsU0FBdkIsQ0FBQSxFQUZGO09BVFU7SUFBQSxDQVBaLENBQUE7O0FBQUEscUJBb0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLE9BQVg7T0FBN0IsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLHNCQUF2QixDQUFBLEVBSE07SUFBQSxDQXBCUixDQUFBOztBQUFBLHFCQXlCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxLQUFsQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBRFQsQ0FBQTs7UUFFQSxjQUFjLENBQUUsT0FBaEIsQ0FBQTtPQUZBO2FBR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxRQUEvQixDQUFBLEVBSks7SUFBQSxDQXpCUCxDQUFBOztBQUFBLHFCQStCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURNO0lBQUEsQ0EvQlIsQ0FBQTs7a0JBQUE7O0tBRG1CLEtBSHJCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/dialog.coffee
