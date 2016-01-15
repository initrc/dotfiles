(function() {
  var CompositeDisposable, SymbolIndex, fs, generate, minimatch, path, utils, _;

  fs = require('fs');

  path = require('path');

  _ = require('underscore');

  minimatch = require('minimatch');

  generate = require('./symbol-generator');

  utils = require('./symbol-utils');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = SymbolIndex = (function() {
    function SymbolIndex(entries) {
      var n, _ref, _ref1, _ref2;
      this.entries = {};
      this.rescanDirectories = true;
      this.roots = atom.project.getDirectories();
      this.getProjectRepositories();
      this.ignoredNames = (_ref = atom.config.get('core.ignoredNames')) != null ? _ref : [];
      if (typeof this.ignoredNames === 'string') {
        this.ignoredNames = [ignoredNames];
      }
      this.logToConsole = (_ref1 = atom.config.get('goto.logToConsole')) != null ? _ref1 : false;
      this.moreIgnoredNames = (_ref2 = atom.config.get('goto.moreIgnoredNames')) != null ? _ref2 : '';
      this.moreIgnoredNames = (function() {
        var _i, _len, _ref3, _results;
        _ref3 = this.moreIgnoredNames.split(/[, \t]+/);
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          n = _ref3[_i];
          if (n != null ? n.length : void 0) {
            _results.push(n);
          }
        }
        return _results;
      }).call(this);
      this.noGrammar = {};
      this.disposables = new CompositeDisposable;
      this.subscribe();
    }

    SymbolIndex.prototype.invalidate = function() {
      this.entries = {};
      return this.rescanDirectories = true;
    };

    SymbolIndex.prototype.subscribe = function() {
      this.disposables.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          _this.roots = atom.project.getDirectories();
          _this.getProjectRepositories();
          return _this.invalidate();
        };
      })(this)));
      atom.config.observe('core.ignoredNames', (function(_this) {
        return function() {
          var _ref;
          _this.ignoredNames = (_ref = atom.config.get('core.ignoredNames')) != null ? _ref : [];
          if (typeof _this.ignoredNames === 'string') {
            _this.ignoredNames = [ignoredNames];
          }
          return _this.invalidate();
        };
      })(this));
      atom.config.observe('goto.moreIgnoredNames', (function(_this) {
        return function() {
          var n, _ref;
          _this.moreIgnoredNames = (_ref = atom.config.get('goto.moreIgnoredNames')) != null ? _ref : '';
          _this.moreIgnoredNames = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = this.moreIgnoredNames.split(/[, \t]+/);
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              n = _ref1[_i];
              if (n != null ? n.length : void 0) {
                _results.push(n);
              }
            }
            return _results;
          }).call(_this);
          return _this.invalidate();
        };
      })(this));
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var editor_disposables;
          editor_disposables = new CompositeDisposable;
          editor_disposables.add(editor.onDidChangeGrammar(function() {
            return _this.entries[editor.getPath()] = null;
          }));
          editor_disposables.add(editor.onDidStopChanging(function() {
            return _this.entries[editor.getPath()] = null;
          }));
          return editor_disposables.add(editor.onDidDestroy(function() {
            return editor_disposables.dispose();
          }));
        };
      })(this));
    };

    SymbolIndex.prototype.destroy = function() {
      this.entries = null;
      return this.disposables.dispose();
    };

    SymbolIndex.prototype.getEditorSymbols = function(editor) {
      var fqn;
      fqn = editor.getPath();
      if (!this.entries[fqn] && this.keepPath(fqn)) {
        this.entries[fqn] = generate(fqn, editor.getGrammar(), editor.getText());
      }
      return this.entries[fqn];
    };

    SymbolIndex.prototype.getAllSymbols = function() {
      var fqn, s, symbols, _ref;
      this.update();
      s = [];
      _ref = this.entries;
      for (fqn in _ref) {
        symbols = _ref[fqn];
        Array.prototype.push.apply(s, symbols);
      }
      return s;
    };

    SymbolIndex.prototype.update = function() {
      var fqn, symbols, _ref, _results;
      if (this.rescanDirectories) {
        return this.rebuild();
      } else {
        _ref = this.entries;
        _results = [];
        for (fqn in _ref) {
          symbols = _ref[fqn];
          if (symbols === null && this.keepPath(fqn)) {
            _results.push(this.processFile(fqn));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    SymbolIndex.prototype.rebuild = function() {
      var root, _i, _len, _ref;
      _ref = this.roots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        root = _ref[_i];
        this.processDirectory(root.path);
      }
      this.rescanDirectories = false;
      if (this.logToConsole) {
        return console.log('No Grammar:', Object.keys(this.noGrammar));
      }
    };

    SymbolIndex.prototype.gotoDeclaration = function() {
      var editor, filePath, fqn, matches, symbols, word, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor != null) {
        editor.selectWordsContainingCursors();
      }
      word = editor != null ? editor.getSelectedText() : void 0;
      if (!(word != null ? word.length : void 0)) {
        return null;
      }
      this.update();
      filePath = editor.getPath();
      matches = [];
      this.matchSymbol(matches, word, this.entries[filePath]);
      _ref = this.entries;
      for (fqn in _ref) {
        symbols = _ref[fqn];
        if (fqn !== filePath) {
          this.matchSymbol(matches, word, symbols);
        }
      }
      if (matches.length === 0) {
        return null;
      }
      if (matches.length > 1) {
        return matches;
      }
      return utils.gotoSymbol(matches[0]);
    };

    SymbolIndex.prototype.matchSymbol = function(matches, word, symbols) {
      var symbol, _i, _len, _results;
      if (symbols) {
        _results = [];
        for (_i = 0, _len = symbols.length; _i < _len; _i++) {
          symbol = symbols[_i];
          if (symbol.name === word) {
            _results.push(matches.push(symbol));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    SymbolIndex.prototype.getProjectRepositories = function() {
      return Promise.all(this.roots.map(atom.project.repositoryForDirectory.bind(atom.project))).then((function(_this) {
        return function(repos) {
          return _this.repos = repos;
        };
      })(this));
    };

    SymbolIndex.prototype.processDirectory = function(dirPath) {
      var dir, dirs, entries, entry, fqn, stats, _i, _j, _len, _len1, _results;
      if (this.logToConsole) {
        console.log('GOTO: directory', dirPath);
      }
      entries = fs.readdirSync(dirPath);
      dirs = [];
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        entry = entries[_i];
        fqn = path.join(dirPath, entry);
        stats = fs.statSync(fqn);
        if (this.keepPath(fqn, stats.isFile())) {
          if (stats.isDirectory()) {
            dirs.push(fqn);
          } else if (stats.isFile()) {
            this.processFile(fqn);
          }
        }
      }
      entries = null;
      _results = [];
      for (_j = 0, _len1 = dirs.length; _j < _len1; _j++) {
        dir = dirs[_j];
        _results.push(this.processDirectory(dir));
      }
      return _results;
    };

    SymbolIndex.prototype.processFile = function(fqn) {
      var grammar, text;
      if (this.logToConsole) {
        console.log('GOTO: file', fqn);
      }
      text = fs.readFileSync(fqn, {
        encoding: 'utf8'
      });
      grammar = atom.grammars.selectGrammar(fqn, text);
      if ((grammar != null ? grammar.scopeName : void 0) !== 'text.plain.null-grammar') {
        return this.entries[fqn] = generate(fqn, grammar, text);
      } else {
        return this.noGrammar[path.extname(fqn)] = true;
      }
    };

    SymbolIndex.prototype.keepPath = function(filePath, isFile) {
      var base, ext, glob, repo, _i, _j, _len, _len1, _ref, _ref1;
      if (isFile == null) {
        isFile = true;
      }
      base = path.basename(filePath);
      ext = path.extname(base);
      if (isFile && (this.noGrammar[ext] != null)) {
        if (this.logToConsole) {
          console.log('GOTO: ignore/grammar', filePath);
        }
        return false;
      }
      _ref = this.moreIgnoredNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        glob = _ref[_i];
        if (minimatch(base, glob)) {
          if (this.logToConsole) {
            console.log('GOTO: ignore/core', filePath);
          }
          return false;
        }
      }
      if (_.contains(this.ignoredNames, base)) {
        if (this.logToConsole) {
          console.log('GOTO: ignore/core', filePath);
        }
        return false;
      }
      if (ext && _.contains(this.ignoredNames, '*#{ext}')) {
        if (this.logToConsole) {
          console.log('GOTO: ignore/core', filePath);
        }
        return false;
      }
      if (this.repos) {
        _ref1 = this.repos;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          repo = _ref1[_j];
          if (repo != null ? repo.isPathIgnored(filePath) : void 0) {
            if (this.logToConsole) {
              console.log('GOTO: ignore/git', filePath);
            }
            return false;
          }
        }
      }
      return true;
    };

    return SymbolIndex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dvdG8vbGliL3N5bWJvbC1pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEseUVBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGdCQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU1DLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFORCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUMsT0FBRCxHQUFBO0FBRVgsVUFBQSxxQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFYLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQVByQixDQUFBO0FBQUEsTUFxQkEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQXJCVCxDQUFBO0FBQUEsTUFzQkEsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0F0QkEsQ0FBQTtBQUFBLE1Bd0JBLElBQUMsQ0FBQSxZQUFELGtFQUF1RCxFQXhCdkQsQ0FBQTtBQXlCQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxZQUFSLEtBQXdCLFFBQTNCO0FBQ0UsUUFBQSxJQUFDLENB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

//# sourceURL=/Users/david/.atom/packages/goto/lib/symbol-index.coffee
