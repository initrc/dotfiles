(function() {
  var GotoView, SymbolIndex;

  SymbolIndex = require('./symbol-index');

  GotoView = require('./goto-view');

  module.exports = {
    configDefaults: {
      logToConsole: false,
      moreIgnoredNames: '',
      autoScroll: true
    },
    index: null,
    gotoView: null,
    activate: function(state) {
      this.index = new SymbolIndex(state != null ? state.entries : void 0);
      this.gotoView = new GotoView();
      return atom.commands.add('atom-workspace', {
        'mobile-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'goto:project-symbol': (function(_this) {
          return function() {
            return _this.gotoProjectSymbol();
          };
        })(this),
        'goto:file-symbol': (function(_this) {
          return function() {
            return _this.gotoFileSymbol();
          };
        })(this),
        'goto:declaration': (function(_this) {
          return function() {
            return _this.gotoDeclaration();
          };
        })(this),
        'goto:rebuild-index': (function(_this) {
          return function() {
            return _this.index.rebuild();
          };
        })(this),
        'goto:invalidate-index': (function(_this) {
          return function() {
            return _this.index.invalidate();
          };
        })(this)
      });
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.index) != null) {
        _ref.destroy();
      }
      this.index = null;
      if ((_ref1 = this.gotoView) != null) {
        _ref1.destroy();
      }
      return this.gotoView = null;
    },
    serialize: function() {
      return {
        entries: this.index.entries
      };
    },
    gotoDeclaration: function() {
      var symbols;
      symbols = this.index.gotoDeclaration();
      if (symbols && symbols.length) {
        return this.gotoView.populate(symbols);
      }
    },
    gotoProjectSymbol: function() {
      var symbols;
      symbols = this.index.getAllSymbols();
      return this.gotoView.populate(symbols);
    },
    gotoFileSymbol: function() {
      var editor, filePath, symbols;
      editor = atom.workspace.getActiveTextEditor();
      filePath = editor != null ? editor.getPath() : void 0;
      if (filePath) {
        symbols = this.index.getEditorSymbols(editor);
        return this.gotoView.populate(symbols, editor);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dvdG8vbGliL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLEtBQWQ7QUFBQSxNQUNBLGdCQUFBLEVBQWtCLEVBRGxCO0FBQUEsTUFFQSxVQUFBLEVBQVksSUFGWjtLQURGO0FBQUEsSUFLQSxLQUFBLEVBQU8sSUFMUDtBQUFBLElBTUEsUUFBQSxFQUFVLElBTlY7QUFBQSxJQVFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLFdBQUEsaUJBQVksS0FBSyxDQUFFLGdCQUFuQixDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFBLENBRGhCLENBQUE7YUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFDbEMsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUztBQUFBLFFBRWxDLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZXO0FBQUEsUUFHbEMsa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIYztBQUFBLFFBSWxDLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmM7QUFBQSxRQUtsQyxvQkFBQSxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMWTtBQUFBLFFBTWxDLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5TO09BQXBDLEVBSFE7SUFBQSxDQVJWO0FBQUEsSUFvQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsV0FBQTs7WUFBTSxDQUFFLE9BQVIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBRFQsQ0FBQTs7YUFFUyxDQUFFLE9BQVgsQ0FBQTtPQUZBO2FBR0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUpGO0lBQUEsQ0FwQlo7QUFBQSxJQTBCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQUc7QUFBQSxRQUFFLE9BQUEsRUFBUyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQWxCO1FBQUg7SUFBQSxDQTFCWDtBQUFBLElBNEJBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxlQUFQLENBQUEsQ0FBVixDQUFBO0FBQ0EsTUFBQSxJQUFHLE9BQUEsSUFBWSxPQUFPLENBQUMsTUFBdkI7ZUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsQ0FBbUIsT0FBbkIsRUFERjtPQUZlO0lBQUEsQ0E1QmpCO0FBQUEsSUFpQ0EsaUJBQUEsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsYUFBUCxDQUFBLENBQVYsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBVixDQUFtQixPQUFuQixFQUZpQjtJQUFBLENBakNuQjtBQUFBLElBcUNBLGNBQUEsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSx5QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFFBQUEsb0JBQVcsTUFBTSxDQUFFLE9BQVIsQ0FBQSxVQURYLENBQUE7QUFFQSxNQUFBLElBQUcsUUFBSDtBQUNFLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsQ0FBVixDQUFBO2VBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLE9BQW5CLEVBQTRCLE1BQTVCLEVBRkY7T0FIYztJQUFBLENBckNoQjtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/david/.atom/packages/goto/lib/index.coffee
