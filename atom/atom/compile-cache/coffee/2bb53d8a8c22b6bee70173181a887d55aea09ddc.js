(function() {
  var Goto;

  Goto = require('../lib/goto');

  describe("Goto", function() {
    var activationPromise, workspaceElement;
    activationPromise = null;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('goto');
    });
    return describe("when the goto:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(workspaceElement.find('.goto-view')).not.toExist();
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(workspaceElement.find('.goto-view')).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dvdG8vc3BlYy9nb3RvLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsUUFBQSxtQ0FBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBQ0EsZ0JBQUEsR0FBb0IsSUFEcEIsQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE1BQTlCLEVBRlg7SUFBQSxDQUFYLENBSEEsQ0FBQTtXQU9BLFFBQUEsQ0FBUyx5Q0FBVCxFQUFvRCxTQUFBLEdBQUE7YUFDbEQsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixZQUF0QixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLE9BQWhELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQ0gsTUFBQSxDQUFPLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLFlBQXRCLENBQVAsQ0FBMkMsQ0FBQyxPQUE1QyxDQUFBLEVBREc7UUFBQSxDQUFMLEVBVndDO01BQUEsQ0FBMUMsRUFEa0Q7SUFBQSxDQUFwRCxFQVJlO0VBQUEsQ0FBakIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/david/.atom/packages/goto/spec/goto-spec.coffee
