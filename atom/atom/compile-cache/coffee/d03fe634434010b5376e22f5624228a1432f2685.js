(function() {
  var CliStatus;

  CliStatus = require('../lib/cli-status');

  describe("CliStatus", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('cliStatus');
    });
    describe("when the cli-status:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.cli-status')).not.toExist();
        atom.workspaceView.trigger('cli-status:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.cli-status')).toExist();
          atom.workspaceView.trigger('cli-status:toggle');
          return expect(atom.workspaceView.find('.cli-status')).not.toExist();
        });
      });
    });
    return describe("when cli-status is activated", function() {
      it("should have configuration set up with defaults");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        return expect(atom.config.get('terminal-status.WindowHeight')).toBe(300);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtc3RhdHVzL3NwZWMvY2xpLXN0YXR1cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUFaLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsUUFBQSxpQkFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLGFBQUwsR0FBcUIsR0FBQSxDQUFBLGFBQXJCLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsRUFGWDtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFNQSxRQUFBLENBQVMsK0NBQVQsRUFBMEQsU0FBQSxHQUFBO2FBQ3hELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixhQUF4QixDQUFQLENBQThDLENBQUMsR0FBRyxDQUFDLE9BQW5ELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1CQUEzQixDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsYUFBeEIsQ0FBUCxDQUE4QyxDQUFDLE9BQS9DLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1CQUEzQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsYUFBeEIsQ0FBUCxDQUE4QyxDQUFDLEdBQUcsQ0FBQyxPQUFuRCxDQUFBLEVBSEc7UUFBQSxDQUFMLEVBVndDO01BQUEsQ0FBMUMsRUFEd0Q7SUFBQSxDQUExRCxDQU5BLENBQUE7V0FzQkEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxNQUFBLEVBQUEsQ0FBRyxnREFBSCxDQUFBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2Qsa0JBRGM7TUFBQSxDQUFoQixDQUZBLENBQUE7YUFLQSxJQUFBLENBQUssU0FBQSxHQUFBO2VBQ0QsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELEdBQTdELEVBREM7TUFBQSxDQUFMLEVBTnVDO0lBQUEsQ0FBekMsRUF2Qm9CO0VBQUEsQ0FBdEIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-status/spec/cli-status-spec.coffee
