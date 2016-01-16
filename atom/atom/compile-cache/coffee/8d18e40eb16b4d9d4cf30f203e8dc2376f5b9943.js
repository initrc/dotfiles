(function() {
  var dash;

  dash = require('../lib/dash');

  describe("dash", function() {
    it("should open dash", function() {
      return waitsForPromise(function() {
        return atom.workspace.open('test.hs').then(function(editor) {
          var view;
          view = atom.views.getView(editor);
          editor.setCursorBufferPosition({
            row: 1,
            column: 6
          });
          return new Promise(function(resolve, reject) {
            dash.exec = function(cmd) {
              expect(cmd).toEqual('open -g "dash-plugin://query=.SetFlags"');
              return resolve();
            };
            return dash.shortcut(true);
          });
        });
      });
    });
    return it("should open dash with background", function() {
      return waitsForPromise(function() {
        return atom.workspace.open('test.hs').then(function(editor) {
          var view;
          view = atom.views.getView(editor);
          editor.setCursorBufferPosition({
            row: 1,
            column: 6
          });
          return new Promise(function(resolve, reject) {
            dash.exec = function(cmd) {
              expect(cmd).toEqual('open -g "dash-plugin://query=.SetFlags&prevent_activation=true"');
              return resolve();
            };
            return dash.shortcut(true, true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvZGFzaC9zcGVjL2Rhc2gtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsTUFBVCxFQUFpQixTQUFBLEdBQUE7QUFDZixJQUFBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7YUFDckIsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBcEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxTQUFDLE1BQUQsR0FBQTtBQUNsQyxjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBUCxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0I7QUFBQSxZQUFFLEdBQUEsRUFBSyxDQUFQO0FBQUEsWUFBVSxNQUFBLEVBQVEsQ0FBbEI7V0FBL0IsQ0FGQSxDQUFBO2lCQUlJLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNWLFlBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxTQUFDLEdBQUQsR0FBQTtBQUNWLGNBQUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IseUNBQXBCLENBQUEsQ0FBQTtxQkFDQSxPQUFBLENBQUEsRUFGVTtZQUFBLENBQVosQ0FBQTttQkFJQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFMVTtVQUFBLENBQVIsRUFMOEI7UUFBQSxDQUFwQyxFQURjO01BQUEsQ0FBaEIsRUFEcUI7SUFBQSxDQUF2QixDQUFBLENBQUE7V0FjQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2FBQ3JDLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQXBCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsU0FBQyxNQUFELEdBQUE7QUFDbEMsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQVAsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCO0FBQUEsWUFBRSxHQUFBLEVBQUssQ0FBUDtBQUFBLFlBQVUsTUFBQSxFQUFRLENBQWxCO1dBQS9CLENBRkEsQ0FBQTtpQkFJSSxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDVixZQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksU0FBQyxHQUFELEdBQUE7QUFDVixjQUFBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLGlFQUFwQixDQUFBLENBQUE7cUJBQ0EsT0FBQSxDQUFBLEVBRlU7WUFBQSxDQUFaLENBQUE7bUJBSUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBTFU7VUFBQSxDQUFSLEVBTDhCO1FBQUEsQ0FBcEMsRUFEYztNQUFBLENBQWhCLEVBRHFDO0lBQUEsQ0FBdkMsRUFmZTtFQUFBLENBQWpCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/dash/spec/dash-spec.coffee
