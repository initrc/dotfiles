(function() {
  var CompositeDisposable, RenameDialog, StatusIcon,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  RenameDialog = null;

  module.exports = StatusIcon = (function(_super) {
    __extends(StatusIcon, _super);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var _ref;
      this.terminalView = terminalView;
      this.classList.add('status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.name = document.createElement('span');
      this.name.classList.add('name');
      this.appendChild(this.name);
      this.dataset.type = (_ref = this.terminalView.constructor) != null ? _ref.name : void 0;
      this.addEventListener('click', (function(_this) {
        return function(_arg) {
          var ctrlKey, which;
          which = _arg.which, ctrlKey = _arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
      return this.setupTooltip();
    };

    StatusIcon.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function(event) {
          if (event.detail === 'terminal-plus') {
            return;
          }
          return _this.updateTooltip();
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    StatusIcon.prototype.updateTooltip = function() {
      var process;
      this.removeTooltip();
      if (process = this.terminalView.getTerminalTitle()) {
        this.tooltip = atom.tooltips.add(this, {
          title: process,
          html: false,
          delay: {
            show: 1000,
            hide: 100
          }
        });
      }
      return this.dispatchEvent(new CustomEvent('mouseenter', {
        bubbles: true,
        detail: 'terminal-plus'
      }));
    };

    StatusIcon.prototype.removeTooltip = function() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      return this.tooltip = null;
    };

    StatusIcon.prototype.destroy = function() {
      this.removeTooltip();
      if (this.mouseEnterSubscription) {
        this.mouseEnterSubscription.dispose();
      }
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.isActive = function() {
      return this.classList.contains('active');
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    StatusIcon.prototype.rename = function() {
      var dialog;
      if (RenameDialog == null) {
        RenameDialog = require('./rename-dialog');
      }
      dialog = new RenameDialog(this);
      return dialog.attach();
    };

    StatusIcon.prototype.getName = function() {
      return this.name.textContent.substring(1);
    };

    StatusIcon.prototype.updateName = function(name) {
      if (name !== this.getName()) {
        if (name) {
          name = "&nbsp;" + name;
        }
        this.name.innerHTML = name;
        return this.terminalView.emit('did-change-title');
      }
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvc3RhdHVzLWljb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxJQUZmLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxLQUFSLENBQUE7O0FBQUEseUJBRUEsVUFBQSxHQUFZLFNBQUUsWUFBRixHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsZUFBQSxZQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLGFBQWYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBRlIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsTUFBcEIsRUFBNEIsZUFBNUIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQU5SLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLE1BQXBCLENBUEEsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJ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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/status-icon.coffee
