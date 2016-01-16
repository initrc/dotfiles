(function() {
  var CliStatusView, CommandOutputView, View, domify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  domify = require('domify');

  CommandOutputView = require('./command-output-view');

  module.exports = CliStatusView = (function(_super) {
    __extends(CliStatusView, _super);

    function CliStatusView() {
      return CliStatusView.__super__.constructor.apply(this, arguments);
    }

    CliStatusView.content = function() {
      return this.div({
        "class": 'cli-status inline-block'
      }, (function(_this) {
        return function() {
          _this.span({
            outlet: 'termStatusContainer'
          }, function() {});
          return _this.span({
            click: 'newTermClick',
            "class": "cli-status icon icon-plus"
          });
        };
      })(this));
    };

    CliStatusView.prototype.commandViews = [];

    CliStatusView.prototype.activeIndex = 0;

    CliStatusView.prototype.initialize = function(serializeState) {
      atom.commands.add('atom-workspace', {
        'terminal-status:new': (function(_this) {
          return function() {
            return _this.newTermClick();
          };
        })(this),
        'terminal-status:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-status:next': (function(_this) {
          return function() {
            return _this.activeNextCommandView();
          };
        })(this),
        'terminal-status:prev': (function(_this) {
          return function() {
            return _this.activePrevCommandView();
          };
        })(this)
      });
      this.createCommandView();
      return this.attach();
    };

    CliStatusView.prototype.createCommandView = function() {
      var commandOutputView, termStatus;
      termStatus = domify('<span class="cli-status icon icon-terminal"></span>');
      commandOutputView = new CommandOutputView;
      commandOutputView.statusIcon = termStatus;
      commandOutputView.statusView = this;
      this.commandViews.push(commandOutputView);
      termStatus.addEventListener('click', (function(_this) {
        return function() {
          return commandOutputView.toggle();
        };
      })(this));
      this.termStatusContainer.append(termStatus);
      return commandOutputView;
    };

    CliStatusView.prototype.activeNextCommandView = function() {
      return this.activeCommandView(this.activeIndex + 1);
    };

    CliStatusView.prototype.activePrevCommandView = function() {
      return this.activeCommandView(this.activeIndex - 1);
    };

    CliStatusView.prototype.activeCommandView = function(index) {
      if (index >= this.commandViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.commandViews.length - 1;
      }
      return this.commandViews[index] && this.commandViews[index].open();
    };

    CliStatusView.prototype.setActiveCommandView = function(commandView) {
      return this.activeIndex = this.commandViews.indexOf(commandView);
    };

    CliStatusView.prototype.removeCommandView = function(commandView) {
      var index;
      index = this.commandViews.indexOf(commandView);
      return index >= 0 && this.commandViews.splice(index, 1);
    };

    CliStatusView.prototype.newTermClick = function() {
      return this.createCommandView().toggle();
    };

    CliStatusView.prototype.attach = function(statusBar) {
      statusBar = document.querySelector("status-bar");
      if (statusBar != null) {
        return this.statusBarTile = statusBar.addLeftTile({
          item: this,
          priority: 100
        });
      }
    };

    CliStatusView.prototype.destroy = function() {
      var index, _i, _ref;
      for (index = _i = _ref = this.commandViews.length; _ref <= 0 ? _i <= 0 : _i >= 0; index = _ref <= 0 ? ++_i : --_i) {
        this.removeCommandView(this.commandViews[index]);
      }
      return this.detach();
    };

    CliStatusView.prototype.toggle = function() {
      if (this.commandViews[this.activeIndex]) {
        return this.commandViews[this.activeIndex].toggle();
      } else {
        return this.newTermClick();
      }
    };

    return CliStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtc3RhdHVzL2xpYi9jbGktc3RhdHVzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQURULENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FGcEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx5QkFBUDtPQUFMLEVBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckMsVUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxNQUFBLEVBQVEscUJBQVI7V0FBTixFQUFxQyxTQUFBLEdBQUEsQ0FBckMsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsWUFBdUIsT0FBQSxFQUFPLDJCQUE5QjtXQUFOLEVBRnFDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw0QkFLQSxZQUFBLEdBQWMsRUFMZCxDQUFBOztBQUFBLDRCQU1BLFdBQUEsR0FBYSxDQU5iLENBQUE7O0FBQUEsNEJBT0EsVUFBQSxHQUFZLFNBQUMs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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-status/lib/cli-status-view.coffee
