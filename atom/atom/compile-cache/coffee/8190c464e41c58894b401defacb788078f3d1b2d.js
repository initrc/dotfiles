
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  The panel, which manages all the terminal instances.
 */

(function() {
  var $, ATPOutputView, ATPPanel, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = include('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  ATPOutputView = include('atp-view');

  module.exports = ATPPanel = (function(_super) {
    __extends(ATPPanel, _super);

    function ATPPanel() {
      return ATPPanel.__super__.constructor.apply(this, arguments);
    }

    ATPPanel.content = function() {
      return this.div({
        "class": 'atp-panel inline-block'
      }, (function(_this) {
        return function() {
          _this.span({
            outlet: 'termStatusContainer'
          }, function() {
            return _this.span({
              click: 'newTermClick',
              "class": "atp-panel icon icon-plus"
            });
          });
          return _this.span({
            outlet: 'termStatusInfo',
            style: 'position:absolute;right:10%;'
          });
        };
      })(this));
    };

    ATPPanel.prototype.commandViews = [];

    ATPPanel.prototype.activeIndex = 0;

    ATPPanel.prototype.initialize = function(serializeState) {
      var getSelectedText;
      getSelectedText = function() {
        var text;
        text = '';
        if (window.getSelection) {
          text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
          text = document.selection.createRange().text;
        }
        return text;
      };
      atom.commands.add('atom-workspace', {
        'atom-terminal-panel:context-copy-and-execute-output-selection': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              var t;
              t = getSelectedText();
              atom.clipboard.write(t);
              return i.onCommand(t);
            });
          };
        })(this),
        'atom-terminal-panel:context-copy-output-selection': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return atom.clipboard.write(getSelectedText());
            });
          };
        })(this),
        'atom-terminal-panel:context-copy-raw-output': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return atom.clipboard.write(i.getRawOutput());
            });
          };
        })(this),
        'atom-terminal-panel:context-copy-html-output': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return atom.clipboard.write(i.getHtmlOutput());
            });
          };
        })(this),
        'atom-terminal-panel:new': (function(_this) {
          return function() {
            return _this.newTermClick();
          };
        })(this),
        'atom-terminal-panel:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'atom-terminal-panel:next': (function(_this) {
          return function() {
            return _this.activeNextCommandView();
          };
        })(this),
        'atom-terminal-panel:prev': (function(_this) {
          return function() {
            return _this.activePrevCommandView();
          };
        })(this),
        'atom-terminal-panel:hide': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return i.close();
            });
          };
        })(this),
        'atom-terminal-panel:destroy': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return i.destroy();
            });
          };
        })(this),
        'atom-terminal-panel:compile': (function(_this) {
          return function() {
            return _this.getForcedActiveCommandView().compile();
          };
        })(this),
        'atom-terminal-panel:toggle-autocompletion': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return i.toggleAutoCompletion();
            });
          };
        })(this),
        'atom-terminal-panel:reload-config': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              i.clear();
              i.reloadSettings();
              return i.clear();
            });
          };
        })(this),
        'atom-terminal-panel:show-command-finder': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return i.getLocalCommandsMemdump();
            });
          };
        })(this),
        'atom-terminal-panel:open-config': (function(_this) {
          return function() {
            return _this.runInCurrentView(function(i) {
              return i.showSettings();
            });
          };
        })(this)
      });
      this.createCommandView();
      return this.attach();
    };

    ATPPanel.prototype.updateStatusBarTask = function(instance, delay) {
      if (delay == null) {
        delay = 1000;
      }
      return setTimeout((function(_this) {
        return function() {
          if (instance != null) {
            _this.updateStatusBar(instance);
          } else {
            _this.updateStatusBar(_this.commandViews[0]);
          }
          return _this.updateStatusBarTask(instance, delay);
        };
      })(this), delay);
    };

    ATPPanel.prototype.updateStatusBar = function(instance) {
      if (instance == null) {
        return;
      }
      this.termStatusInfo.children().remove();
      return this.termStatusInfo.append(instance.parseTemplate(atom.config.get('atom-terminal-panel.statusBarText'), [], true));
    };

    ATPPanel.prototype.createCommandView = function() {
      var commandOutputView, termStatus;
      termStatus = $('<span class="atp-panel icon icon-terminal"></span>');
      commandOutputView = new ATPOutputView;
      commandOutputView.statusIcon = termStatus;
      commandOutputView.statusView = this;
      this.commandViews.push(commandOutputView);
      termStatus.click((function(_this) {
        return function() {
          return commandOutputView.toggle();
        };
      })(this));
      this.termStatusContainer.append(termStatus);
      commandOutputView.init();
      this.updateStatusBar(commandOutputView);
      return commandOutputView;
    };

    ATPPanel.prototype.activeNextCommandView = function() {
      return this.activeCommandView(this.activeIndex + 1);
    };

    ATPPanel.prototype.activePrevCommandView = function() {
      return this.activeCommandView(this.activeIndex - 1);
    };

    ATPPanel.prototype.activeCommandView = function(index) {
      if (index >= this.commandViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.commandViews.length - 1;
      }
      this.updateStatusBar(this.commandViews[index]);
      return this.commandViews[index] && this.commandViews[index].open();
    };

    ATPPanel.prototype.getActiveCommandView = function() {
      return this.commandViews[this.activeIndex];
    };

    ATPPanel.prototype.runInCurrentView = function(call) {
      var v;
      v = this.getForcedActiveCommandView();
      if (v != null) {
        return call(v);
      }
      return null;
    };

    ATPPanel.prototype.getForcedActiveCommandView = function() {
      var ret;
      if (this.getActiveCommandView() !== null && this.getActiveCommandView() !== void 0) {
        return this.getActiveCommandView();
      }
      ret = this.activeCommandView(0);
      this.toggle();
      return ret;
    };

    ATPPanel.prototype.setActiveCommandView = function(commandView) {
      this.activeIndex = this.commandViews.indexOf(commandView);
      return this.updateStatusBar(this.commandViews[this.activeIndex]);
    };

    ATPPanel.prototype.removeCommandView = function(commandView) {
      var index;
      index = this.commandViews.indexOf(commandView);
      return index >= 0 && this.commandViews.splice(index, 1);
    };

    ATPPanel.prototype.newTermClick = function() {
      return this.createCommandView().toggle();
    };

    ATPPanel.prototype.attach = function() {
      return atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
    };

    ATPPanel.prototype.destroyActiveTerm = function() {
      var _ref1;
      return (_ref1 = this.commandViews[this.activeIndex]) != null ? _ref1.destroy() : void 0;
    };

    ATPPanel.prototype.closeAll = function() {
      var index, o, _i, _ref1, _results;
      _results = [];
      for (index = _i = _ref1 = this.commandViews.length; _ref1 <= 0 ? _i <= 0 : _i >= 0; index = _ref1 <= 0 ? ++_i : --_i) {
        o = this.commandViews[index];
        if (o != null) {
          _results.push(o.close());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ATPPanel.prototype.destroy = function() {
      var index, _i, _ref1;
      for (index = _i = _ref1 = this.commandViews.length; _ref1 <= 0 ? _i <= 0 : _i >= 0; index = _ref1 <= 0 ? ++_i : --_i) {
        this.removeCommandView(this.commandViews[index]);
      }
      return this.detach();
    };

    ATPPanel.prototype.toggle = function() {
      if (this.commandViews[this.activeIndex] == null) {
        this.createCommandView();
      }
      this.updateStatusBar(this.commandViews[this.activeIndex]);
      return this.commandViews[this.activeIndex].toggle();
    };

    return ATPPanel;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLXBhbmVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQVFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBUkosQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLFVBQVIsQ0FUaEIsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx3QkFBUDtPQUFMLEVBQXNDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEMsVUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxNQUFBLEVBQVEscUJBQVI7V0FBTixFQUFxQyxTQUFBLEdBQUE7bUJBQ25DLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsY0FBdUIsT0FBQSxFQUFPLDBCQUE5QjthQUFOLEVBRG1DO1VBQUEsQ0FBckMsQ0FBQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE1BQUEsRUFBUSxnQkFBUjtBQUFBLFlBQTBCLEtBQUEsRUFBTyw4QkFBakM7V0FBTixFQUhvQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRDLEVBRFE7SUFBQSxDQUFW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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-panel.coffee
