var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _nuclideAnalytics = require('nuclide-analytics');

'use babel';

function trackSplit(operation, splitOperation) {
  (0, _nuclideAnalytics.trackOperationTiming)('nuclide-move-pane:move-tab-to-new-pane-' + operation, function () {
    doSplit(splitOperation);
  });
}

function doSplit(splitOperation) {
  var pane = atom.workspace.getActivePane();
  if (pane) {
    // Note that this will (intentionally) create an empty pane if the active
    // pane contains exactly zero or one items.
    // The new empty pane will be kept if the global atom setting
    // 'Destroy Empty Panes' is false, otherwise it will be removed.
    var newPane = splitOperation(pane, { copyActiveItem: false });
    var item = pane.getActiveItem();
    if (item) {
      pane.moveItemToPane(item, newPane, 0);
    }
  }
}

function splitUp() {
  trackSplit('up', function (pane, params) {
    return pane.splitUp(params);
  });
}

function splitDown() {
  trackSplit('down', function (pane, params) {
    return pane.splitDown(params);
  });
}

function splitRight() {
  trackSplit('right', function (pane, params) {
    return pane.splitRight(params);
  });
}

function splitLeft() {
  trackSplit('left', function (pane, params) {
    return pane.splitLeft(params);
  });
}

var Activation = (function () {
  function Activation(state) {
    _classCallCheck(this, Activation);

    this._subscriptions = new _atom.CompositeDisposable();
    this._subscriptions.add(atom.commands.add('atom-workspace', 'nuclide-move-pane:move-tab-to-new-pane-up', splitUp));
    this._subscriptions.add(atom.commands.add('atom-workspace', 'nuclide-move-pane:move-tab-to-new-pane-down', splitDown));
    this._subscriptions.add(atom.commands.add('atom-workspace', 'nuclide-move-pane:move-tab-to-new-pane-left', splitLeft));
    this._subscriptions.add(atom.commands.add('atom-workspace', 'nuclide-move-pane:move-tab-to-new-pane-right', splitRight));
  }

  _createClass(Activation, [{
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
    }
  }]);

  return Activation;
})();

var activation = null;

