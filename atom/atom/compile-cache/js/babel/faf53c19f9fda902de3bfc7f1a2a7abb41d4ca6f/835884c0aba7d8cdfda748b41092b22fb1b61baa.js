'use babel';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var View = (function () {
  function View(name, dependencies) {
    _classCallCheck(this, View);

    this.name = name;
    this.dependencies = dependencies;

    var progress = this.progress = document.createElement('progress');
    progress.max = dependencies.length;
    progress.value = 0;
    progress.classList.add('display-inline');
    progress.style.width = '100%';

    this.notification = this.element = null;
  }

  _createClass(View, [{
    key: 'show',
    value: function show() {
      var _this = this;

      this.notification = atom.notifications.addInfo('Installing ' + this.name + ' dependencies', {
        detail: 'Installing ' + this.dependencies.join(', '),
        dismissable: true
      });
      this.element = document.createElement('div'); // placeholder
      setTimeout(function () {
        try {
          _this.element = atom.views.getView(_this.notification);

          var content = _this.element.querySelector('.detail-content');
          if (content) {
            content.appendChild(_this.progress);
          }
        } catch (_) {}
      }, 20);
    }
  }, {
    key: 'advance',
    value: function advance() {
      this.progress.value++;
      if (this.progress.value === this.progress.max) {
        var content = this.element.querySelector('.detail-content');
        var title = this.element.querySelector('.message p');

        if (content) {
          content.textContent = 'Installed ' + this.dependencies.join(', ');
        }
        if (title) {
          title.textContent = 'Installed ' + this.name + ' dependencies';
        }

        this.element.classList.remove('info');
        this.element.classList.remove('icon-info');
        this.element.classList.add('success');
        this.element.classList.add('icon-check');
      }
    }
  }]);

  return View;
})();

exports.View = View;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kc2hpL2NvZGUvZG90ZmlsZXMvYXRvbS9hdG9tL3BhY2thZ2VzL2xpbnRlci1qYXZhYy9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7SUFDRSxJQUFJO0FBQ0osV0FEQSxJQUFJLENBQ0gsSUFBSSxFQUFFLFlBQVksRUFBRTswQkFEckIsSUFBSTs7QUFFYixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTs7QUFFaEMsUUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ25FLFlBQVEsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQTtBQUNsQyxZQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTtBQUNsQixZQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3hDLFlBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQTs7QUFFN0IsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtHQUN4Qzs7ZUFaVSxJQUFJOztXQWFYLGdCQUFHOzs7QUFDTCxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxpQkFBZSxJQUFJLENBQUMsSUFBSSxvQkFBaUI7QUFDckYsY0FBTSxrQkFBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUU7QUFDcEQsbUJBQVcsRUFBRSxJQUFJO09BQ2xCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QyxnQkFBVSxDQUFDLFlBQU07QUFDZixZQUFJO0FBQ0YsZ0JBQUssT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQUssWUFBWSxDQUFDLENBQUE7O0FBRXBELGNBQU0sT0FBTyxHQUFHLE1BQUssT0FBTyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQzdELGNBQUksT0FBTyxFQUFFO0FBQ1gsbUJBQU8sQ0FBQyxXQUFXLENBQUMsTUFBSyxRQUFRLENBQUMsQ0FBQTtXQUNuQztTQUNGLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRztPQUNoQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQ1A7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQzdDLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDN0QsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRXRELFlBQUksT0FBTyxFQUFFO0FBQ1gsaUJBQU8sQ0FBQyxXQUFXLGtCQUFnQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBRSxDQUFBO1NBQ2xFO0FBQ0QsWUFBSSxLQUFLLEVBQUU7QUFDVCxlQUFLLENBQUMsV0FBVyxrQkFBZ0IsSUFBSSxDQUFDLElBQUksa0JBQWUsQ0FBQTtTQUMxRDs7QUFFRCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzFDLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7T0FDekM7S0FDRjs7O1NBaERVLElBQUkiLCJmaWxlIjoiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvbGludGVyLWphdmFjL25vZGVfbW9kdWxlcy9hdG9tLXBhY2thZ2UtZGVwcy9saWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5leHBvcnQgY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGRlcGVuZGVuY2llcykge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llc1xuXG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJvZ3Jlc3MnKVxuICAgIHByb2dyZXNzLm1heCA9IGRlcGVuZGVuY2llcy5sZW5ndGhcbiAgICBwcm9ncmVzcy52YWx1ZSA9IDBcbiAgICBwcm9ncmVzcy5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5LWlubGluZScpXG4gICAgcHJvZ3Jlc3Muc3R5bGUud2lkdGggPSAnMTAwJSdcblxuICAgIHRoaXMubm90aWZpY2F0aW9uID0gdGhpcy5lbGVtZW50ID0gbnVsbFxuICB9XG4gIHNob3coKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhgSW5zdGFsbGluZyAke3RoaXMubmFtZX0gZGVwZW5kZW5jaWVzYCwge1xuICAgICAgZGV0YWlsOiBgSW5zdGFsbGluZyAke3RoaXMuZGVwZW5kZW5jaWVzLmpvaW4oJywgJyl9YCxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSlcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAvLyBwbGFjZWhvbGRlclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMubm90aWZpY2F0aW9uKVxuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRldGFpbC1jb250ZW50JylcbiAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKHRoaXMucHJvZ3Jlc3MpXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF8pIHsgfVxuICAgIH0sIDIwKVxuICB9XG4gIGFkdmFuY2UoKSB7XG4gICAgdGhpcy5wcm9ncmVzcy52YWx1ZSsrXG4gICAgaWYgKHRoaXMucHJvZ3Jlc3MudmFsdWUgPT09IHRoaXMucHJvZ3Jlc3MubWF4KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXRhaWwtY29udGVudCcpXG4gICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZSBwJylcblxuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgY29udGVudC50ZXh0Q29udGVudCA9IGBJbnN0YWxsZWQgJHt0aGlzLmRlcGVuZGVuY2llcy5qb2luKCcsICcpfWBcbiAgICAgIH1cbiAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IGBJbnN0YWxsZWQgJHt0aGlzLm5hbWV9IGRlcGVuZGVuY2llc2BcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2luZm8nKVxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24taW5mbycpXG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3VjY2VzcycpXG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaWNvbi1jaGVjaycpXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/linter-javac/node_modules/atom-package-deps/lib/view.js
