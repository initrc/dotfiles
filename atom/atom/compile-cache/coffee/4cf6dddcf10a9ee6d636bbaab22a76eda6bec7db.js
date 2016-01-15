(function() {
  var StatusBarManager;

  module.exports = StatusBarManager = (function() {
    function StatusBarManager() {
      this.span = document.createElement("span");
      this.element = document.createElement("div");
      this.element.id = 'status-bar-quick-highlight';
      this.element.className = 'block';
      this.element.appendChild(this.span);
      this.container = document.createElement("div");
      this.container.className = "inline-block";
      this.container.appendChild(this.element);
    }

    StatusBarManager.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
    };

    StatusBarManager.prototype.update = function(count) {
      this.span.className = atom.config.get('quick-highlight.countDisplayStyles');
      this.span.textContent = count;
      return this.element.style.display = 'inline-block';
    };

    StatusBarManager.prototype.clear = function() {
      return this.element.style.display = 'none';
    };

    StatusBarManager.prototype.attach = function() {
      var displayPosition, displayPriority;
      displayPosition = atom.config.get('quick-highlight.countDisplayPosition');
      displayPriority = atom.config.get('quick-highlight.countDisplayPriority');
      return this.tile = this.statusBar["add" + displayPosition + "Tile"]({
        item: this.container,
        priority: displayPriority
      });
    };

    StatusBarManager.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusBarManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL3F1aWNrLWhpZ2hsaWdodC9saWIvc3RhdHVzLWJhci1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDBCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBUixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRlgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULEdBQWMsNEJBSGQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLE9BSnJCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFDLENBQUEsSUFBdEIsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBUGIsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLGNBUnZCLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsT0FBeEIsQ0FUQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSwrQkFZQSxVQUFBLEdBQVksU0FBRSxTQUFGLEdBQUE7QUFBYyxNQUFiLElBQUMsQ0FBQSxZQUFBLFNBQVksQ0FBZDtJQUFBLENBWlosQ0FBQTs7QUFBQSwrQkFjQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLENBQWxCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixHQUFvQixLQURwQixDQUFBO2FBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBZixHQUF5QixlQUhuQjtJQUFBLENBZFIsQ0FBQTs7QUFBQSwrQkFtQkEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQWYsR0FBeUIsT0FEcEI7SUFBQSxDQW5CUCxDQUFBOztBQUFBLCtCQXNCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxnQ0FBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQWxCLENBQUE7QUFBQSxNQUNBLGVBQUEsR0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQURsQixDQUFBO2FBR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsU0FBVSxDQUFDLEtBQUEsR0FBSyxlQUFMLEdBQXFCLE1BQXRCLENBQVgsQ0FDTjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxTQUFQO0FBQUEsUUFDQSxRQUFBLEVBQVUsZUFEVjtPQURNLEVBSkY7SUFBQSxDQXRCUixDQUFBOztBQUFBLCtCQThCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsRUFETTtJQUFBLENBOUJSLENBQUE7OzRCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/david/.atom/packages/quick-highlight/lib/status-bar-manager.coffee
