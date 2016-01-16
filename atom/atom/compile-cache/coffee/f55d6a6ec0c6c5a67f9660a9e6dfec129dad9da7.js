(function() {
  var TerminalPlus;

  TerminalPlus = require('../lib/terminal-plus');

  describe("TerminalPlus", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('terminal-plus');
    });
    return describe("when the terminal-plus:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.terminal-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var statusBar, terminalPlusElement;
          expect(workspaceElement.querySelector('.terminal-plus')).toExist();
          terminalPlusElement = workspaceElement.querySelector('.terminal-plus');
          expect(terminalPlusElement).toExist();
          statusBar = atom.workspace.panelForItem(terminalPlusElement);
          expect(statusBar.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
          return expect(statusBar.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.terminal-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var terminalPlusElement;
          terminalPlusElement = workspaceElement.querySelector('.terminal-plus');
          expect(terminalPlusElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
          return expect(terminalPlusElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9zcGVjL3Rlcm1pbmFsLXBsdXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEseUNBQUE7QUFBQSxJQUFBLE9BQXdDLEVBQXhDLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsa0RBQVQsRUFBNkQsU0FBQSxHQUFBO0FBQzNELE1BQUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUdwQyxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixnQkFBL0IsQ0FBUCxDQUF3RCxDQUFDLEdBQUcsQ0FBQyxPQUE3RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxzQkFBekMsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLDhCQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsZ0JBQS9CLENBQVAsQ0FBd0QsQ0FBQyxPQUF6RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBRUEsbUJBQUEsR0FBc0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsZ0JBQS9CLENBRnRCLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxtQkFBUCxDQUEyQixDQUFDLE9BQTVCLENBQUEsQ0FIQSxDQUFBO0FBQUEsVUFLQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLG1CQUE1QixDQUxaLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxTQUFTLENBQUMsU0FBVixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxJQUFuQyxDQU5BLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsc0JBQXpDLENBUEEsQ0FBQTtpQkFRQSxNQUFBLENBQU8sU0FBUyxDQUFDLFNBQVYsQ0FBQSxDQUFQLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsRUFURztRQUFBLENBQUwsRUFab0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUF1QkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQU83QixRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixnQkFBL0IsQ0FBUCxDQUF3RCxDQUFDLEdBQUcsQ0FBQyxPQUE3RCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxzQkFBekMsQ0FOQSxDQUFBO0FBQUEsUUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBUkEsQ0FBQTtlQVdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFFSCxjQUFBLG1CQUFBO0FBQUEsVUFBQSxtQkFBQSxHQUFzQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixnQkFBL0IsQ0FBdEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLG1CQUFQLENBQTJCLENBQUMsV0FBNUIsQ0FBQSxDQURBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsc0JBQXpDLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sbUJBQVAsQ0FBMkIsQ0FBQyxHQUFHLENBQUMsV0FBaEMsQ0FBQSxFQUxHO1FBQUEsQ0FBTCxFQWxCNkI7TUFBQSxDQUEvQixFQXhCMkQ7SUFBQSxDQUE3RCxFQVB1QjtFQUFBLENBQXpCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/spec/terminal-plus-spec.coffee
