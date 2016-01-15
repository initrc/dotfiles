(function() {
  var CommandPromptView, EditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, EditorView = _ref.EditorView;

  module.exports = CommandPromptView = (function(_super) {
    __extends(CommandPromptView, _super);

    function CommandPromptView() {
      this.deactivate = __bind(this.deactivate, this);
      this.focus = __bind(this.focus, this);
      this.confirm = __bind(this.confirm, this);
      return CommandPromptView.__super__.constructor.apply(this, arguments);
    }

    CommandPromptView.content = function() {
      return this.div({
        "class": 'terminal-runner overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'editor-container',
            outlet: 'editorContainer'
          }, function() {
            var editor;
            editor = new EditorView({
              mini: true
            });
            editor.setPlaceholderText("enter command");
            return _this.subview('editor', editor);
          });
        };
      })(this));
    };

    CommandPromptView.prototype.initialize = function(terminalRunner, state) {
      this.terminalRunner = terminalRunner;
    };

    CommandPromptView.prototype.serialize = function() {};

    CommandPromptView.prototype.handleEvents = function() {
      this.editor.on('core:confirm', this.confirm);
      this.editor.on('core:cancel', this.deactivate);
      return this.editor.find('input').on('blur', this.deactivate);
    };

    CommandPromptView.prototype.confirm = function() {
      this.terminalRunner.runCommand(this.editor.getText());
      return this.deactivate();
    };

    CommandPromptView.prototype.focus = function() {
      this.removeClass('hidden');
      return this.editorContainer.find('.editor').focus();
    };

    CommandPromptView.prototype.activate = function() {
      if (this.hasParent()) {
        return this.focus();
      } else {
        atom.workspaceView.append(this);
        this.focus();
        return this.handleEvents();
      }
    };

    CommandPromptView.prototype.deactivate = function() {
      var _ref1;
      if ((_ref1 = atom.workspaceView) != null) {
        _ref1.focus();
      }
      return this.addClass('hidden');
    };

    CommandPromptView.prototype.destroy = function() {
      return this.detach();
    };

    return CommandPromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXJ1bm5lci9saWIvdGVybWluYWwtcnVubmVyL2NvbW1hbmQtcHJvbXB0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxZQUFBLElBQUQsRUFBTyxrQkFBQSxVQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osd0NBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtDQUFQO09BQUwsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDOUMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFBMkIsTUFBQSxFQUFRLGlCQUFuQztXQUFMLEVBQTJELFNBQUEsR0FBQTtBQUN6RCxnQkFBQSxNQUFBO0FBQUEsWUFBQSxNQUFBLEdBQWEsSUFBQSxVQUFBLENBQVc7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQVgsQ0FBYixDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsZUFBMUIsQ0FEQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUh5RDtVQUFBLENBQTNELEVBRDhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxnQ0FPQSxVQUFBLEdBQVksU0FBRSxjQUFGLEVBQWtCLEtBQWxCLEdBQUE7QUFBMEIsTUFBekIsSUFBQyxDQUFBLGlCQUFBLGNBQXdCLENBQTFCO0lBQUEsQ0FQWixDQUFBOztBQUFBLGdDQVNBLFNBQUEsR0FBVyxTQUFBLEdBQUEsQ0FUWCxDQUFBOztBQUFBLGdDQVdBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixDQUFXLGNBQVgsRUFBMkIsSUFBQyxDQUFBLE9BQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsYUFBWCxFQUEwQixJQUFDLENBQUEsVUFBM0IsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsT0FBYixDQUFxQixDQUFDLEVBQXRCLENBQXlCLE1BQXpCLEVBQWlDLElBQUMsQ0FBQSxVQUFsQyxFQUhZO0lBQUEsQ0FYZCxDQUFBOztBQUFBLGdDQWdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsY0FBYyxDQUFDLFVBQWhCLENBQTJCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQTNCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQUEsRUFGTztJQUFBLENBaEJULENBQUE7O0FBQUEsZ0NBb0JBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsUUFBYixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLENBQXNCLFNBQXRCLENBQWdDLENBQUMsS0FBakMsQ0FBQSxFQUZLO0lBQUEsQ0FwQlAsQ0FBQTs7QUFBQSxnQ0F3QkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQW5CLENBQTBCLElBQTFCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQURBLENBQUE7ZUFFQSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBTEY7T0FEUTtJQUFBLENBeEJWLENBQUE7O0FBQUEsZ0NBZ0NBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLEtBQUE7O2FBQWtCLENBQUUsS0FBcEIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBRlU7SUFBQSxDQWhDWixDQUFBOztBQUFBLGdDQW9DQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURPO0lBQUEsQ0FwQ1QsQ0FBQTs7NkJBQUE7O0tBRDhCLEtBSGhDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/david/.atom/packages/terminal-runner/lib/terminal-runner/command-prompt-view.coffee
