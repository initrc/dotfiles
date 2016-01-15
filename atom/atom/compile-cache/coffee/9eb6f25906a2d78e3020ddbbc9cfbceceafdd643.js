(function() {
  var Path, head, mocks, pathToRepoFile;

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/some/repository/directory/file");

  head = jasmine.createSpyObj('head', ['replace']);

  module.exports = mocks = {
    pathToRepoFile: pathToRepoFile,
    repo: {
      getPath: function() {
        return Path.join(this.getWorkingDirectory(), ".git");
      },
      getWorkingDirectory: function() {
        return Path.get("~/some/repository");
      },
      refreshStatus: function() {
        return void 0;
      },
      relativize: function(path) {
        if (path === pathToRepoFile) {
          return "directory/file";
        }
      },
      getReferences: function() {
        return {
          heads: [head]
        };
      },
      getShortHead: function() {
        return 'short head';
      },
      repo: {
        submoduleForPath: function(path) {
          return void 0;
        }
      }
    },
    currentPane: {
      isAlive: function() {
        return true;
      },
      activate: function() {
        return void 0;
      },
      destroy: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return pathToRepoFile;
            }
          }
        ];
      }
    },
    commitPane: {
      isAlive: function() {
        return true;
      },
      destroy: function() {
        return mocks.textEditor.destroy();
      },
      splitRight: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return Path.join(mocks.repo.getPath(), 'COMMIT_EDITMSG');
            }
          }
        ];
      }
    },
    textEditor: {
      getPath: function() {
        return pathToRepoFile;
      },
      getURI: function() {
        return pathToRepoFile;
      },
      onDidDestroy: function(destroy) {
        this.destroy = destroy;
        return {
          dispose: function() {}
        };
      },
      onDidSave: function(save) {
        this.save = save;
        return {
          dispose: function() {
            return void 0;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvZml4dHVyZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxrQ0FBVCxDQUZqQixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE1BQXJCLEVBQTZCLENBQUMsU0FBRCxDQUE3QixDQUpQLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLEdBQ2Y7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsY0FBaEI7QUFBQSxJQUVBLElBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBVixFQUFzQyxNQUF0QyxFQUFIO01BQUEsQ0FBVDtBQUFBLE1BQ0EsbUJBQUEsRUFBcUIsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxtQkFBVCxFQUFIO01BQUEsQ0FEckI7QUFBQSxNQUVBLGFBQUEsRUFBZSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FGZjtBQUFBLE1BR0EsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQVUsUUFBQSxJQUFvQixJQUFBLEtBQVEsY0FBNUI7aUJBQUEsaUJBQUE7U0FBVjtNQUFBLENBSFo7QUFBQSxNQUlBLGFBQUEsRUFBZSxTQUFBLEdBQUE7ZUFDYjtBQUFBLFVBQUEsS0FBQSxFQUFPLENBQUMsSUFBRCxDQUFQO1VBRGE7TUFBQSxDQUpmO0FBQUEsTUFNQSxZQUFBLEVBQWMsU0FBQSxHQUFBO2VBQUcsYUFBSDtNQUFBLENBTmQ7QUFBQSxNQU9BLElBQUEsRUFDRTtBQUFBLFFBQUEsZ0JBQUEsRUFBa0IsU0FBQyxJQUFELEdBQUE7aUJBQVUsT0FBVjtRQUFBLENBQWxCO09BUkY7S0FIRjtBQUFBLElBYUEsV0FBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsS0FBSDtNQUFBLENBQVQ7QUFBQSxNQUNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FEVjtBQUFBLE1BRUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQUZUO0FBQUEsTUFHQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2VBQUc7VUFDWDtBQUFBLFlBQUEsTUFBQSxFQUFRLFNBQUEsR0FBQTtxQkFBRyxlQUFIO1lBQUEsQ0FBUjtXQURXO1VBQUg7TUFBQSxDQUhWO0tBZEY7QUFBQSxJQXFCQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxLQUFIO01BQUEsQ0FBVDtBQUFBLE1BQ0EsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBakIsQ0FBQSxFQUFIO01BQUEsQ0FEVDtBQUFBLE1BRUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQUZaO0FBQUEsTUFHQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2VBQUc7VUFDWDtBQUFBLFlBQUEsTUFBQSxFQUFRLFNBQUEsR0FBQTtxQkFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBWCxDQUFBLENBQVYsRUFBZ0MsZ0JBQWhDLEVBQUg7WUFBQSxDQUFSO1dBRFc7VUFBSDtNQUFBLENBSFY7S0F0QkY7QUFBQSxJQTZCQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxlQUFIO01BQUEsQ0FBVDtBQUFBLE1BQ0EsTUFBQSxFQUFRLFNBQUEsR0FBQTtlQUFHLGVBQUg7TUFBQSxDQURSO0FBQUEsTUFFQSxZQUFBLEVBQWMsU0FBRSxPQUFGLEdBQUE7QUFDWixRQURhLElBQUMsQ0FBQSxVQUFBLE9BQ2QsQ0FBQTtlQUFBO0FBQUEsVUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBLENBQVQ7VUFEWTtNQUFBLENBRmQ7QUFBQSxNQUlBLFNBQUEsRUFBVyxTQUFFLElBQUYsR0FBQTtBQUNULFFBRFUsSUFBQyxDQUFBLE9BQUEsSUFDWCxDQUFBO2VBQUE7QUFBQSxVQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7bUJBQUcsT0FBSDtVQUFBLENBQVQ7VUFEUztNQUFBLENBSlg7S0E5QkY7R0FQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/david/.atom/packages/git-plus/spec/fixtures.coffee
