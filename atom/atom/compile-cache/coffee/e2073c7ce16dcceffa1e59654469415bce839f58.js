(function() {
  describe("atom-terminal-panel Testing utils functionality", function() {
    it("tests the \"utils\" module", function() {
      return require('../lib/atp-utils');
    });
    it("tests \"include\" function", function() {
      return expect(function() {
        return include('../lib/atp-core');
      }).not.toThrow();
    });
    return it("tests the utils functionality", function() {
      expect(window.generateRandomID).toBeDefined();
      expect(window.generateRandomID).not.toThrow();
      expect(window.generateRandomID()).not.toBeNull();
      return expect(window.generateRandomID()).toBeDefined();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9zcGVjL2Jhc2ljLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpREFBVCxFQUE0RCxTQUFBLEdBQUE7QUFFMUQsSUFBQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO2FBQy9CLE9BQUEsQ0FBUSxrQkFBUixFQUQrQjtJQUFBLENBQWpDLENBQUEsQ0FBQTtBQUFBLElBR0EsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTthQUMvQixNQUFBLENBQU8sU0FBQSxHQUFBO2VBQUksT0FBQSxDQUFRLGlCQUFSLEVBQUo7TUFBQSxDQUFQLENBQXFDLENBQUMsR0FBRyxDQUFDLE9BQTFDLENBQUEsRUFEK0I7SUFBQSxDQUFqQyxDQUhBLENBQUE7V0FNQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLE1BQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxnQkFBZCxDQUErQixDQUFDLFdBQWhDLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGdCQUFkLENBQStCLENBQUMsR0FBRyxDQUFDLE9BQXBDLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLGdCQUFQLENBQUEsQ0FBUCxDQUFpQyxDQUFDLEdBQUcsQ0FBQyxRQUF0QyxDQUFBLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsZ0JBQVAsQ0FBQSxDQUFQLENBQWlDLENBQUMsV0FBbEMsQ0FBQSxFQUprQztJQUFBLENBQXBDLEVBUjBEO0VBQUEsQ0FBNUQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/spec/basic-spec.coffee
