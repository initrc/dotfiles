(function() {
  var COLORS, CompositeDisposable, Config, Disposable, Emitter, Range, StatusBarManager, allWhiteSpaceRegExp, getColorProvider, getConfig, getEditor, getKeywordManager, getView, getVisibleBufferRange, getVisibleEditor, observeConfig, _, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable, Emitter = _ref.Emitter, Range = _ref.Range;

  _ = require('underscore-plus');

  StatusBarManager = require('./status-bar-manager');

  allWhiteSpaceRegExp = /^\s*$/;

  Config = {
    decorate: {
      order: 1,
      type: 'string',
      "default": 'box',
      "enum": ['box', 'highlight'],
      description: "Decoation style for highlight"
    },
    highlightSelection: {
      order: 5,
      type: 'boolean',
      "default": true
    },
    highlightSelectionMinimumLength: {
      order: 6,
      type: 'integer',
      "default": 2,
      description: "Minimum length of selection to be highlight"
    },
    highlightSelectionExcludeScopes: {
      order: 7,
      type: 'array',
      items: {
        type: 'string'
      },
      "default": ['vim-mode-plus.visual-mode.blockwise']
    },
    highlightSelectionDelay: {
      order: 8,
      type: 'integer',
      "default": 100,
      description: "Delay(ms) before start to highlight selection when selection changed"
    },
    displayCountOnStatusBar: {
      order: 11,
      type: 'boolean',
      "default": true,
      description: "Show found count on StatusBar"
    },
    countDisplayPosition: {
      order: 12,
      type: 'string',
      "default": 'Left',
      "enum": ['Left', 'Right']
    },
    countDisplayPriority: {
      order: 13,
      type: 'integer',
      "default": 120,
      description: "Lower priority get closer position to the edges of the window"
    },
    countDisplayStyles: {
      order: 14,
      type: 'string',
      "default": 'badge icon icon-location',
      description: "Style class for count span element. See `styleguide:show`."
    }
  };

  getColorProvider = function(colors) {
    var index;
    index = -1;
    return {
      reset: function() {
        return index = -1;
      },
      getNext: function() {
        return colors[index = (index + 1) % colors.length];
      }
    };
  };

  COLORS = ['01', '02', '03', '04', '05', '06', '07'];

  getKeywordManager = function() {
    var colors, kw2color;
    colors = getColorProvider(COLORS);
    kw2color = Object.create(null);
    return {
      add: function(keyword) {
        return kw2color[keyword] = colors.getNext();
      },
      "delete": function(keyword) {
        return delete kw2color[keyword];
      },
      has: function(keyword) {
        return keyword in kw2color;
      },
      reset: function(keyword) {
        kw2color = Object.create(null);
        return colors.reset();
      },
      each: function(fn) {
        var color, keyword, _results;
        _results = [];
        for (keyword in kw2color) {
          color = kw2color[keyword];
          _results.push(fn(keyword, color));
        }
        return _results;
      }
    };
  };

  getEditor = function() {
    return atom.workspace.getActiveTextEditor();
  };

  getView = function(model) {
    return atom.views.getView(model);
  };

  getVisibleEditor = function() {
    var e, p, _i, _len, _ref1, _results;
    _ref1 = atom.workspace.getPanes();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      p = _ref1[_i];
      if (e = p.getActiveEditor()) {
        _results.push(e);
      }
    }
    return _results;
  };

  getConfig = function(name) {
    return atom.config.get("quick-highlight." + name);
  };

  observeConfig = function(name, fn) {
    return atom.config.observe("quick-highlight." + name, fn);
  };

  getVisibleBufferRange = function(editor) {
    var editorElement, endRow, startRow, visibleRowRange, _ref1;
    editorElement = getView(editor);
    if (!(visibleRowRange = editorElement.getVisibleRowRange())) {
      return null;
    }
    _ref1 = visibleRowRange.map(function(row) {
      return editor.bufferRowForScreenRow(row);
    }), startRow = _ref1[0], endRow = _ref1[1];
    if (isNaN(startRow) || isNaN(endRow)) {
      return null;
    }
    return new Range([startRow, 0], [endRow, Infinity]);
  };

  module.exports = {
    config: Config,
    activate: function(state) {
      var debouncedhighlightSelection, subs;
      this.subscriptions = subs = new CompositeDisposable;
      this.emitter = new Emitter;
      this.decorationsByEditor = new Map;
      this.keywords = getKeywordManager();
      this.statusBarManager = new StatusBarManager;
      subs.add(atom.commands.add('atom-text-editor', {
        'quick-highlight:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'quick-highlight:clear': (function(_this) {
          return function() {
            return _this.clear();
          };
        })(this)
      }));
      debouncedhighlightSelection = null;
      observeConfig('highlightSelectionDelay', (function(_this) {
        return function(delay) {
          return debouncedhighlightSelection = _.debounce(_this.highlightSelection.bind(_this), delay);
        };
      })(this));
      subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var editorElement, editorSubs;
          editorSubs = new CompositeDisposable;
          editorSubs.add(editor.onDidStopChanging(function() {
            var URI, e, _i, _len, _ref1, _results;
            if (getEditor() !== editor) {
              return;
            }
            URI = editor.getURI();
            _ref1 = getVisibleEditor();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              e = _ref1[_i];
              if (e.getURI() === URI) {
                _results.push(_this.refreshEditor(e));
              }
            }
            return _results;
          }));
          editorElement = getView(editor);
          editorSubs.add(editorElement.onDidChangeScrollTop(function() {
            return _this.refreshEditor(editor);
          }));
          editorSubs.add(editorElement.onDidAttach(function() {
            return _this.refreshEditor(editor);
          }));
          editorSubs.add(editor.onDidChangeSelectionRange(function(_arg) {
            var selection;
            selection = _arg.selection;
            if (selection.isLastSelection()) {
              return debouncedhighlightSelection(editor);
            }
          }));
          editorSubs.add(editorElement.onDidChangeScrollTop(function() {
            return _this.highlightSelection(editor);
          }));
          editorSubs.add(editor.onDidDestroy(function() {
            _this.clearEditor(editor);
            editorSubs.dispose();
            return subs.remove(editorSubs);
          }));
          return subs.add(editorSubs);
        };
      })(this)));
      return subs.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          _this.statusBarManager.clear();
          if ((item != null ? item.getText : void 0) != null) {
            _this.refreshEditor(item);
            return _this.highlightSelection(item);
          }
        };
      })(this)));
    },
    clearSelectionDecoration: function() {
      var d, _i, _len, _ref1, _ref2;
      _ref2 = (_ref1 = this.selectionDecorations) != null ? _ref1 : [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        d = _ref2[_i];
        d.getMarker().destroy();
      }
      return this.selectionDecorations = null;
    },
    shouldExcludeEditor: function(editor) {
      var className, classNames, classes, containsCount, editorElement, scopes, _i, _j, _len, _len1;
      editorElement = getView(editor);
      scopes = getConfig('highlightSelectionExcludeScopes');
      classes = scopes.map(function(scope) {
        return scope.split('.');
      });
      for (_i = 0, _len = classes.length; _i < _len; _i++) {
        classNames = classes[_i];
        containsCount = 0;
        for (_j = 0, _len1 = classNames.length; _j < _len1; _j++) {
          className = classNames[_j];
          if (editorElement.classList.contains(className)) {
            containsCount += 1;
          }
        }
        if (containsCount === classNames.length) {
          return true;
        }
      }
      return false;
    },
    highlightSelection: function(editor) {
      var keyword, scanRange, selection;
      this.clearSelectionDecoration();
      if (this.shouldExcludeEditor(editor)) {
        return;
      }
      selection = editor.getLastSelection();
      if (!this.needToHighlightSelection(selection)) {
        return;
      }
      keyword = selection.getText();
      if (!(scanRange = getVisibleBufferRange(editor))) {
        return;
      }
      return this.selectionDecorations = this.highlightKeyword(editor, scanRange, keyword, 'box-selection');
    },
    needToHighlightSelection: function(selection) {
      switch (false) {
        case !(!getConfig('highlightSelection')):
        case !selection.isEmpty():
        case !!selection.getBufferRange().isSingleLine():
        case !(selection.getText().length < getConfig('highlightSelectionMinimumLength')):
        case !allWhiteSpaceRegExp.test(selection.getText()):
          return false;
        default:
          return true;
      }
    },
    deactivate: function() {
      var _ref1;
      this.clear();
      this.clearSelectionDecoration();
      this.subscriptions.dispose();
      return _ref1 = {}, this.decorationsByEditor = _ref1.decorationsByEditor, this.subscriptions = _ref1.subscriptions, this.keywords = _ref1.keywords, _ref1;
    },
    toggle: function() {
      var e, editor, keyword, point, _i, _len, _ref1;
      editor = getEditor();
      point = editor.getCursorBufferPosition();
      keyword = editor.getSelectedText() || editor.getWordUnderCursor();
      if (this.keywords.has(keyword)) {
        this.keywords["delete"](keyword);
        this.statusBarManager.clear();
      } else {
        this.keywords.add(keyword);
        if (getConfig('displayCountOnStatusBar')) {
          this.statusBarManager.update(this.getCountForKeyword(editor, keyword));
        }
      }
      _ref1 = getVisibleEditor();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        this.refreshEditor(e);
      }
      return editor.setCursorBufferPosition(point);
    },
    refreshEditor: function(editor) {
      this.clearEditor(editor);
      return this.renderEditor(editor);
    },
    renderEditor: function(editor) {
      var decorationStyle, decorations, scanRange;
      if (!(scanRange = getVisibleBufferRange(editor))) {
        return;
      }
      decorations = [];
      decorationStyle = getConfig('decorate');
      this.keywords.each((function(_this) {
        return function(keyword, color) {
          color = "" + decorationStyle + "-" + color;
          return decorations = decorations.concat(_this.highlightKeyword(editor, scanRange, keyword, color));
        };
      })(this));
      return this.decorationsByEditor.set(editor, decorations);
    },
    highlightKeyword: function(editor, scanRange, keyword, color) {
      var decorations, klass, pattern;
      if (!editor.isAlive()) {
        return [];
      }
      klass = "quick-highlight " + color;
      pattern = RegExp("" + (_.escapeRegExp(keyword)), "g");
      decorations = [];
      editor.scanInBufferRange(pattern, scanRange, (function(_this) {
        return function(_arg) {
          var range;
          range = _arg.range;
          return decorations.push(_this.decorateRange(editor, range, {
            "class": klass
          }));
        };
      })(this));
      return decorations;
    },
    clearEditor: function(editor) {
      var d, _i, _len, _ref1;
      if (this.decorationsByEditor.has(editor)) {
        _ref1 = this.decorationsByEditor.get(editor);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          d = _ref1[_i];
          d.getMarker().destroy();
        }
        return this.decorationsByEditor["delete"](editor);
      }
    },
    clear: function() {
      this.decorationsByEditor.forEach((function(_this) {
        return function(decorations, editor) {
          return _this.clearEditor(editor);
        };
      })(this));
      this.decorationsByEditor.clear();
      this.keywords.reset();
      return this.statusBarManager.clear();
    },
    decorateRange: function(editor, range, options) {
      var marker;
      marker = editor.markBufferRange(range, {
        invalidate: 'inside',
        persistent: false
      });
      return editor.decorateMarker(marker, {
        type: 'highlight',
        "class": options["class"]
      });
    },
    getCountForKeyword: function(editor, keyword) {
      var count;
      count = 0;
      editor.scan(RegExp("" + (_.escapeRegExp(keyword)), "g"), function() {
        return count++;
      });
      return count;
    },
    consumeStatusBar: function(statusBar) {
      this.statusBarManager.initialize(statusBar);
      this.statusBarManager.attach();
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.statusBarManager.detach();
          return _this.statusBarManager = null;
        };
      })(this)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL3F1aWNrLWhpZ2hsaWdodC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMk9BQUE7O0FBQUEsRUFBQSxPQUFvRCxPQUFBLENBQVEsTUFBUixDQUFwRCxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLEVBQWtDLGVBQUEsT0FBbEMsRUFBMkMsYUFBQSxLQUEzQyxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUlBLG1CQUFBLEdBQXNCLE9BSnRCLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLE1BR0EsTUFBQSxFQUFNLENBQUMsS0FBRCxFQUFRLFdBQVIsQ0FITjtBQUFBLE1BSUEsV0FBQSxFQUFhLCtCQUpiO0tBREY7QUFBQSxJQU1BLGtCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7S0FQRjtBQUFBLElBVUEsK0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsQ0FGVDtBQUFBLE1BR0EsV0FBQSxFQUFhLDZDQUhiO0tBWEY7QUFBQSxJQWVBLCtCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUFQO0FB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

//# sourceURL=/Users/david/.atom/packages/quick-highlight/lib/main.coffee
