(function() {
  var $, CompositeDisposable, StatusBar, StatusIcon, TerminalPlusView, View, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  TerminalPlusView = require('./view');

  StatusIcon = require('./status-icon');

  path = require('path');

  module.exports = StatusBar = (function(_super) {
    __extends(StatusBar, _super);

    function StatusBar() {
      this.moveTerminalView = __bind(this.moveTerminalView, this);
      this.onDropTabBar = __bind(this.onDropTabBar, this);
      this.onDrop = __bind(this.onDrop, this);
      this.onDragOver = __bind(this.onDragOver, this);
      this.onDragEnd = __bind(this.onDragEnd, this);
      this.onDragLeave = __bind(this.onDragLeave, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.closeAll = __bind(this.closeAll, this);
      return StatusBar.__super__.constructor.apply(this, arguments);
    }

    StatusBar.prototype.terminalViews = [];

    StatusBar.prototype.activeTerminal = null;

    StatusBar.prototype.returnFocus = null;

    StatusBar.content = function() {
      return this.div({
        "class": 'terminal-plus status-bar',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.i({
            "class": "icon icon-plus",
            click: 'newTerminalView',
            outlet: 'plusBtn'
          });
          _this.ul({
            "class": "list-inline status-container",
            tabindex: '-1',
            outlet: 'statusContainer',
            is: 'space-pen-ul'
          });
          return _this.i({
            "class": "icon icon-x",
            click: 'closeAll',
            outlet: 'closeBtn'
          });
        };
      })(this));
    };

    StatusBar.prototype.initialize = function() {
      var handleBlur, handleFocus;
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'terminal-plus:new': (function(_this) {
          return function() {
            return _this.newTerminalView();
          };
        })(this),
        'terminal-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-plus:next': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activeNextTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'terminal-plus:prev': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activePrevTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'terminal-plus:close': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this),
        'terminal-plus:close-all': (function(_this) {
          return function() {
            return _this.closeAll();
          };
        })(this),
        'terminal-plus:rename': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.rename();
            });
          };
        })(this),
        'terminal-plus:insert-selected-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection();
            });
          };
        })(this),
        'terminal-plus:insert-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.inputDialog();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.xterm', {
        'terminal-plus:paste': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.paste();
            });
          };
        })(this),
        'terminal-plus:copy': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.copy();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          var mapping, nextTerminal, prevTerminal;
          if (item == null) {
            return;
          }
          if (item.constructor.name === "TerminalPlusView") {
            return setTimeout(item.focus, 100);
          } else if (item.constructor.name === "TextEditor") {
            mapping = atom.config.get('terminal-plus.core.mapTerminalsTo');
            if (mapping === 'None') {
              return;
            }
            switch (mapping) {
              case 'File':
                nextTerminal = _this.getTerminalById(item.getPath(), function(view) {
                  return view.getId().filePath;
                });
                break;
              case 'Folder':
                nextTerminal = _this.getTerminalById(path.dirname(item.getPath()), function(view) {
                  return view.getId().folderPath;
                });
            }
            prevTerminal = _this.getActiveTerminalView();
            if (prevTerminal !== nextTerminal) {
              if (nextTerminal == null) {
                if (item.getTitle() !== 'untitled') {
                  if (atom.config.get('terminal-plus.core.mapTerminalsToAutoOpen')) {
                    return nextTerminal = _this.createTerminalView();
                  }
                }
              } else {
                _this.setActiveTerminalView(nextTerminal);
                if (prevTerminal != null ? prevTerminal.panel.isVisible() : void 0) {
                  return nextTerminal.toggle();
                }
              }
            }
          }
        };
      })(this)));
      this.registerContextMenu();
      this.subscriptions.add(atom.tooltips.add(this.plusBtn, {
        title: 'New Terminal'
      }));
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close All'
      }));
      this.statusContainer.on('dblclick', (function(_this) {
        return function(event) {
          if (event.target === event.delegateTarget) {
            return _this.newTerminalView();
          }
        };
      })(this));
      this.statusContainer.on('dragstart', '.status-icon', this.onDragStart);
      this.statusContainer.on('dragend', '.status-icon', this.onDragEnd);
      this.statusContainer.on('dragleave', this.onDragLeave);
      this.statusContainer.on('dragover', this.onDragOver);
      this.statusContainer.on('drop', this.onDrop);
      handleBlur = (function(_this) {
        return function() {
          var terminal;
          if (terminal = TerminalPlusView.getFocusedTerminal()) {
            _this.returnFocus = _this.terminalViewForTerminal(terminal);
            return terminal.blur();
          }
        };
      })(this);
      handleFocus = (function(_this) {
        return function() {
          if (_this.returnFocus) {
            return setTimeout(function() {
              _this.returnFocus.focus();
              return _this.returnFocus = null;
            }, 100);
          }
        };
      })(this);
      window.addEventListener('blur', handleBlur);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('blur', handleBlur);
        }
      });
      window.addEventListener('focus', handleFocus);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('focus', handleFocus);
        }
      });
      return this.attach();
    };

    StatusBar.prototype.registerContextMenu = function() {
      return this.subscriptions.add(atom.commands.add('.terminal-plus.status-bar', {
        'terminal-plus:status-red': this.setStatusColor,
        'terminal-plus:status-orange': this.setStatusColor,
        'terminal-plus:status-yellow': this.setStatusColor,
        'terminal-plus:status-green': this.setStatusColor,
        'terminal-plus:status-blue': this.setStatusColor,
        'terminal-plus:status-purple': this.setStatusColor,
        'terminal-plus:status-pink': this.setStatusColor,
        'terminal-plus:status-cyan': this.setStatusColor,
        'terminal-plus:status-magenta': this.setStatusColor,
        'terminal-plus:status-default': this.clearStatusColor,
        'terminal-plus:context-close': function(event) {
          return $(event.target).closest('.status-icon')[0].terminalView.destroy();
        },
        'terminal-plus:context-hide': function(event) {
          var statusIcon;
          statusIcon = $(event.target).closest('.status-icon')[0];
          if (statusIcon.isActive()) {
            return statusIcon.terminalView.hide();
          }
        },
        'terminal-plus:context-rename': function(event) {
          return $(event.target).closest('.status-icon')[0].rename();
        }
      }));
    };

    StatusBar.prototype.registerPaneSubscription = function() {
      return this.subscriptions.add(this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBar;
          paneElement = $(atom.views.getView(pane));
          tabBar = paneElement.find('ul');
          tabBar.on('drop', function(event) {
            return _this.onDropTabBar(event, pane);
          });
          tabBar.on('dragstart', function(event) {
            var _ref1;
            if (((_ref1 = event.target.item) != null ? _ref1.constructor.name : void 0) !== 'TerminalPlusView') {
              return;
            }
            return event.originalEvent.dataTransfer.setData('terminal-plus-tab', 'true');
          });
          return pane.onDidDestroy(function() {
            return tabBar.off('drop', this.onDropTabBar);
          });
        };
      })(this)));
    };

    StatusBar.prototype.createTerminalView = function() {
      var args, directory, editorFolder, editorPath, home, id, projectFolder, pwd, shell, shellArguments, statusIcon, terminalPlusView, _i, _len, _ref1, _ref2;
      if (this.paneSubscription == null) {
        this.registerPaneSubscription();
      }
      projectFolder = atom.project.getPaths()[0];
      editorPath = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
      if (editorPath != null) {
        editorFolder = path.dirname(editorPath);
        _ref2 = atom.project.getPaths();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          directory = _ref2[_i];
          if (editorPath.indexOf(directory) >= 0) {
            projectFolder = directory;
          }
        }
      }
      if ((projectFolder != null ? projectFolder.indexOf('atom://') : void 0) >= 0) {
        projectFolder = void 0;
      }
      home = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
      switch (atom.config.get('terminal-plus.core.workingDirectory')) {
        case 'Project':
          pwd = projectFolder || editorFolder || home;
          break;
        case 'Active File':
          pwd = editorFolder || projectFolder || home;
          break;
        default:
          pwd = home;
      }
      id = editorPath || projectFolder || home;
      id = {
        filePath: id,
        folderPath: path.dirname(id)
      };
      shell = atom.config.get('terminal-plus.core.shell');
      shellArguments = atom.config.get('terminal-plus.core.shellArguments');
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      statusIcon = new StatusIcon();
      terminalPlusView = new TerminalPlusView(id, pwd, statusIcon, this, shell, args);
      statusIcon.initialize(terminalPlusView);
      terminalPlusView.attach();
      this.terminalViews.push(terminalPlusView);
      this.statusContainer.append(statusIcon);
      return terminalPlusView;
    };

    StatusBar.prototype.activeNextTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index + 1);
    };

    StatusBar.prototype.activePrevTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index - 1);
    };

    StatusBar.prototype.indexOf = function(view) {
      return this.terminalViews.indexOf(view);
    };

    StatusBar.prototype.activeTerminalView = function(index) {
      if (this.terminalViews.length < 2) {
        return false;
      }
      if (index >= this.terminalViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.terminalViews.length - 1;
      }
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.getActiveTerminalView = function() {
      return this.activeTerminal;
    };

    StatusBar.prototype.getTerminalById = function(target, selector) {
      var index, terminal, _i, _ref1;
      if (selector == null) {
        selector = function(terminal) {
          return terminal.id;
        };
      }
      for (index = _i = 0, _ref1 = this.terminalViews.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
        terminal = this.terminalViews[index];
        if (terminal != null) {
          if (selector(terminal) === target) {
            return terminal;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.terminalViewForTerminal = function(terminal) {
      var index, terminalView, _i, _ref1;
      for (index = _i = 0, _ref1 = this.terminalViews.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
        terminalView = this.terminalViews[index];
        if (terminalView != null) {
          if (terminalView.getTerminal() === terminal) {
            return terminalView;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.runInActiveView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if (view != null) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.runInOpenView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if ((view != null) && view.panel.isVisible()) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.setActiveTerminalView = function(view) {
      return this.activeTerminal = view;
    };

    StatusBar.prototype.removeTerminalView = function(view) {
      var index;
      index = this.indexOf(view);
      if (index < 0) {
        return;
      }
      this.terminalViews.splice(index, 1);
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.activateAdjacentTerminal = function(index) {
      if (index == null) {
        index = 0;
      }
      if (!(this.terminalViews.length > 0)) {
        return false;
      }
      index = Math.max(0, index - 1);
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.newTerminalView = function() {
      var _ref1;
      if ((_ref1 = this.activeTerminal) != null ? _ref1.animating : void 0) {
        return;
      }
      this.activeTerminal = this.createTerminalView();
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.attach = function() {
      return atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
    };

    StatusBar.prototype.destroyActiveTerm = function() {
      var index;
      if (this.activeTerminal == null) {
        return;
      }
      index = this.indexOf(this.activeTerminal);
      this.activeTerminal.destroy();
      this.activeTerminal = null;
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.closeAll = function() {
      var index, view, _i, _ref1;
      for (index = _i = _ref1 = this.terminalViews.length; _ref1 <= 0 ? _i <= 0 : _i >= 0; index = _ref1 <= 0 ? ++_i : --_i) {
        view = this.terminalViews[index];
        if (view != null) {
          view.destroy();
        }
      }
      return this.activeTerminal = null;
    };

    StatusBar.prototype.destroy = function() {
      var view, _i, _len, _ref1;
      this.subscriptions.dispose();
      _ref1 = this.terminalViews;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.ptyProcess.terminate();
        view.terminal.destroy();
      }
      return this.detach();
    };

    StatusBar.prototype.toggle = function() {
      if (this.terminalViews.length === 0) {
        this.activeTerminal = this.createTerminalView();
      } else if (this.activeTerminal === null) {
        this.activeTerminal = this.terminalViews[0];
      }
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.setStatusColor = function(event) {
      var color;
      color = event.type.match(/\w+$/)[0];
      color = atom.config.get("terminal-plus.iconColors." + color).toRGBAString();
      return $(event.target).closest('.status-icon').css('color', color);
    };

    StatusBar.prototype.clearStatusColor = function(event) {
      return $(event.target).closest('.status-icon').css('color', '');
    };

    StatusBar.prototype.onDragStart = function(event) {
      var element;
      event.originalEvent.dataTransfer.setData('terminal-plus-panel', 'true');
      element = $(event.target).closest('.status-icon');
      element.addClass('is-dragging');
      return event.originalEvent.dataTransfer.setData('from-index', element.index());
    };

    StatusBar.prototype.onDragLeave = function(event) {
      return this.removePlaceholder();
    };

    StatusBar.prototype.onDragEnd = function(event) {
      return this.clearDropTarget();
    };

    StatusBar.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, statusIcons;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent.dataTransfer.getData('terminal-plus') !== 'true') {
        return;
      }
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
        return;
      }
      this.removeDropTargetClasses();
      statusIcons = this.statusContainer.children('.status-icon');
      if (newDropTargetIndex < statusIcons.length) {
        element = statusIcons.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholder().insertBefore(element);
      } else {
        element = statusIcons.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholder().insertAfter(element);
      }
    };

    StatusBar.prototype.onDrop = function(event) {
      var dataTransfer, fromIndex, pane, paneIndex, panelEvent, tabEvent, toIndex, view;
      dataTransfer = event.originalEvent.dataTransfer;
      panelEvent = dataTransfer.getData('terminal-plus-panel') === 'true';
      tabEvent = dataTransfer.getData('terminal-plus-tab') === 'true';
      if (!(panelEvent || tabEvent)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      toIndex = this.getDropTargetIndex(event);
      this.clearDropTarget();
      if (tabEvent) {
        fromIndex = parseInt(dataTransfer.getData('sortable-index'));
        paneIndex = parseInt(dataTransfer.getData('from-pane-index'));
        pane = atom.workspace.getPanes()[paneIndex];
        view = pane.itemAtIndex(fromIndex);
        pane.removeItem(view, false);
        view.show();
        view.toggleTabView();
        this.terminalViews.push(view);
        if (view.statusIcon.isActive()) {
          view.open();
        }
        this.statusContainer.append(view.statusIcon);
        fromIndex = this.terminalViews.length - 1;
      } else {
        fromIndex = parseInt(dataTransfer.getData('from-index'));
      }
      return this.updateOrder(fromIndex, toIndex);
    };

    StatusBar.prototype.onDropTabBar = function(event, pane) {
      var dataTransfer, fromIndex, tabBar, view;
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('terminal-plus-panel') !== 'true') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.clearDropTarget();
      fromIndex = parseInt(dataTransfer.getData('from-index'));
      view = this.terminalViews[fromIndex];
      view.css("height", "");
      view.terminal.element.style.height = "";
      tabBar = $(event.target).closest('.tab-bar');
      view.toggleTabView();
      this.removeTerminalView(view);
      this.statusContainer.children().eq(fromIndex).detach();
      view.statusIcon.removeTooltip();
      pane.addItem(view, pane.getItems().length);
      pane.activateItem(view);
      return view.focus();
    };

    StatusBar.prototype.clearDropTarget = function() {
      var element;
      element = this.find('.is-dragging');
      element.removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    StatusBar.prototype.removeDropTargetClasses = function() {
      this.statusContainer.find('.is-drop-target').removeClass('is-drop-target');
      return this.statusContainer.find('.drop-target-is-after').removeClass('drop-target-is-after');
    };

    StatusBar.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, statusIcons, target;
      target = $(event.target);
      if (this.isPlaceholder(target)) {
        return;
      }
      statusIcons = this.statusContainer.children('.status-icon');
      element = target.closest('.status-icon');
      if (element.length === 0) {
        element = statusIcons.last();
      }
      if (!element.length) {
        return 0;
      }
      elementCenter = element.offset().left + element.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return statusIcons.index(element);
      } else if (element.next('.status-icon').length > 0) {
        return statusIcons.index(element.next('.status-icon'));
      } else {
        return statusIcons.index(element) + 1;
      }
    };

    StatusBar.prototype.getPlaceholder = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li class="placeholder"></li>');
    };

    StatusBar.prototype.removePlaceholder = function() {
      var _ref1;
      if ((_ref1 = this.placeholderEl) != null) {
        _ref1.remove();
      }
      return this.placeholderEl = null;
    };

    StatusBar.prototype.isPlaceholder = function(element) {
      return element.is('.placeholder');
    };

    StatusBar.prototype.iconAtIndex = function(index) {
      return this.getStatusIcons().eq(index);
    };

    StatusBar.prototype.getStatusIcons = function() {
      return this.statusContainer.children('.status-icon');
    };

    StatusBar.prototype.moveIconToIndex = function(icon, toIndex) {
      var container, followingIcon;
      followingIcon = this.getStatusIcons()[toIndex];
      container = this.statusContainer[0];
      if (followingIcon != null) {
        return container.insertBefore(icon, followingIcon);
      } else {
        return container.appendChild(icon);
      }
    };

    StatusBar.prototype.moveTerminalView = function(fromIndex, toIndex) {
      var activeTerminal, view;
      activeTerminal = this.getActiveTerminalView();
      view = this.terminalViews.splice(fromIndex, 1)[0];
      this.terminalViews.splice(toIndex, 0, view);
      return this.setActiveTerminalView(activeTerminal);
    };

    StatusBar.prototype.updateOrder = function(fromIndex, toIndex) {
      var icon;
      if (fromIndex === toIndex) {
        return;
      }
      if (fromIndex < toIndex) {
        toIndex--;
      }
      icon = this.getStatusIcons().eq(fromIndex).detach();
      this.moveIconToIndex(icon.get(0), toIndex);
      this.moveTerminalView(fromIndex, toIndex);
      icon.addClass('inserted');
      return icon.one('webkitAnimationEnd', function() {
        return icon.removeClass('inserted');
      });
    };

    return StatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvc3RhdHVzLWJhci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUZBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBREosQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxRQUFSLENBSG5CLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixnQ0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSx3QkFBQSxhQUFBLEdBQWUsRUFBZixDQUFBOztBQUFBLHdCQUNBLGNBQUEsR0FBZ0IsSUFEaEIsQ0FBQTs7QUFBQSx3QkFFQSxXQUFBLEdBQWEsSUFGYixDQUFBOztBQUFBLElBSUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMEJBQVA7QUFBQSxRQUFtQyxRQUFBLEVBQVUsQ0FBQSxDQUE3QztPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEQsVUFBQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sZ0JBQVA7QUFBQSxZQUF5QixLQUFBLEVBQU8saUJBQWhD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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/status-bar.coffee
