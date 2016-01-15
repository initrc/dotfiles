(function() {
  var OutputViewManager, Path, git, notifier;

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo, _arg) {
    var file, _ref;
    file = (_arg != null ? _arg : {}).file;
    if (file == null) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    }
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    return git.getConfig('diff.tool', Path.dirname(file)).then(function(tool) {
      if (!tool) {
        return notifier.addInfo("You don't have a difftool configured.");
      } else {
        return git.cmd(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
          diffIndex = data.split('\0');
          includeStagedDiff = atom.config.get('git-plus.includeStagedDiff');
          diffsForCurrentFile = diffIndex.map(function(line, i) {
            var path, staged;
            if (i % 2 === 0) {
              staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
              path = diffIndex[i + 1];
              if (path === file && (!staged || includeStagedDiff)) {
                return true;
              }
            } else {
              return void 0;
            }
          });
          if (diffsForCurrentFile.filter(function(diff) {
            return diff != null;
          })[0] != null) {
            args = ['difftool', '--no-prompt'];
            if (includeStagedDiff) {
              args.push('HEAD');
            }
            args.push(file);
            return git.cmd(args, {
              cwd: repo.getWorkingDirectory()
            })["catch"](function(msg) {
              return OutputViewManager["new"]().addLine(msg).finish();
            });
          } else {
            return notifier.addInfo('Nothing to show.');
          }
        });
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmZ0b29sLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUhwQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2YsUUFBQSxVQUFBO0FBQUEsSUFEdUIsdUJBQUQsT0FBTyxJQUFOLElBQ3ZCLENBQUE7O01BQUEsT0FBUSxJQUFJLENBQUMsVUFBTCw2REFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO0tBQVI7QUFDQSxJQUFBLElBQUcsQ0FBQSxJQUFIO0FBQ0UsYUFBTyxRQUFRLENBQUMsT0FBVCxDQUFpQixrQ0FBakIsQ0FBUCxDQURGO0tBREE7V0FLQSxHQUFHLENBQUMsU0FBSixDQUFjLFdBQWQsRUFBMkIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQTNCLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsU0FBQyxJQUFELEdBQUE7QUFDbEQsTUFBQSxJQUFBLENBQUEsSUFBQTtlQUNFLFFBQVEsQ0FBQyxPQUFULENBQWlCLHVDQUFqQixFQURGO09BQUEsTUFBQTtlQUdFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxZQUFELEVBQWUsTUFBZixFQUF1QixJQUF2QixDQUFSLEVBQXNDO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUF0QyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO0FBQ0osY0FBQSx1REFBQTtBQUFBLFVBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFaLENBQUE7QUFBQSxVQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FEcEIsQ0FBQTtBQUFBLFVBRUEsbUJBQUEsR0FBc0IsU0FBUyxDQUFDLEdBQVYsQ0FBYyxTQUFDLElBQUQsRUFBTyxDQUFQLEdBQUE7QUFDbEMsZ0JBQUEsWUFBQTtBQUFBLFlBQUEsSUFBRyxDQUFBLEdBQUksQ0FBSixLQUFTLENBQVo7QUFDRSxjQUFBLE1BQUEsR0FBUyxDQUFBLFNBQWEsQ0FBQyxJQUFWLENBQWUsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQWIsQ0FBQTtBQUFBLGNBQ0EsSUFBQSxHQUFPLFNBQVUsQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQURqQixDQUFBO0FBRUEsY0FBQSxJQUFRLElBQUEsS0FBUSxJQUFSLElBQWlCLENBQUMsQ0FBQSxNQUFBLElBQVcsaUJBQVosQ0FBekI7dUJBQUEsS0FBQTtlQUhGO2FBQUEsTUFBQTtxQkFLRSxPQUxGO2FBRGtDO1VBQUEsQ0FBZCxDQUZ0QixDQUFBO0FBVUEsVUFBQSxJQUFHOzt1QkFBSDtBQUNFLFlBQUEsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLGFBQWIsQ0FBUCxDQUFBO0FBQ0EsWUFBQSxJQUFvQixpQkFBcEI7QUFBQSxjQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixDQUFBLENBQUE7YUFEQTtBQUFBLFlBRUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBRkEsQ0FBQTttQkFHQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLGNBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7YUFBZCxDQUNBLENBQUMsT0FBRCxDQURBLENBQ08sU0FBQyxHQUFELEdBQUE7cUJBQVMsaUJBQWlCLENBQUMsS0FBRCxDQUFqQixDQUFBLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsR0FBaEMsQ0FBb0MsQ0FBQyxNQUFyQyxDQUFBLEVBQVQ7WUFBQSxDQURQLEVBSkY7V0FBQSxNQUFBO21CQU9FLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtCQUFqQixFQVBGO1dBWEk7UUFBQSxDQUROLEVBSEY7T0FEa0Q7SUFBQSxDQUFwRCxFQU5lO0VBQUEsQ0FMakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/david/.atom/packages/git-plus/lib/models/git-difftool.coffee
