(function() {
  var os, vm;

  vm = require('vm');

  os = require('os');


  /*
    == ATOM-TERMINAL-PANEL  UI PLUGIN ==
  
    Atom-terminal-panel builtin plugin v1.0.0
    -isis97
  
    Contains commands for creating user interface components
    (e.g. bars etc.)
  
    MIT License
    Feel free to do anything with this file.
   */

  module.exports = {
    "ui-clock": {
      "description": "Displays the dynamic clock.",
      "command": function(state) {
        return state.exec("echo %(raw) %(dynamic) %(^#FF851B) %(hours12):%(minutes):%(seconds) %(ampm) %(^)", [], state);
      }
    },
    "ui-mem": {
      "description": "Displays the dynamic memory usage information",
      "command": function(state) {
        return state.exec("echo %(raw) %(dynamic) %(^#FF851B) Free memory/available memory: %(os.freemem)B / %(os.totalmem)B %(^)", [], state);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9jb21tYW5kcy91aS9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUdBO0FBQUE7Ozs7Ozs7Ozs7O0tBSEE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSw2QkFBZjtBQUFBLE1BQ0EsU0FBQSxFQUFXLFNBQUMsS0FBRCxHQUFBO2VBQ1QsS0FBSyxDQUFDLElBQU4sQ0FBVyxrRkFBWCxFQUErRixFQUEvRixFQUFtRyxLQUFuRyxFQURTO01BQUEsQ0FEWDtLQURGO0FBQUEsSUFJQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSwrQ0FBZjtBQUFBLE1BQ0EsU0FBQSxFQUFXLFNBQUMsS0FBRCxHQUFBO2VBQ1QsS0FBSyxDQUFDLElBQU4sQ0FBVyx3R0FBWCxFQUFxSCxFQUFySCxFQUF5SCxLQUF6SCxFQURTO01BQUEsQ0FEWDtLQUxGO0dBaEJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/commands/ui/index.coffee
