
/*
  Atom-terminal-panel
  Copyright by isis97
  MIT licensed

  Terminal utility for doing simple stuff (like filesystem manip).
  The Util API can be accessed by the terminal plugins
  by calling state.util, e.g.
    "command": (state, args) ->
      state.util.rmdir './temp'
 */

(function() {
  var Util, dirname, extname, fs, resolve, sep, _ref;

  fs = include('fs');

  _ref = include('path'), resolve = _ref.resolve, dirname = _ref.dirname, extname = _ref.extname, sep = _ref.sep;

  Util = (function() {
    function Util() {}

    Util.prototype.os = function() {
      var isLinux, isMac, isWindows, osname;
      isWindows = false;
      isMac = false;
      isLinux = false;
      osname = process.platform || process.env.OS;
      if (/^win/igm.test(osname)) {
        isWindows = true;
      } else if (/^darwin/igm.test(osname)) {
        isMac = true;
      } else if (/^linux/igm.test(osname)) {
        isLinux = true;
      }
      return {
        windows: isWindows,
        mac: isMac,
        linux: isLinux
      };
    };

    Util.prototype.escapeRegExp = function(string) {
      if (string === null) {
        return null;
      }
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    Util.prototype.replaceAll = function(find, replace, str) {
      if (str == null) {
        return null;
      }
      if (str.replace == null) {
        return str;
      }
      return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    };

    Util.prototype.dir = function(paths, cwd) {
      var path, rcwd, ret, _i, _len;
      if (paths instanceof Array) {
        ret = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          ret.push(this.dir(path, cwd));
        }
        return ret;
      } else {

        /*
        if (paths.indexOf('./') == 0) or (paths.indexOf('.\\') == 0)
          return @replaceAll '\\', '/', (cwd + '/' + paths)
        else if (paths.indexOf('../') == 0) or (paths.indexOf('..\\') == 0)
          return @replaceAll '\\', '/', (cwd + '/../' + paths)
        else
          return paths
         */
        rcwd = resolve('.');
        if ((paths.indexOf('/') !== 0) && (paths.indexOf('\\') !== 0) && (paths.indexOf('./') !== 0) && (paths.indexOf('.\\') !== 0) && (paths.indexOf('../') !== 0) && (paths.indexOf('..\\') !== 0)) {
          return paths;
        } else {
          return this.replaceAll('\\', '/', this.replaceAll(rcwd + sep, '', this.replaceAll(rcwd + sep, '', resolve(cwd, paths))));
        }
      }
    };

    Util.prototype.getFileName = function(fullpath) {
      var matcher;
      if (fullpath != null) {
        matcher = /(.*:)((.*)(\\|\/))*/ig;
        return fullpath.replace(matcher, "");
      }
      return null;
    };

    Util.prototype.getFilePath = function(fullpath) {
      if (typeof fillpath === "undefined" || fillpath === null) {
        return null;
      }
      return this.replaceAll(this.getFileName(fullpath), "", fullpath);
    };

    Util.prototype.copyFile = function(sources, targets) {
      var source, _i, _len;
      if (targets instanceof Array) {
        if (targets[0] != null) {
          return this.copyFile(sources, targets[0]);
        }
        return 0;
      } else {
        if (sources instanceof Array) {
          for (_i = 0, _len = sources.length; _i < _len; _i++) {
            source = sources[_i];
            fs.createReadStream(resolve(source)).pipe(fs.createWriteStream(resolve(targets)));
          }
          return sources.length;
        } else {
          return this.copyFile([sources], targets);
        }
      }
    };

    Util.prototype.cp = function(sources, targets) {
      var e, isDir, ret, source, stat, target, _i, _j, _len, _len1;
      if (targets instanceof Array) {
        ret = 0;
        for (_i = 0, _len = targets.length; _i < _len; _i++) {
          target = targets[_i];
          ret += this.cp(sources, target);
        }
        return ret;
      } else {
        if (sources instanceof Array) {
          for (_j = 0, _len1 = sources.length; _j < _len1; _j++) {
            source = sources[_j];
            isDir = false;
            try {
              stat = fs.statSync(targets, function(e) {});
              isDir = stat.isDirectory();
            } catch (_error) {
              e = _error;
              isDir = false;
            }
            if (!isDir) {
              this.copyFile(source, targets);
            } else {
              this.copyFile(source, targets + '/' + (this.getFileName(source)));
            }
          }
          return sources.length;
        } else {
          return this.cp([sources], targets);
        }
      }
    };

    Util.prototype.mkdir = function(paths) {
      var path, ret, _i, _len;
      if (paths instanceof Array) {
        ret = '';
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          fs.mkdirSync(path, function(e) {});
          ret += 'Directory created \"' + path + '\"\n';
        }
        return ret;
      } else {
        return this.mkdir([paths]);
      }
    };

    Util.prototype.rmdir = function(paths) {
      var path, ret, _i, _len;
      if (paths instanceof Array) {
        ret = '';
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          fs.rmdirSync(path, function(e) {});
          ret += 'Directory removed \"' + path + '\"\n';
        }
        return ret;
      } else {
        return this.rmdir([paths]);
      }
    };

    Util.prototype.rename = function(oldpath, newpath) {
      fs.renameSync(oldpath, newpath, function(e) {});
      return 'File/directory renamed: ' + oldpath + '\n';
    };

    return Util;

  })();

  module.exports = new Util();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9saWIvYXRwLXRlcm1pbmFsLXV0aWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFhQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FiTCxDQUFBOztBQUFBLEVBY0EsT0FBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQyxlQUFBLE9BQUQsRUFBVSxlQUFBLE9BQVYsRUFBbUIsZUFBQSxPQUFuQixFQUE0QixXQUFBLEdBZDVCLENBQUE7O0FBQUEsRUFnQk07c0JBU0o7O0FBQUEsbUJBQUEsRUFBQSxHQUFJLFNBQUEsR0FBQTtBQUNGLFVBQUEsaUNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxLQUFaLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxLQURSLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxLQUZWLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBUyxPQUFPLENBQUMsUUFBUixJQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDLEVBSHpDLENBQUE7QUFJQSxNQUFBLElBQUcsU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLENBQUg7QUFDRSxRQUFBLFNBQUEsR0FBWSxJQUFaLENBREY7T0FBQSxNQUVLLElBQUcsWUFBWSxDQUFDLElBQWIsQ0FBa0IsTUFBbEIsQ0FBSDtBQUNILFFBQUEsS0FBQSxHQUFRLElBQVIsQ0FERztPQUFBLE1BRUEsSUFBRyxXQUFXLENBQUMsSUFBWixDQUFpQixNQUFqQixDQUFIO0FBQ0gsUUFBQSxPQUFBLEdBQVUsSUFBVixDQURHO09BUkw7QUFVQSxhQUFPO0FBQUEsUUFDTCxPQUFBLEVBQVMsU0FESjtBQUFBLFFBRUwsR0FBQSxFQUFLLEtBRkE7QUFBQSxRQUdMLEtBQUEsRUFBTyxPQUhGO09BQVAsQ0FYRTtJQUFBLENBQUosQ0FBQTs7QUFBQSxtQkFvQkEsWUFBQSxHQUFjLFNBQUMsTUFBRCxHQUFBO0FBQ1osTUFBQSxJQUFHLE1BQUEsS0FBVSxJQUFiO0FBQ0UsZUFBTyxJQUFQLENBREY7T0FBQTtBQUVBLGFBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBZSw2QkFBZixFQUE4QyxNQUE5QyxDQUFQLENBSFk7SUFBQSxDQXBCZCxDQUFBOztBQUFBLG1CQTZCQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixHQUFoQixHQUFBO0FBQ1YsTUFBQSxJQUFPLFdBQVA7QUFDRSxlQUFPLElBQVAsQ0FERjtPQUFBO0FBRUEsTUFBQSxJQUFPLG1CQUFQO0FBQ0UsZUFBTyxHQUFQLENBREY7T0FGQTtBQUlBLGFBQU8sR0FBRyxDQUFDLE9BQUosQ0FBZ0IsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLENBQVAsRUFBNEIsR0FBNUIsQ0FBaEIsRUFBa0QsT0FBbEQsQ0FBUCxDQUxVO0lBQUEsQ0E3QlosQ0FBQTs7QUFBQSxtQkFrREEsR0FBQSxHQUFLLFNBQUMsS0FBRCxFQUFRLEdBQVIsR0FBQTtBQUNILFVBQUEseUJBQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxZQUFpQixLQUFwQjtBQUNFLFFBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLGFBQUEsNENBQUE7MkJBQUE7QUFDRSxVQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBQVcsR0FBWCxDQUFULENBQUEsQ0FERjtBQUFBLFNBREE7QUFHQSxlQUFPLEdBQVAsQ0FKRjtPQUFBLE1BQUE7QUFPRTtBQUFBOzs7Ozs7O1dBQUE7QUFBQSxRQVNBLElBQUEsR0FBTyxPQUFBLENBQVEsR0FBUixDQVRQLENBQUE7QUFVQSxRQUFBLElBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBQSxLQUFzQixDQUF2QixDQUFBLElBQThCLENBQUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLENBQUEsS0FBdUIsQ0FBeEIsQ0FBOUIsSUFBNkQsQ0FBQyxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsQ0FBQSxLQUF1QixDQUF4QixDQUE3RCxJQUE0RixDQUFDLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBZCxDQUFBLEtBQXdCLENBQXpCLENBQTVGLElBQTRILENBQUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFkLENBQUEsS0FBd0IsQ0FBekIsQ0FBNUgsSUFBNEosQ0FBQyxLQUFLLENBQUMsT0FBTixDQUFjLE1BQWQsQ0FBQSxLQUF5QixDQUExQixDQUEvSjtBQUNFLGlCQUFPLEtBQVAsQ0FERjtTQUFBLE1BQUE7QUFHRSxpQkFBTyxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFBa0IsR0FBbEIsRUFBd0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFBLEdBQUssR0FBakIsRUFBc0IsRUFBdEIsRUFBMkIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFBLEdBQUssR0FBakIsRUFBc0IsRUFBdEIsRUFBMkIsT0FBQSxDQUFRLEdBQVIsRUFBYSxLQUFiLENBQTNCLENBQTNCLENBQXhCLENBQVAsQ0FIRjtTQWpCRjtPQURHO0lBQUEsQ0FsREwsQ0FBQTs7QUFBQSxtQkEwRUEsV0FBQSxHQUFhLFNBQUMsUUFBRCxHQUFBO0FBQ1gsVUFBQSxPQUFBO0FBQUEsTUFBQSxJQUFHLGdCQUFIO0FBQ0UsUUFBQSxPQUFBLEdBQVUsdUJBQVYsQ0FBQTtBQUNBLGVBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEIsRUFBMUIsQ0FBUCxDQUZGO09BQUE7QUFHQSxhQUFPLElBQVAsQ0FKVztJQUFBLENBMUViLENBQUE7O0FBQUEsbUJBaUZBLFdBQUEsR0FBYSxTQUFDLFFBQUQsR0FBQTtBQUNYLE1BQUEsSUFBTyxvREFBUDtBQUNFLGVBQU8sSUFBUCxDQURGO09BQUE7QUFFQSxhQUFRLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLENBQVosRUFBb0MsRUFBcEMsRUFBd0MsUUFBeEMsQ0FBUixDQUhXO0lBQUEsQ0FqRmIsQ0FBQTs7QUFBQSxtQkEwRkEsUUFBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLE9BQVYsR0FBQTtBQUNSLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLElBQUcsT0FBQSxZQUFtQixLQUF0QjtBQUNFLFFBQUEsSUFBRyxrQkFBSDtBQUNFLGlCQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixPQUFRLENBQUEsQ0FBQSxDQUEzQixDQUFQLENBREY7U0FBQTtBQUVBLGVBQU8sQ0FBUCxDQUhGO09BQUEsTUFBQTtBQUtFLFFBQUEsSUFBRyxPQUFBLFlBQW1CLEtBQXRCO0FBQ0UsZUFBQSw4Q0FBQTtpQ0FBQTtBQUNFLFlBQUEsRUFBRSxDQUFDLGdCQUFILENBQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsRUFBRSxDQUFDLGlCQUFILENBQXNCLE9BQUEsQ0FBUSxPQUFSLENBQXRCLENBRFIsQ0FBQSxDQURGO0FBQUEsV0FBQTtBQUdBLGlCQUFPLE9BQU8sQ0FBQyxNQUFmLENBSkY7U0FBQSxNQUFBO0FBTUUsaUJBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVSxDQUFDLE9BQUQsQ0FBVixFQUFxQixPQUFyQixDQUFQLENBTkY7U0FMRjtPQURRO0lBQUEsQ0ExRlYsQ0FBQTs7QUFBQSxtQkEwR0EsRUFBQSxHQUFJLFNBQUMsT0FBRCxFQUFVLE9BQVYsR0FBQTtBQUNGLFVBQUEsd0RBQUE7QUFBQSxNQUFBLElBQUcsT0FBQSxZQUFtQixLQUF0QjtBQUNFLFFBQUEsR0FBQSxHQUFNLENBQU4sQ0FBQTtBQUNBLGFBQUEsOENBQUE7K0JBQUE7QUFDRSxVQUFBLEdBQUEsSUFBTyxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxNQUFiLENBQVAsQ0FERjtBQUFBLFNBREE7QUFHQSxlQUFPLEdBQVAsQ0FKRjtPQUFBLE1BQUE7QUFNRSxRQUFBLElBQUcsT0FBQSxZQUFtQixLQUF0QjtBQUNFLGVBQUEsZ0RBQUE7aUNBQUE7QUFDRSxZQUFBLEtBQUEsR0FBUSxLQUFSLENBQUE7QUFDQTtBQUNFLGNBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBWixFQUFxQixTQUFDLENBQUQsR0FBQSxDQUFyQixDQUFQLENBQUE7QUFBQSxjQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsV0FBTCxDQUFBLENBRFIsQ0FERjthQUFBLGNBQUE7QUFJRSxjQURJLFVBQ0osQ0FBQTtBQUFBLGNBQUEsS0FBQSxHQUFRLEtBQVIsQ0FKRjthQURBO0FBTUEsWUFBQSxJQUFHLENBQUEsS0FBSDtBQUNFLGNBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQWtCLE9BQWxCLENBQUEsQ0FERjthQUFBLE1BQUE7QUFHRSxjQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixPQUFBLEdBQVUsR0FBVixHQUFnQixDQUFDLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixDQUFELENBQWxDLENBQUEsQ0FIRjthQVBGO0FBQUEsV0FBQTtBQVdBLGlCQUFPLE9BQU8sQ0FBQyxNQUFmLENBWkY7U0FBQSxNQUFBO0FBY0UsaUJBQU8sSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFDLE9BQUQsQ0FBSixFQUFlLE9BQWYsQ0FBUCxDQWRGO1NBTkY7T0FERTtJQUFBLENBMUdKLENBQUE7O0FBQUEsbUJBa0lBLEtBQUEsR0FBTyxTQUFDLEtBQUQsR0FBQTtBQUNMLFVBQUEsbUJBQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxZQUFpQixLQUFwQjtBQUNFLFFBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLGFBQUEsNENBQUE7MkJBQUE7QUFDRSxVQUFBLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBYixFQUFtQixTQUFDLENBQUQsR0FBQSxDQUFuQixDQUFBLENBQUE7QUFBQSxVQUNBLEdBQUEsSUFBTyxzQkFBQSxHQUF1QixJQUF2QixHQUE0QixNQURuQyxDQURGO0FBQUEsU0FEQTtBQUlBLGVBQU8sR0FBUCxDQUxGO09BQUEsTUFBQTtBQU9FLGVBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFDLEtBQUQsQ0FBUCxDQUFQLENBUEY7T0FESztJQUFBLENBbElQLENBQUE7O0FBQUEsbUJBNklBLEtBQUEsR0FBTyxTQUFDLEtBQUQsR0FBQTtBQUNMLFVBQUEsbUJBQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxZQUFpQixLQUFwQjtBQUNFLFFBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLGFBQUEsNENBQUE7MkJBQUE7QUFDRSxVQUFBLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBYixFQUFtQixTQUFDLENBQUQsR0FBQSxDQUFuQixDQUFBLENBQUE7QUFBQSxVQUNBLEdBQUEsSUFBTyxzQkFBQSxHQUF1QixJQUF2QixHQUE0QixNQURuQyxDQURGO0FBQUEsU0FEQTtBQUlBLGVBQU8sR0FBUCxDQUxGO09BQUEsTUFBQTtBQU9FLGVBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFDLEtBQUQsQ0FBUCxDQUFQLENBUEY7T0FESztJQUFBLENBN0lQLENBQUE7O0FBQUEsbUJBd0pBLE1BQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxPQUFWLEdBQUE7QUFDTixNQUFBLEVBQUUsQ0FBQyxVQUFILENBQWMsT0FBZCxFQUF1QixPQUF2QixFQUFnQyxTQUFDLENBQUQsR0FBQSxDQUFoQyxDQUFBLENBQUE7QUFDQSxhQUFPLDBCQUFBLEdBQTJCLE9BQTNCLEdBQW1DLElBQTFDLENBRk07SUFBQSxDQXhKUixDQUFBOztnQkFBQTs7TUF6QkYsQ0FBQTs7QUFBQSxFQXFMQSxNQUFNLENBQUMsT0FBUCxHQUNNLElBQUEsSUFBQSxDQUFBLENBdExOLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/lib/atp-terminal-util.coffee
