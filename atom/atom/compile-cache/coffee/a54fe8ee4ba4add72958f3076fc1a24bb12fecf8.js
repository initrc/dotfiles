(function() {
  var math_parser_sandbox, vm;

  vm = require('vm');

  require('./jquery.jqplot.min.js');


  /*
    == ATOM-TERMINAL-PANEL  UTILS PLUGIN ==
  
    Atom-terminal-panel builtin plugin v1.0.0
    -isis97
  
    Contains commands for math graphs plotting etc.
    Supports math function plotting (using JQPlot).
  
    MIT License
    Feel free to do anything with this file.
   */

  math_parser_sandbox = {
    sin: Math.sin,
    cos: Math.cos,
    ceil: Math.ceil,
    floor: Math.floor,
    PI: Math.PI,
    E: Math.E,
    tan: Math.tan,
    sqrt: Math.sqrt,
    pow: Math.pow,
    log: Math.log,
    round: Math.round
  };

  vm.createContext(math_parser_sandbox);

  module.exports = {
    "plot": {
      "description": "Plots math function using JQPlot.",
      "params": "<[FROM] [TO]> [CODE]",
      "example": "plot 0 10 sin(x)",
      "command": function(state, args) {
        var from, i, id, points, step, to, _i;
        points = [];
        if (args.length < 3) {
          args[2] = args[0];
          args[0] = -25;
          args[1] = 25;
        }
        from = vm.runInThisContext(args[0]);
        to = vm.runInThisContext(args[1]);
        step = (to - from) / 500.0;
        for (i = _i = from; step > 0 ? _i <= to : _i >= to; i = _i += step) {
          math_parser_sandbox.x = i;
          points.push([i, vm.runInContext(args[2], math_parser_sandbox)]);
        }
        math_parser_sandbox.x = void 0;
        id = generateRandomID();
        state.message('<div style="height:300px; width:500px;padding-left:25px;" ><div id="chart-' + id + '"></div></div>');
        $.jqplot('chart-' + id, [points], {
          series: [
            {
              showMarker: false
            }
          ],
          title: 'Plotting f(x):=' + args[2],
          axes: {
            xaxis: {
              label: 'Angle (radians)',
              labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
              labelOptions: {
                fontFamily: 'Georgia, Serif',
                fontSize: '0pt'
              }
            },
            yaxis: {
              label: '',
              labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
              labelOptions: {
                fontFamily: 'Georgia, Serif',
                fontSize: '0pt'
              }
            }
          }
        });
        return null;
      }
    },
    "parse": {
      "description": "Parses mathematical expression.",
      "params": "[EXPRESSION]",
      "command": function(state, args) {
        state.message("Result: " + (vm.runInContext(args[0], math_parser_sandbox)));
        return null;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9jb21tYW5kcy9tYXRoL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxPQUFBLENBQVEsd0JBQVIsQ0FEQSxDQUFBOztBQUlBO0FBQUE7Ozs7Ozs7Ozs7O0tBSkE7O0FBQUEsRUFnQkEsbUJBQUEsR0FBc0I7QUFBQSxJQUNwQixHQUFBLEVBQUssSUFBSSxDQUFDLEdBRFU7QUFBQSxJQUVwQixHQUFBLEVBQUssSUFBSSxDQUFDLEdBRlU7QUFBQSxJQUdwQixJQUFBLEVBQU0sSUFBSSxDQUFDLElBSFM7QUFBQSxJQUlwQixLQUFBLEVBQU8sSUFBSSxDQUFDLEtBSlE7QUFBQSxJQUtwQixFQUFBLEVBQUksSUFBSSxDQUFDLEVBTFc7QUFBQSxJQU1wQixDQUFBLEVBQUcsSUFBSSxDQUFDLENBTlk7QUFBQSxJQU9wQixHQUFBLEVBQUssSUFBSSxDQUFDLEdBUFU7QUFBQSxJQVFwQixJQUFBLEVBQU0sSUFBSSxDQUFDLElBUlM7QUFBQSxJQVNwQixHQUFBLEVBQUssSUFBSSxDQUFDLEdBVFU7QUFBQSxJQVVwQixHQUFBLEVBQUssSUFBSSxDQUFDLEdBVlU7QUFBQSxJQVdwQixLQUFBLEVBQU8sSUFBSSxDQUFDLEtBWFE7R0FoQnRCLENBQUE7O0FBQUEsRUE2QkEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsbUJBQWpCLENBN0JBLENBQUE7O0FBQUEsRUErQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQWUsbUNBQWY7QUFBQSxNQUNB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/commands/math/index.coffee
