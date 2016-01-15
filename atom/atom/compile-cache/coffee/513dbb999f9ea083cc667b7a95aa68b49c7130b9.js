(function() {
  var $$, GotoView, SelectListView, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs');

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  utils = require('./symbol-utils');

  module.exports = GotoView = (function(_super) {
    __extends(GotoView, _super);

    function GotoView() {
      return GotoView.__super__.constructor.apply(this, arguments);
    }

    GotoView.prototype.initialize = function() {
      GotoView.__super__.initialize.apply(this, arguments);
      this.addClass('goto-view fuzzy-finder');
      this.currentEditor = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.destroy = function() {
      var _ref1;
      this.cancel();
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    GotoView.prototype.cancel = function() {
      GotoView.__super__.cancel.apply(this, arguments);
      this.restoreCancelPosition();
      this.currentEditor = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.populate = function(symbols, editor) {
      this.rememberCancelPosition(editor);
      this.setItems(symbols);
      return this.show();
    };

    GotoView.prototype.rememberCancelPosition = function(editor) {
      if (!editor || !atom.config.get('goto.autoScroll')) {
        return;
      }
      this.currentEditor = editor;
      return this.cancelPosition = {
        position: editor.getCursorBufferPosition(),
        selections: editor.getSelectedBufferRanges()
      };
    };

    GotoView.prototype.restoreCancelPosition = function() {
      if (this.currentEditor && this.cancelPosition) {
        this.currentEditor.setCursorBufferPosition(this.cancelPosition.position);
        if (this.cancelPosition.selections) {
          return this.currentEditor.setSelectedBufferRanges(this.cancelPosition.selections);
        }
      }
    };

    GotoView.prototype.forgetCancelPosition = function() {
      this.currentEditor = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.getFilterKey = function() {
      return 'name';
    };

    GotoView.prototype.scrollToItemView = function(view) {
      var symbol;
      GotoView.__super__.scrollToItemView.apply(this, arguments);
      symbol = this.getSelectedItem();
      return this.onItemSelected(symbol);
    };

    GotoView.prototype.onItemSelected = function(symbol) {
      var _ref1;
      return (_ref1 = this.currentEditor) != null ? _ref1.setCursorBufferPosition(symbol.position) : void 0;
    };

    GotoView.prototype.viewForItem = function(symbol) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var dir, text;
            _this.div(symbol.name, {
              "class": 'primary-line'
            });
            dir = path.basename(symbol.path);
            text = "" + dir + " " + (symbol.position.row + 1);
            return _this.div(text, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    GotoView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No symbols found';
      } else {
        return GotoView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    GotoView.prototype.confirmed = function(symbol) {
      this.forgetCancelPosition();
      if (!fs.existsSync(symbol.path)) {
        this.setError('Selected file does not exist');
        return setTimeout(((function(_this) {
          return function() {
            return _this.setError();
          };
        })(this)), 2000);
      } else if (atom.workspace.getActiveTextEditor()) {
        this.cancel();
        return utils.gotoSymbol(symbol);
      }
    };

    GotoView.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    GotoView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    GotoView.prototype.cancelled = function() {
      return this.hide();
    };

    return GotoView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dvdG8vbGliL2dvdG8tdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsbURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FGTCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLDBDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLHdCQUFWLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFKakIsQ0FBQTthQVFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBVFI7SUFBQSxDQUFaLENBQUE7O0FBQUEsdUJBZ0JBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLEtBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2lEQUNNLENBQUUsT0FBUixDQUFBLFdBRk87SUFBQSxDQWhCVCxDQUFBOztBQUFBLHVCQW9CQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxzQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEs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

//# sourceURL=/Users/david/.atom/packages/goto/lib/goto-view.coffee
