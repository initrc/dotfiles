(function() {
  var os, vm;

  vm = require('vm');

  os = require('os');


  /*
    == ATOM-TERMINAL-PANEL  UTILS PLUGIN ==
  
    Atom-terminal-panel builtin plugin v1.0.0
    -isis97
  
    Contains commands for easier console usage.
  
    MIT License
    Feel free to do anything with this file.
   */

  module.exports = {
    "tmpdir": {
      "description": "Describes current machine.",
      "variable": function(state) {
        return os.tmpdir();
      }
    },
    "whoami": {
      "description": "Describes the current machine.",
      "variable": function(state) {
        return os.hostname() + ' [' + os.platform() + ' ; ' + os.type() + ' ' + os.release() + ' (' + os.arch() + ' x' + os.cpus().length + ')' + '] ' + (process.env.USERNAME || process.env.LOGNAME || process.env.USER);
      }
    },
    "os.hostname": {
      "description": "Returns the hostname of the operating system.",
      "variable": function(state) {
        return os.hostname();
      }
    },
    "os.type": {
      "description": "Returns the operating system name.",
      "variable": function(state) {
        return os.type();
      }
    },
    "os.platform": {
      "description": "Returns the operating system platform.",
      "variable": function(state) {
        return os.platform();
      }
    },
    "os.arch": {
      "description": 'Returns the operating system CPU architecture. Possible values are "x64", "arm" and "ia32".',
      "variable": function(state) {
        return os.arch();
      }
    },
    "os.release": {
      "description": "Returns the operating system release.",
      "variable": function(state) {
        return os.release();
      }
    },
    "os.uptime": {
      "description": "Returns the system uptime in seconds.",
      "variable": function(state) {
        return os.uptime();
      }
    },
    "os.totalmem": {
      "description": "Returns the total amount of system memory in bytes.",
      "variable": function(state) {
        return os.totalmem();
      }
    },
    "os.freemem": {
      "description": "Returns the amount of free system memory in bytes.",
      "variable": function(state) {
        return os.freemem();
      }
    },
    "os.cpus": {
      "description": "Returns the node.js JSON-format information about CPUs characteristics.",
      "variable": function(state) {
        return JSON.stringify(os.cpus());
      }
    },
    "terminal": {
      "description": "Shows the native terminal in the current location.",
      "command": function(state, args) {
        var o;
        o = state.util.os();
        if (o.windows) {
          return state.exec('start cmd.exe', args, state);
        } else {
          return state.message('%(label:error:Error) The "terminal" command is currently not supported on platforms other than windows.');
        }
      }
    },
    "settings": {
      "description": "Shows the ATOM settings.",
      "command": function(state, args) {
        return state.exec('application:show-settings', args, state);
      }
    },
    "eval": {
      "description": "Evaluates any javascript code.",
      "params": "[CODE]",
      "command": function(state, args) {
        vm.runInThisContext(args[0]);
        return null;
      }
    },
    "web": {
      "description": "Shows any web page.",
      "params": "[ADDRESS]",
      "command": function(state, args) {
        var address;
        address = args.join(' ');
        state.message("<iframe style='height:3000%;width:90%;' src='http://www." + address + "'></iframe>");
        return null;
      }
    },
    "web-atom": {
      "description": "Shows any web page.",
      "params": "[ADDRESS]",
      "command": function(state, args) {
        var query;
        query = args.join(' ');
        state.message("<iframe style='height:3000%;width:90%;' src='https://atom.io/packages/search?q=" + query + "'></iframe>");
        return null;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9jb21tYW5kcy91dGlscy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUdBO0FBQUE7Ozs7Ozs7Ozs7S0FIQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLDRCQUFmO0FBQUEsTUFDQSxVQUFBLEVBQVksU0FBQyxLQUFELEdBQUE7ZUFBVyxFQUFFLENBQUMsTUFBSCxDQUFBLEVBQVg7TUFBQSxDQURaO0tBREY7QUFBQSxJQUdBLFFBQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLGdDQUFmO0FBQUEsTUFDQSxVQUFBLEVBQVksU0FBQyxLQUFELEdBQUE7ZUFBVyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQUEsR0FBZ0IsSUFBaEIsR0FBdUIsRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUF2QixHQUF1QyxLQUF2QyxHQUErQyxFQUFFLENBQUMsSUFBSCxDQUFBLENBQS9DLEdBQTJELEdBQTNELEdBQWlFLEVBQUUsQ0FBQyxPQUFILENBQUEsQ0FBakUsR0FBZ0YsSUFBaEYsR0FBdUYsRUFBRSxDQUFDLElBQUgsQ0FBQSxDQUF2RixHQUFtRyxJQUFuRyxHQUEwRyxFQUFFLENBQUMsSUFBSCxDQUFBLENBQVMsQ0FBQyxNQUFwSCxHQUE2SCxHQUE3SCxHQUFtSSxJQUFuSSxHQUEwSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBWixJQUF3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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/commands/utils/index.coffee
