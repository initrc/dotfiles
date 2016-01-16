Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;

var _helpers = require('./helpers');

// Renamed for backward compatibility
'use babel';
var FS = require('fs');
var Path = require('path');

var _require = require('./view');

var View = _require.View;
if (typeof window.__steelbrain_package_deps === 'undefined') {
  window.__steelbrain_package_deps = new Set();
}

function install() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var enablePackages = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  if (!name) {
    var filePath = require('sb-callsite').capture()[1].file;
    name = (0, _helpers.guessName)(filePath);
    if (!name) {
      console.log('Unable to get package name for file: ' + filePath);
      return Promise.resolve();
    }
  }

  var _packagesToInstall = (0, _helpers.packagesToInstall)(name);

  var toInstall = _packagesToInstall.toInstall;
  var toEnable = _packagesToInstall.toEnable;

  var promise = Promise.resolve();

  if (enablePackages && toEnable.length) {
    promise = toEnable.reduce(function (promise, name) {
      atom.packages.enablePackage(name);
      return atom.packages.activatePackage(name);
    }, promise);
  }
  if (toInstall.length) {
    (function () {
      var view = new View(name, toInstall);
      promise = Promise.all([view.show(), promise]).then(function () {
        return (0, _helpers.installPackages)(toInstall, function (name, status) {
          if (status) {
            view.advance();
          } else {
            atom.notifications.addError('Error Installing ' + name, { detail: 'Something went wrong. Try installing this package manually.' });
          }
        });
      });
    })();
  }

  return promise;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kc2hpL2NvZGUvZG90ZmlsZXMvYXRvbS9hdG9tL3BhY2thZ2VzL2xpbnRlci1qYXZhYy9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7dUJBSTRELFdBQVc7OztBQUp2RSxXQUFXLENBQUE7QUFDWCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztlQUNiLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0lBQXpCLElBQUksWUFBSixJQUFJO0FBSVgsSUFBSSxPQUFPLE1BQU0sQ0FBQyx5QkFBeUIsS0FBSyxXQUFXLEVBQUU7QUFDM0QsUUFBTSxDQUFDLHlCQUF5QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7Q0FDN0M7O0FBRU0sU0FBUyxPQUFPLEdBQXNDO01BQXJDLElBQUkseURBQUcsSUFBSTtNQUFFLGNBQWMseURBQUcsS0FBSzs7QUFDekQsTUFBSSxDQUFDLElBQUksRUFBRTtBQUNULFFBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7QUFDekQsUUFBSSxHQUFHLHdCQUFVLFFBQVEsQ0FBQyxDQUFBO0FBQzFCLFFBQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxhQUFPLENBQUMsR0FBRywyQ0FBeUMsUUFBUSxDQUFHLENBQUE7QUFDL0QsYUFBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDekI7R0FDRjs7MkJBQzZCLGdDQUFrQixJQUFJLENBQUM7O01BQTlDLFNBQVMsc0JBQVQsU0FBUztNQUFFLFFBQVEsc0JBQVIsUUFBUTs7QUFDMUIsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBOztBQUUvQixNQUFJLGNBQWMsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFdBQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNoRCxVQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzNDLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDWjtBQUNELE1BQUksU0FBUyxDQUFDLE1BQU0sRUFBRTs7QUFDcEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3RDLGFBQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDNUQsZUFBTyw4QkFBZ0IsU0FBUyxFQUFFLFVBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN2RCxjQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7V0FDZixNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSx1QkFBcUIsSUFBSSxFQUFJLEVBQUMsTUFBTSxFQUFFLDZEQUE2RCxFQUFDLENBQUMsQ0FBQTtXQUNqSTtTQUNGLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTs7R0FDSDs7QUFFRCxTQUFPLE9BQU8sQ0FBQTtDQUNmIiwiZmlsZSI6Ii9Vc2Vycy9kc2hpL2NvZGUvZG90ZmlsZXMvYXRvbS9hdG9tL3BhY2thZ2VzL2xpbnRlci1qYXZhYy9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuY29uc3QgRlMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBQYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCB7Vmlld30gPSByZXF1aXJlKCcuL3ZpZXcnKVxuaW1wb3J0IHtndWVzc05hbWUsIGluc3RhbGxQYWNrYWdlcywgcGFja2FnZXNUb0luc3RhbGx9IGZyb20gJy4vaGVscGVycydcblxuLy8gUmVuYW1lZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuaWYgKHR5cGVvZiB3aW5kb3cuX19zdGVlbGJyYWluX3BhY2thZ2VfZGVwcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93Ll9fc3RlZWxicmFpbl9wYWNrYWdlX2RlcHMgPSBuZXcgU2V0KClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGwobmFtZSA9IG51bGwsIGVuYWJsZVBhY2thZ2VzID0gZmFsc2UpIHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSByZXF1aXJlKCdzYi1jYWxsc2l0ZScpLmNhcHR1cmUoKVsxXS5maWxlXG4gICAgbmFtZSA9IGd1ZXNzTmFtZShmaWxlUGF0aClcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBVbmFibGUgdG8gZ2V0IHBhY2thZ2UgbmFtZSBmb3IgZmlsZTogJHtmaWxlUGF0aH1gKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuICB9XG4gIGNvbnN0IHt0b0luc3RhbGwsIHRvRW5hYmxlfSA9IHBhY2thZ2VzVG9JbnN0YWxsKG5hbWUpXG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKClcblxuICBpZiAoZW5hYmxlUGFja2FnZXMgJiYgdG9FbmFibGUubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHRvRW5hYmxlLnJlZHVjZShmdW5jdGlvbihwcm9taXNlLCBuYW1lKSB7XG4gICAgICBhdG9tLnBhY2thZ2VzLmVuYWJsZVBhY2thZ2UobmFtZSlcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShuYW1lKVxuICAgIH0sIHByb21pc2UpXG4gIH1cbiAgaWYgKHRvSW5zdGFsbC5sZW5ndGgpIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFZpZXcobmFtZSwgdG9JbnN0YWxsKVxuICAgIHByb21pc2UgPSBQcm9taXNlLmFsbChbdmlldy5zaG93KCksIHByb21pc2VdKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluc3RhbGxQYWNrYWdlcyh0b0luc3RhbGwsIGZ1bmN0aW9uKG5hbWUsIHN0YXR1cykge1xuICAgICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICAgdmlldy5hZHZhbmNlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEVycm9yIEluc3RhbGxpbmcgJHtuYW1lfWAsIHtkZXRhaWw6ICdTb21ldGhpbmcgd2VudCB3cm9uZy4gVHJ5IGluc3RhbGxpbmcgdGhpcyBwYWNrYWdlIG1hbnVhbGx5Lid9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gcHJvbWlzZVxufVxuIl19
//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/linter-javac/node_modules/atom-package-deps/lib/main.js