module.exports = {

  activate: function activate(state) {
    if (!activation) {
      activation = new Activation();
    }
  },

  deactivate: function deactivate() {
    if (activation) {
      activation.dispose();
      activation = null;
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLW1vdmUtcGFuZS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBV2tDLE1BQU07O2dDQUNMLG1CQUFtQjs7QUFadEQsV0FBVyxDQUFDOztBQWNaLFNBQVMsVUFBVSxDQUNmLFNBQWlCLEVBQ2pCLGNBQTZFLEVBQUU7QUFDakYsd0JBTE0sb0JBQW9CLEVBTXhCLHlDQUF5QyxHQUFHLFNBQVMsRUFDckQsWUFBTTtBQUFFLFdBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztHQUFFLENBQUMsQ0FBQztDQUN2Qzs7QUFFRCxTQUFTLE9BQU8sQ0FDWixjQUE2RSxFQUFFO0FBQ2pGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDNUMsTUFBSSxJQUFJLEVBQUU7Ozs7O0FBS1IsUUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQzlELFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNsQyxRQUFJLElBQUksRUFBRTtBQUNSLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2QztHQUNGO0NBQ0Y7O0FBRUQsU0FBUyxPQUFPLEdBQUc7QUFDakIsWUFBVSxDQUFDLElBQUksRUFBRSxVQUFDLElBQUksRUFBRSxNQUFNO1dBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUM7Q0FDMUQ7O0FBRUQsU0FBUyxTQUFTLEdBQUc7QUFDbkIsWUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksRUFBRSxNQUFNO1dBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUM7Q0FDOUQ7O0FBRUQsU0FBUyxVQUFVLEdBQUc7QUFDcEIsWUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFDLElBQUksRUFBRSxNQUFNO1dBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUM7Q0FDaEU7O0FBRUQsU0FBUyxTQUFTLEdBQUc7QUFDbkIsWUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksRUFBRSxNQUFNO1dBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUM7Q0FDOUQ7O0lBRUssVUFBVTtBQUdILFdBSFAsVUFBVSxDQUdGLEtBQWMsRUFBRTswQkFIeEIsVUFBVTs7QUFJWixRQUFJLENBQUMsY0FBYyxHQUFHLFVBL0NsQixtQkFBbUIsRUErQ3dCLENBQUM7QUFDaEQsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUNsQywyQ0FBMkMsRUFBRSxPQUFPLENBQUMsQ0FDdEQsQ0FBQztBQUNGLFFBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFDbEMsNkNBQTZDLEVBQUUsU0FBUyxDQUFDLENBQzFELENBQUM7QUFDRixRQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQ2xDLDZDQUE2QyxFQUFFLFNBQVMsQ0FBQyxDQUMxRCxDQUFDO0FBQ0YsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUNsQyw4Q0FBOEMsRUFBRSxVQUFVLENBQUMsQ0FDNUQsQ0FBQztHQUNIOztlQXJCRyxVQUFVOztXQXVCUCxtQkFBRztBQUNSLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDL0I7OztTQXpCRyxVQUFVOzs7QUE0QmhCLElBQUksVUFBdUIsR0FBRyxJQUFJLENBQUM7O0FBRW5DLE1BQU0sQ0FBQyxPQUFPLEdBQUc7O0FBRWYsVUFBUSxFQUFBLGtCQUFDLEtBQWEsRUFBUTtBQUM1QixRQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsZ0JBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0tBQy9CO0dBQ0Y7O0FBRUQsWUFBVSxFQUFBLHNCQUFTO0FBQ2pCLFFBQUksVUFBVSxFQUFFO0FBQ2QsZ0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixnQkFBVSxHQUFHLElBQUksQ0FBQztLQUNuQjtHQUNGO0NBQ0YsQ0FBQyIsImZpbGUiOiIvdmFyL2ZvbGRlcnMveGYvcnNwaDRfYzU3MzE1cnM1N3h4c2Rza3J4bnYzNnQwL1QvdG1wcGZsNTJucHVibGlzaF9wYWNrYWdlcy9hcG0vbnVjbGlkZS1tb3ZlLXBhbmUvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHt0cmFja09wZXJhdGlvblRpbWluZ30gZnJvbSAnbnVjbGlkZS1hbmFseXRpY3MnO1xuXG5mdW5jdGlvbiB0cmFja1NwbGl0KFxuICAgIG9wZXJhdGlvbjogc3RyaW5nLFxuICAgIHNwbGl0T3BlcmF0aW9uOiAocGFuZTogYXRvbSRQYW5lLCBwYXJhbXM/OiBhdG9tJFBhbmVTcGxpdFBhcmFtcykgPT4gYXRvbSRQYW5lKSB7XG4gIHRyYWNrT3BlcmF0aW9uVGltaW5nKFxuICAgICdudWNsaWRlLW1vdmUtcGFuZTptb3ZlLXRhYi10by1uZXctcGFuZS0nICsgb3BlcmF0aW9uLFxuICAgICgpID0+IHsgZG9TcGxpdChzcGxpdE9wZXJhdGlvbik7IH0pO1xufVxuXG5mdW5jdGlvbiBkb1NwbGl0KFxuICAgIHNwbGl0T3BlcmF0aW9uOiAocGFuZTogYXRvbSRQYW5lLCBwYXJhbXM/OiBhdG9tJFBhbmVTcGxpdFBhcmFtcykgPT4gYXRvbSRQYW5lKSB7XG4gIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gIGlmIChwYW5lKSB7XG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgd2lsbCAoaW50ZW50aW9uYWxseSkgY3JlYXRlIGFuIGVtcHR5IHBhbmUgaWYgdGhlIGFjdGl2ZVxuICAgIC8vIHBhbmUgY29udGFpbnMgZXhhY3RseSB6ZXJvIG9yIG9uZSBpdGVtcy5cbiAgICAvLyBUaGUgbmV3IGVtcHR5IHBhbmUgd2lsbCBiZSBrZXB0IGlmIHRoZSBnbG9iYWwgYXRvbSBzZXR0aW5nXG4gICAgLy8gJ0Rlc3Ryb3kgRW1wdHkgUGFuZXMnIGlzIGZhbHNlLCBvdGhlcndpc2UgaXQgd2lsbCBiZSByZW1vdmVkLlxuICAgIGNvbnN0IG5ld1BhbmUgPSBzcGxpdE9wZXJhdGlvbihwYW5lLCB7Y29weUFjdGl2ZUl0ZW06IGZhbHNlfSk7XG4gICAgY29uc3QgaXRlbSA9IHBhbmUuZ2V0QWN0aXZlSXRlbSgpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICBwYW5lLm1vdmVJdGVtVG9QYW5lKGl0ZW0sIG5ld1BhbmUsIDApO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzcGxpdFVwKCkge1xuICB0cmFja1NwbGl0KCd1cCcsIChwYW5lLCBwYXJhbXMpID0+IHBhbmUuc3BsaXRVcChwYXJhbXMpKTtcbn1cblxuZnVuY3Rpb24gc3BsaXREb3duKCkge1xuICB0cmFja1NwbGl0KCdkb3duJywgKHBhbmUsIHBhcmFtcykgPT4gcGFuZS5zcGxpdERvd24ocGFyYW1zKSk7XG59XG5cbmZ1bmN0aW9uIHNwbGl0UmlnaHQoKSB7XG4gIHRyYWNrU3BsaXQoJ3JpZ2h0JywgKHBhbmUsIHBhcmFtcykgPT4gcGFuZS5zcGxpdFJpZ2h0KHBhcmFtcykpO1xufVxuXG5mdW5jdGlvbiBzcGxpdExlZnQoKSB7XG4gIHRyYWNrU3BsaXQoJ2xlZnQnLCAocGFuZSwgcGFyYW1zKSA9PiBwYW5lLnNwbGl0TGVmdChwYXJhbXMpKTtcbn1cblxuY2xhc3MgQWN0aXZhdGlvbiB7XG4gIF9zdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKHN0YXRlOiA/T2JqZWN0KSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ251Y2xpZGUtbW92ZS1wYW5lOm1vdmUtdGFiLXRvLW5ldy1wYW5lLXVwJywgc3BsaXRVcClcbiAgICApO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdudWNsaWRlLW1vdmUtcGFuZTptb3ZlLXRhYi10by1uZXctcGFuZS1kb3duJywgc3BsaXREb3duKVxuICAgICk7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ251Y2xpZGUtbW92ZS1wYW5lOm1vdmUtdGFiLXRvLW5ldy1wYW5lLWxlZnQnLCBzcGxpdExlZnQpXG4gICAgKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAnbnVjbGlkZS1tb3ZlLXBhbmU6bW92ZS10YWItdG8tbmV3LXBhbmUtcmlnaHQnLCBzcGxpdFJpZ2h0KVxuICAgICk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG59XG5cbmxldCBhY3RpdmF0aW9uOiA/QWN0aXZhdGlvbiA9IG51bGw7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGFjdGl2YXRlKHN0YXRlOiA/bWl4ZWQpOiB2b2lkIHtcbiAgICBpZiAoIWFjdGl2YXRpb24pIHtcbiAgICAgIGFjdGl2YXRpb24gPSBuZXcgQWN0aXZhdGlvbigpO1xuICAgIH1cbiAgfSxcblxuICBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgIGlmIChhY3RpdmF0aW9uKSB7XG4gICAgICBhY3RpdmF0aW9uLmRpc3Bvc2UoKTtcbiAgICAgIGFjdGl2YXRpb24gPSBudWxsO1xuICAgIH1cbiAgfSxcbn07XG4iXX0=
