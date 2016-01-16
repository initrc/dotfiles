(function() {
  var Terminal, termjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  termjs = require('term.js');

  Terminal = (function(_super) {
    __extends(Terminal, _super);

    function Terminal() {
      return Terminal.__super__.constructor.apply(this, arguments);
    }

    Terminal.bindKeys = function() {
      if (this._mouseListener != null) {
        return;
      }
      this._mouseListener = function(ev) {
        var el;
        if (!(Terminal.focus && (ev.target != null))) {
          return;
        }
        el = ev.target;
        while (el) {
          if (el === Terminal.focus.element) {
            return;
          }
          el = el.parentNode;
        }
        return Terminal.focus.blur();
      };
      return document.addEventListener('mousedown', this._mouseListener);
    };

    Terminal.prototype.open = function(parent) {
      var div, i, self, _i, _ref;
      termjs.Terminal.brokenBold = false;
      self = this;
      this.parent = parent || this.parent;
      if (!this.parent) {
        throw new Error('Terminal requires a parent element.');
      }
      this.context = window;
      this.document = document;
      this.body = document.getElementsByTagName('body')[0];
      if (this.context.navigator && this.context.navigator.userAgent) {
        this.isMac = !!~this.context.navigator.userAgent.indexOf('Mac');
        this.isIpad = !!~this.context.navigator.userAgent.indexOf('iPad');
        this.isIphone = !!~this.context.navigator.userAgent.indexOf('iPhone');
        this.isMSIE = !!~this.context.navigator.userAgent.indexOf('MSIE');
      }
      this.element = this.document.createElement('div');
      this.element.className = 'terminal';
      this.element.style.outline = 'none';
      this.element.setAttribute('tabindex', 0);
      this.colors[256] = this.element.style.backgroundColor;
      this.colors[257] = this.element.style.color;
      this.children = [];
      for (i = _i = 0, _ref = this.rows; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        div = this.document.createElement('div');
        this.element.appendChild(div);
        this.children.push(div);
      }
      this.parent.appendChild(this.element);
      this.refresh(0, this.rows - 1);
      this.focus();
      return setTimeout(function() {
        return self.element.focus();
      }, 100);
    };

    Terminal.prototype.resize = function(width, height) {
      Terminal.__super__.resize.call(this, width, height);
      return this.addTabindexToChildren();
    };

    Terminal.prototype.focus = function() {
      if (this.sendFocus && !this.isFocused) {
        this.send('\x1b[I');
      }
      this.isFocused = true;
      this.showCursor();
      return true;
    };

    Terminal.prototype.blur = function() {
      if (this.sendFocus && this.isFocused) {
        this.send('\x1b[O');
      }
      this.isFocused = false;
      this.hideCursor();
      return true;
    };

    Terminal.prototype.showCursor = function() {
      this.cursorState = 1;
      this.refresh(this.y, this.y);
      return this.startBlinkInterval();
    };

    Terminal.prototype.hideCursor = function() {
      this.clearBlinkInterval();
      this.cursorState = 0;
      return this.refresh(this.y, this.y);
    };

    Terminal.prototype.startBlinkInterval = function() {
      this.cursorBlink = true;
      if (this._blinkInterval != null) {
        clearInterval(this._blinkInterval);
      }
      return this._blinkInterval = setInterval(this.blink.bind(this), 500);
    };

    Terminal.prototype.clearBlinkInterval = function() {
      this.cursorBlink = false;
      if (this._blinkInterval != null) {
        clearInterval(this._blinkInterval);
        return this._blinkInterval = null;
      }
    };

    Terminal.prototype.blink = function() {
      if (this.cursorBlink === false) {
        this.clearBlinkInterval();
        return;
      }
      this.cursorState ^= 1;
      return this.refresh(this.y, this.y);
    };

    Terminal.prototype.addTabindexToChildren = function() {
      var child, clickFunction, mouseUpFunction, _i, _len, _ref, _results;
      clickFunction = function() {
        var selection;
        selection = window.getSelection();
        if (!((selection != null) && selection.type === 'Range')) {
          return this.parentElement.focus();
        }
      };
      mouseUpFunction = function() {
        return this.focus();
      };
      _ref = this.element.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.tabIndex = 0;
        child.onmousedown = function() {
          return true;
        };
        child.onmouseup = mouseUpFunction;
        _results.push(child.onclick = clickFunction);
      }
      return _results;
    };

    return Terminal;

  })(termjs.Terminal);

  module.exports = Terminal;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybXJrL2xpYi90ZXJtanMtZml4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxnQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSLENBQVQsQ0FBQTs7QUFBQSxFQU1NO0FBRUYsK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLFFBQUQsR0FBVyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQVUsMkJBQVY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsU0FBQyxFQUFELEdBQUE7QUFDZCxZQUFBLEVBQUE7QUFBQSxRQUFBLElBQUEsQ0FBQSxDQUFPLFFBQVEsQ0FBQyxLQUFULElBQW1CLG1CQUExQixDQUFBO0FBQ0ksZ0JBQUEsQ0FESjtTQUFBO0FBQUEsUUFHQSxFQUFBLEdBQUssRUFBRSxDQUFDLE1BSFIsQ0FBQTtBQUlBLGVBQU0sRUFBTixHQUFBO0FBQ0ksVUFBQSxJQUFJLEVBQUEsS0FBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQXpCO0FBQ0ksa0JBQUEsQ0FESjtXQUFBO0FBQUEsVUFFQSxFQUFBLEdBQUssRUFBRSxDQUFDLFVBRlIsQ0FESjtRQUFBLENBSkE7ZUFRQSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQWYsQ0FBQSxFQVRjO01BQUEsQ0FEbEIsQ0FBQTthQVdBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxJQUFDLENBQUEsY0FBeEMsRUFaTztJQUFBLENBQVgsQ0FBQTs7QUFBQSx1QkFlQSxJQUFBLEdBQU0sU0FBQyxNQUFELEdBQUE7QUFDRixVQUFBLHNCQUFBO0FBQUEsTUFBQSxNQUFNLENB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/termrk/lib/termjs-fix.coffee
