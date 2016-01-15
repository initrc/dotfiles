(function() {
  var GitRemove, currentPane, git, pathToRepoFile, repo, textEditor, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, currentPane = _ref.currentPane;

  GitRemove = require('../../lib/models/git-remove');

  describe("GitRemove", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'getActivePaneItem').andReturn(currentPane);
      spyOn(window, 'confirm').andReturn(true);
      return spyOn(git, 'cmd').andReturn(Promise.resolve(repo.relativize(pathToRepoFile)));
    });
    describe("when there is a current file open", function() {
      return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
        var args, _ref1;
        GitRemove(repo);
        args = git.cmd.mostRecentCall.args[0];
        expect(__indexOf.call(args, 'rm') >= 0).toBe(true);
        return expect((_ref1 = repo.relativize(pathToRepoFile), __indexOf.call(args, _ref1) >= 0)).toBe(true);
      });
    });
    return describe("when 'showSelector' is set to true", function() {
      return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
        var args;
        GitRemove(repo, {
          showSelector: true
        });
        args = git.cmd.mostRecentCall.args[0];
        return expect(__indexOf.call(args, '*') >= 0).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1yZW1vdmUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUVBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxPQUFrRCxPQUFBLENBQVEsYUFBUixDQUFsRCxFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsRUFBdUIsa0JBQUEsVUFBdkIsRUFBbUMsbUJBQUEsV0FEbkMsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsNkJBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNQLE1BQUEsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLHFCQUF0QixDQUE0QyxDQUFDLFNBQTdDLENBQXVELFVBQXZELENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLG1CQUF0QixDQUEwQyxDQUFDLFNBQTNDLENBQXFELFdBQXJELENBREEsQ0FBQTtBQUFBLE1BRUEsS0FBQSxDQUFNLE1BQU4sRUFBYyxTQUFkLENBQXdCLENBQUMsU0FBekIsQ0FBbUMsSUFBbkMsQ0FGQSxDQUFBO2FBR0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBaEIsQ0FBNUIsRUFKTztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFNQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQSxHQUFBO2FBQzVDLEVBQUEsQ0FBSSw4QkFBQSxHQUE4QixjQUFsQyxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsWUFBQSxXQUFBO0FBQUEsUUFBQSxTQUFBLENBQVUsSUFBVixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQURuQyxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sZUFBUSxJQUFSLEVBQUEsSUFBQSxNQUFQLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsSUFBMUIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLFNBQUEsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBQSxFQUFBLGVBQW1DLElBQW5DLEVBQUEsS0FBQSxNQUFBLENBQVAsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxJQUFyRCxFQUprRDtNQUFBLENBQXBELEVBRDRDO0lBQUEsQ0FBOUMsQ0FOQSxDQUFBO1dBYUEsUUFBQSxDQUFTLG9DQUFULEVBQStDLFNBQUEsR0FBQTthQUM3QyxFQUFBLENBQUksb0NBQUEsR0FBb0MsY0FBeEMsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFlBQUEsSUFBQTtBQUFBLFFBQUEsU0FBQSxDQUFVLElBQVYsRUFBZ0I7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBQWhCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBRG5DLENBQUE7ZUFFQSxNQUFBLENBQU8sZUFBTyxJQUFQLEVBQUEsR0FBQSxNQUFQLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsSUFBekIsRUFId0Q7TUFBQSxDQUExRCxFQUQ2QztJQUFBLENBQS9DLEVBZG9CO0VBQUEsQ0FBdEIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/david/.atom/packages/git-plus/spec/models/git-remove-spec.coffee
