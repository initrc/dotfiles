(function() {
  var CompositeDisposable, Directory, cpConfigFileName, fs, helpers, path, voucher, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Directory = _ref.Directory, CompositeDisposable = _ref.CompositeDisposable;

  path = require('path');

  helpers = require('atom-linter');

  voucher = require('voucher');

  fs = require('fs');

  cpConfigFileName = '.classpath';

  module.exports = {
    config: {
      javaExecutablePath: {
        type: 'string',
        title: 'Path to the javac executable',
        "default": 'javac'
      },
      classpath: {
        type: 'string',
        title: "Extra classpath for javac",
        "default": ''
      }
    },
    activate: function() {
      require('atom-package-deps').install();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-javac.javaExecutablePath', (function(_this) {
        return function(newValue) {
          return _this.javaExecutablePath = newValue;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-javac.classpath', (function(_this) {
        return function(newValue) {
          return _this.classpath = newValue.trim();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      return {
        grammarScopes: ['source.java'],
        scope: 'project',
        lintOnFly: false,
        lint: (function(_this) {
          return function(textEditor) {
            var cp, cpConfig, filePath, searchDir, wd;
            filePath = textEditor.getPath();
            wd = path.dirname(filePath);
            searchDir = _this.getProjectRootDir();
            cp = null;
            cpConfig = _this.findClasspathConfig(wd);
            if (cpConfig != null) {
              wd = cpConfig.cfgDir;
              cp = cpConfig.cfgCp;
              searchDir = wd;
            }
            if (_this.classpath) {
              cp += path.delimiter + _this.classpath;
            }
            if (process.env.CLASSPATH) {
              cp += path.delimiter + process.env.CLASSPATH;
            }
            return atom.project.repositoryForDirectory(new Directory(searchDir)).then(function(repo) {
              return _this.getFilesEndingWith(searchDir, '.java', repo != null ? repo.isPathIgnored.bind(repo) : void 0);
            }).then(function(files) {
              var args;
              args = ['-Xlint:all'];
              if (cp != null) {
                args = args.concat(['-cp', cp]);
              }
              args.push.apply(args, files);
              return helpers.exec(_this.javaExecutablePath, args, {
                stream: 'stderr',
                cwd: wd
              }).then(function(val) {
                return _this.parse(val, textEditor);
              });
            });
          };
        })(this)
      };
    },
    parse: function(javacOutput, textEditor) {
      var caretRegex, column, errRegex, file, line, lineNum, lines, mess, messages, type, _i, _len, _ref1;
      errRegex = /^(.*\.java):(\d+): ([\w \-]+): (.+)/;
      caretRegex = /^( *)\^/;
      lines = javacOutput.split(/\r?\n/);
      messages = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.match(errRegex)) {
          _ref1 = line.match(errRegex).slice(1, 5), file = _ref1[0], lineNum = _ref1[1], type = _ref1[2], mess = _ref1[3];
          messages.push({
            type: type,
            text: mess,
            filePath: file,
            range: [[lineNum - 1, 0], [lineNum - 1, 0]]
          });
        } else if (line.match(caretRegex)) {
          column = line.match(caretRegex)[1].length;
          if (messages.length > 0) {
            messages[messages.length - 1].range[0][1] = column;
            messages[messages.length - 1].range[1][1] = column + 1;
          }
        }
      }
      return messages;
    },
    getProjectRootDir: function() {
      var textEditor;
      textEditor = atom.workspace.getActiveTextEditor();
      if (!textEditor || !textEditor.getPath()) {
        if (0 === atom.project.getPaths().length) {
          return false;
        }
        return atom.project.getPaths()[0];
      }
      return atom.project.getPaths().sort(function(a, b) {
        return b.length - a.length;
      }).find(function(p) {
        var realpath;
        realpath = fs.realpathSync(p);
        return textEditor.getPath().substr(0, realpath.length) === realpath;
      });
    },
    getFilesEndingWith: function(startPath, endsWith, ignoreFn) {
      var folderFiles, foundFiles;
      foundFiles = [];
      folderFiles = [];
      return voucher(fs.readdir, startPath).then(function(files) {
        folderFiles = files;
        return Promise.all(files.map(function(f) {
          var filename;
          filename = path.join(startPath, f);
          return voucher(fs.lstat, filename);
        }));
      }).then((function(_this) {
        return function(fileStats) {
          var mapped;
          mapped = fileStats.map(function(stats, i) {
            var filename;
            filename = path.join(startPath, folderFiles[i]);
            if (typeof ignoreFn === "function" ? ignoreFn(filename) : void 0) {
              return void 0;
            } else if (stats.isDirectory()) {
              return _this.getFilesEndingWith(filename, endsWith, ignoreFn);
            } else if (filename.endsWith(endsWith)) {
              return [filename];
            }
          });
          return Promise.all(mapped.filter(Boolean));
        };
      })(this)).then(function(fileArrays) {
        return [].concat.apply([], fileArrays);
      });
    },
    findClasspathConfig: function(d) {
      var e, file, result;
      while (atom.project.contains(d) || (__indexOf.call(atom.project.getPaths(), d) >= 0)) {
        try {
          file = path.join(d, cpConfigFileName);
          result = {
            cfgCp: fs.readFileSync(file, {
              encoding: 'utf-8'
            }),
            cfgDir: d
          };
          result.cfgCp = result.cfgCp.trim();
          return result;
        } catch (_error) {
          e = _error;
          d = path.dirname(d);
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvbGludGVyLWphdmFjL2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQyxpQkFBQSxTQUFELEVBQVksMkJBQUEsbUJBQVosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FGVixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxnQkFBQSxHQUFtQixZQUxuQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLDhCQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsT0FGVDtPQURGO0FBQUEsTUFJQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sMkJBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO09BTEY7S0FERjtBQUFBLElBVUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFE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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/linter-javac/lib/init.coffee
