
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  'Command finder' view, which lists all available commands and variables.
 */

(function() {
  var $$, ATPCommandFinderView, SelectListView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = include('atom-space-pen-views'), SelectListView = _ref.SelectListView, $$ = _ref.$$;

  module.exports = ATPCommandFinderView = (function(_super) {
    __extends(ATPCommandFinderView, _super);

    function ATPCommandFinderView() {
      return ATPCommandFinderView.__super__.constructor.apply(this, arguments);
    }

    ATPCommandFinderView.thisPanel = null;

    ATPCommandFinderView.thisCaller = null;

    ATPCommandFinderView.prototype.initialize = function(listOfItems) {
      this.listOfItems = listOfItems;
      ATPCommandFinderView.__super__.initialize.apply(this, arguments);
      return this.setItems(this.listOfItems);
    };

    ATPCommandFinderView.prototype.viewForItem = function(item) {
      var descr_prefix, icon_style;
      icon_style = '';
      descr_prefix = '';
      if (item.source === 'external') {
        icon_style = 'book';
        descr_prefix = 'External: ';
      } else if (item.source === 'internal') {
        icon_style = 'repo';
        descr_prefix = 'Builtin: ';
      } else if (item.source === 'internal-atom') {
        icon_style = 'repo';
        descr_prefix = 'Atom command: ';
      } else if (item.source === 'external-functional') {
        icon_style = 'plus';
        descr_prefix = 'Functional: ';
      } else if (item.source === 'global-variable') {
        icon_style = 'briefcase';
        descr_prefix = 'Global variable: ';
      }
      return $$(function() {
        return this.li({
          "class": 'two-lines selected'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": "status status-" + icon_style + " icon icon-" + icon_style
            });
            _this.div({
              "class": 'primary-line'
            }, function() {
              return _this.span(item.name);
            });
            return _this.div({
              "class": 'secondary-line'
            }, function() {
              return _this.span(descr_prefix + item.description);
            });
          };
        })(this));
      });
    };

    ATPCommandFinderView.prototype.shown = function(panel, caller) {
      this.thisPanel = panel;
      return this.thisCaller = caller;
    };

    ATPCommandFinderView.prototype.close = function(item) {
      var e;
      if (this.thisPanel != null) {
        try {
          this.thisPanel.destroy();
        } catch (_error) {
          e = _error;
        }
      }
      if (item != null) {
        return this.thisCaller.onCommand(item.name);
      }
    };

    ATPCommandFinderView.prototype.cancel = function() {
      return this.close(null);
    };

    ATPCommandFinderView.prototype.confirmed = function(item) {
      return this.close(item);
    };

    ATPCommandFinderView.prototype.getFilterKey = function() {
      return "name";
    };

    return ATPCommandFinderView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLWNvbW1hbmQtZmluZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQVFBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsVUFBQSxFQVJqQixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLG9CQUFDLENBQUEsU0FBRCxHQUFZLElBQVosQ0FBQTs7QUFBQSxJQUNBLG9CQUFDLENBQUEsVUFBRCxHQUFhLElBRGIsQ0FBQTs7QUFBQSxtQ0FHQSxVQUFBLEdBQVksU0FBRSxXQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxjQUFBLFdBQ1osQ0FBQTtBQUFBLE1BQUEsc0RBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxXQUFYLEVBRlU7SUFBQSxDQUhaLENBQUE7O0FBQUEsbUNBUUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSx3QkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLEVBRGYsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTCxLQUFlLFVBQWxCO0FBQ0UsUUFBQSxVQUFBLEdBQWEsTUFBYixDQUFBO0FBQUEsUUFDQSxZQUFBLEdBQWUsWUFEZixDQURGO09BQUEsTUFHSyxJQUFHLElBQUksQ0FBQyxNQUFMLEtBQWUsVUFBbEI7QUFDSCxR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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-command-finder.coffee
