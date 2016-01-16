(function() {
  var basename, exec, filenameMap, grammarMap, platform, plugin;

  basename = require('path').basename;

  exec = require('child_process').exec;

  platform = require('process').platform;

  grammarMap = require('./grammar-map');

  filenameMap = require('./filename-map');

  plugin = module.exports = {
    config: {
      grammars: {
        type: 'object',
        properties: {}
      },
      filenames: {
        type: 'object',
        properties: {}
      }
    },
    exec: exec,
    activate: function() {
      return atom.commands.add('atom-text-editor', {
        'dash:shortcut': (function(_this) {
          return function() {
            return _this.shortcut(true, false);
          };
        })(this),
        'dash:shortcut-background': (function(_this) {
          return function() {
            return _this.shortcut(true, true);
          };
        })(this),
        'dash:shortcut-alt': (function(_this) {
          return function() {
            return _this.shortcut(false, false);
          };
        })(this),
        'dash:shortcut-alt-background': (function(_this) {
          return function() {
            return _this.shortcut(false, true);
          };
        })(this),
        'dash:context-menu': (function(_this) {
          return function() {
            return _this.shortcut(true, false);
          };
        })(this)
      });
    },
    shortcut: function(sensitive, background) {
      var callback, editor, selection;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      selection = editor.getLastSelection().getText();
      callback = (function(_this) {
        return function(error) {
          if (error) {
            return atom.notifications.addError('Unable to launch Dash', {
              dismissable: true,
              detail: error.message
            });
          }
        };
      })(this);
      if (selection) {
        return plugin.search(selection, sensitive, background, callback);
      }
      return plugin.search(editor.getWordUnderCursor(), sensitive, background, callback);
    },
    search: function(string, sensitive, background, cb) {
      var activeEditor, cmd, language, path;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (sensitive && activeEditor) {
        path = activeEditor.getPath();
        language = activeEditor.getGrammar().name;
      }
      cmd = this.getCommand(string, path, language, background);
      return plugin.exec(cmd, cb);
    },
    getCommand: function(string, path, language, background) {
      var uri;
      uri = this.getDashURI(string, path, language, background);
      if (platform === 'win32') {
        return 'cmd.exe /c start "" "' + uri + '"';
      }
      if (platform === 'linux') {
        return 'xdg-open "' + uri + '"';
      }
      return 'open -g "' + uri + '"';
    },
    getKeywordString: function(path, language) {
      var filename, filenameConfig, grammarConfig, keys;
      keys = [];
      if (path) {
        filename = basename(path).toLowerCase();
        filenameConfig = atom.config.get('dash.filenames') || {};
        keys = keys.concat(filenameConfig[filename] || filenameMap[filename] || []);
      }
      if (language) {
        grammarConfig = atom.config.get('dash.grammars') || {};
        keys = keys.concat(grammarConfig[language] || grammarMap[language] || []);
      }
      if (keys.length) {
        return keys.map(encodeURIComponent).join(',');
      }
    },
    getDashURI: function(string, path, language, background) {
      var keywords, link;
      link = 'dash-plugin://query=' + encodeURIComponent(string);
      keywords = this.getKeywordString(path, language);
      if (keywords) {
        link += '&keys=' + keywords;
      }
      if (background) {
        link += '&prevent_activation=true';
      }
      return link;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvZGFzaC9saWIvZGFzaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseURBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLFFBQTNCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxJQURoQyxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUMsUUFGOUIsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUhiLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBSmQsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxHQUdQO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFBWSxFQURaO09BREY7QUFBQSxNQUdBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFBWSxFQURaO09BSkY7S0FERjtBQUFBLElBU0EsSUFBQSxFQUFNLElBVE47QUFBQSxJQVdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO0FBQUEsUUFDcEMsZUFBQSxFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBTSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBTjtVQUFBLEVBQUE7UUFB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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/dash/lib/dash.coffee
