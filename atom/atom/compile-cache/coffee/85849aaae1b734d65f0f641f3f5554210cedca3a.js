(function() {
  var Point, cleanSymbol, isbefore, issymbol, mergeAdjacent, rebefore, resym;

  Point = require('atom').Point;

  resym = /^(entity.name.type.class|entity.name.function|entity.other.attribute-name.class)/;

  rebefore = /^(meta.rspec.behaviour)/;

  module.exports = function(path, grammar, text) {
    var lineno, lines, nextIsSymbol, offset, prev, symbol, symbols, token, tokens, _i, _j, _len, _len1;
    lines = grammar.tokenizeLines(text);
    symbols = [];
    nextIsSymbol = false;
    for (lineno = _i = 0, _len = lines.length; _i < _len; lineno = ++_i) {
      tokens = lines[lineno];
      offset = 0;
      prev = null;
      for (_j = 0, _len1 = tokens.length; _j < _len1; _j++) {
        token = tokens[_j];
        if (nextIsSymbol || issymbol(token)) {
          nextIsSymbol = false;
          symbol = cleanSymbol(token);
          if (symbol) {
            if (!mergeAdjacent(prev, token, symbols, offset)) {
              symbols.push({
                name: token.value,
                path: path,
                position: new Point(lineno, offset)
              });
              prev = token;
            }
          }
        }
        nextIsSymbol = isbefore(token);
        offset += token.value.length;
      }
    }
    return symbols;
  };

  cleanSymbol = function(token) {
    var name;
    name = token.value.trim().replace(/"/g, '');
    return name || null;
  };

  issymbol = function(token) {
    var scope, _i, _len, _ref;
    if (token.value.trim().length && token.scopes) {
      _ref = token.scopes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scope = _ref[_i];
        if (resym.test(scope)) {
          return true;
        }
      }
    }
    return false;
  };

  isbefore = function(token) {
    var scope, _i, _len, _ref;
    if (token.value.trim().length && token.scopes) {
      _ref = token.scopes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scope = _ref[_i];
        console.log('checking', scope, '=', rebefore.test(scope));
        if (rebefore.test(scope)) {
          return true;
        }
      }
    }
    return false;
  };

  mergeAdjacent = function(prevToken, thisToken, symbols, offset) {
    var prevSymbol;
    if (offset && prevToken) {
      prevSymbol = symbols[symbols.length - 1];
      if (offset === prevSymbol.position.column + prevToken.value.length) {
        prevSymbol.name += thisToken.value;
        return true;
      }
    }
    return false;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dvdG8vbGliL3N5bWJvbC1nZW5lcmF0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHNFQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUtBLEtBQUEsR0FBUSxrRkFMUixDQUFBOztBQUFBLEVBYUEsUUFBQSxHQUFZLHlCQWJaLENBQUE7O0FBQUEsRUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixJQUFoQixHQUFBO0FBQ2YsUUFBQSw4RkFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxhQUFSLENBQXNCLElBQXRCLENBQVIsQ0FBQTtBQUFBLElBRUEsT0FBQSxHQUFVLEVBRlYsQ0FBQTtBQUFBLElBSUEsWUFBQSxHQUFlLEtBSmYsQ0FBQTtBQU1BLFNBQUEsOERBQUE7NkJBQUE7QUFDRSxNQUFBLE1BQUEsR0FBUyxDQUFULENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQURQLENBQUE7QUFFQSxXQUFBLCtDQUFBOzJCQUFBO0FBQ0UsUUFBQSxJQUFHLFlBQUEsSUFBZ0IsUUFBQSxDQUFTLEtBQVQsQ0FBbkI7QUFDRSxVQUFBLFlBQUEsR0FBZSxLQUFmLENBQUE7QUFBQSxVQUVBLE1BQUEsR0FBUyxXQUFBLENBQVksS0FBWixDQUZULENBQUE7QUFHQSxVQUFBLElBQUcsTUFBSDtBQUNFLFlBQUEsSUFBRyxDQUFBLGFBQUksQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLEVBQTJCLE9BQTNCLEVBQW9DLE1BQXBDLENBQVA7QUFDRSxjQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWE7QUFBQSxnQkFBRSxJQUFBLEVBQU0sS0FBSyxDQUFDLEtBQWQ7QUFBQSxnQkFB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

//# sourceURL=/Users/david/.atom/packages/goto/lib/symbol-generator.coffee
