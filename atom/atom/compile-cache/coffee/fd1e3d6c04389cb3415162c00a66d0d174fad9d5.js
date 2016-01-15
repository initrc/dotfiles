(function() {
  var moveToPosition;

  module.exports.gotoSymbol = function(symbol) {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    if (editor && symbol.path !== editor.getPath()) {
      return atom.workspace.open(symbol.path).done(function() {
        return moveToPosition(symbol.position);
      });
    } else {
      return moveToPosition(symbol.position);
    }
  };

  moveToPosition = function(position) {
    var editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.setCursorBufferPosition(position);
      return editor.moveToFirstCharacterOfLine();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dvdG8vbGliL3N5bWJvbC11dGlscy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBZixHQUE0QixTQUFDLE1BQUQsR0FBQTtBQUMxQixRQUFBLE1BQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQ0EsSUFBQSxJQUFHLE1BQUEsSUFBVyxNQUFNLENBQUMsSUFBUCxLQUFlLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBN0I7YUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLElBQTNCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsU0FBQSxHQUFBO2VBQ3BDLGNBQUEsQ0FBZSxNQUFNLENBQUMsUUFBdEIsRUFEb0M7TUFBQSxDQUF0QyxFQURGO0tBQUEsTUFBQTthQUlFLGNBQUEsQ0FBZSxNQUFNLENBQUMsUUFBdEIsRUFKRjtLQUYwQjtFQUFBLENBQTVCLENBQUE7O0FBQUEsRUFRQSxjQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO0FBQ2YsUUFBQSxNQUFBO0FBQUEsSUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLE1BQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLFFBQS9CLENBQUEsQ0FBQTthQUNBLE1BQU0sQ0FBQywwQkFBUCxDQUFBLEVBRkY7S0FEZTtFQUFBLENBUmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/david/.atom/packages/goto/lib/symbol-utils.coffee
