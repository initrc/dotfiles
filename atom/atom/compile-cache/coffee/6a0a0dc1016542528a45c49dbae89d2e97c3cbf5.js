(function() {
  var MARKER_REGEXP, addCustomMatchers, getDecorations, getView, getVisibleBufferRowRange, setConfig, _;

  _ = require('underscore-plus');

  MARKER_REGEXP = /^quick-highlight/;

  getDecorations = function(editor) {
    return editor.getHighlightDecorations().filter(function(d) {
      return d.properties["class"].match(MARKER_REGEXP);
    });
  };

  getView = function(model) {
    return atom.views.getView(model);
  };

  getVisibleBufferRowRange = function(editor) {
    return getView(editor).getVisibleRowRange().map(function(row) {
      return editor.bufferRowForScreenRow(row);
    });
  };

  setConfig = function(name, value) {
    return atom.config.set("quick-highlight." + name, value);
  };

  addCustomMatchers = function(spec) {
    var getNotText;
    getNotText = function() {
      if (spec.isNot) {
        return " not";
      } else {
        return "";
      }
    };
    return spec.addMatchers({
      toHaveDecorations: function(expected) {
        var d, decos, editor, lengthOK, notText, pattern, texts;
        notText = getNotText();
        editor = this.actual;
        decos = getDecorations(editor);
        if (expected.color != null) {
          pattern = RegExp("" + (_.escapeRegExp(expected.color)));
          decos = decos.filter(function(d) {
            return d.properties["class"].match(pattern);
          });
        }
        lengthOK = decos.length === expected.length;
        if (expected.length === 0) {
          return lengthOK;
        } else {
          texts = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = decos.length; _i < _len; _i++) {
              d = decos[_i];
              _results.push(editor.getTextInBufferRange(d.getMarker().getBufferRange()));
            }
            return _results;
          })();
          this.message = function() {
            return "Expected " + (jasmine.pp(texts)) + ", length: " + texts.length + " to" + notText + " " + (jasmine.pp(expected));
          };
          return lengthOK && _.all(texts, function(text) {
            return text === expected.text;
          });
        }
      },
      lengthOfDecorationsToBe: function(expected) {
        return getDecorations(this.actual).length === expected;
      },
      toHaveAllMarkerDestoyed: function(expected) {
        var d, editor, results;
        editor = this.actual;
        results = (function() {
          var _i, _len, _ref, _results;
          _ref = getDecorations(editor);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            d = _ref[_i];
            _results.push(d.getMarker().isDestroyed());
          }
          return _results;
        })();
        return _.all(results);
      },
      toBeActiveEditor: function() {
        return this.actual === atom.workspace.getActiveTextEditor();
      }
    });
  };

  describe("quick-highlight", function() {
    var dispatchCommand, editor, editorContent, editorElement, main, pathSample1, pathSample2, workspaceElement, _ref;
    _ref = [], editor = _ref[0], editorContent = _ref[1], editorElement = _ref[2], main = _ref[3], workspaceElement = _ref[4], pathSample1 = _ref[5], pathSample2 = _ref[6];
    dispatchCommand = function(command, _arg) {
      var element;
      element = (_arg != null ? _arg : {}).element;
      if (element == null) {
        element = editorElement;
      }
      return atom.commands.dispatch(element, command);
    };
    beforeEach(function() {
      var activationPromise;
      addCustomMatchers(this);
      spyOn(_._, "now").andCallFake(function() {
        return window.now;
      });
      workspaceElement = getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      activationPromise = null;
      editorContent = "orange\n    apple\norange\n    apple\norange\n    apple";
      waitsForPromise(function() {
        return atom.workspace.open('sample-1').then(function(e) {
          editor = e;
          return editor.setText(editorContent);
        });
      });
      runs(function() {
        editorElement = getView(editor);
        editor.setCursorBufferPosition([0, 0]);
        activationPromise = atom.packages.activatePackage("quick-highlight").then(function(pack) {
          return main = pack.mainModule;
        });
        return dispatchCommand('quick-highlight:toggle');
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe("quick-highlight:toggle", function() {
      it("decorate keyword under cursor", function() {
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(false);
        return expect(editor).toHaveDecorations({
          length: 3,
          color: '01',
          text: 'orange'
        });
      });
      it("remove decoration when if already decorated", function() {
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(false);
        expect(editor).lengthOfDecorationsToBe(3);
        dispatchCommand('quick-highlight:toggle');
        expect(main.keywords.has('orange')).toBe(false);
        expect(main.keywords.has('apple')).toBe(false);
        return expect(editor).lengthOfDecorationsToBe(0);
      });
      it("can decorate multiple keyword simultaneously", function() {
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(false);
        expect(editor).lengthOfDecorationsToBe(3);
        editor.setCursorScreenPosition([1, 12]);
        dispatchCommand('quick-highlight:toggle');
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(true);
        expect(editor).lengthOfDecorationsToBe(6);
        expect(editor).toHaveDecorations({
          color: '01',
          length: 3,
          text: 'orange'
        });
        return expect(editor).toHaveDecorations({
          color: '02',
          length: 3,
          text: 'apple'
        });
      });
      return it("destroy decoration when editor is destroyed", function() {
        expect(main.keywords.has('orange')).toBe(true);
        expect(editor).lengthOfDecorationsToBe(3);
        editor.destroy();
        return expect(editor).toHaveAllMarkerDestoyed();
      });
    });
    describe("quick-highlight:clear", function() {
      return it("clear all decorations", function() {
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(false);
        expect(editor).lengthOfDecorationsToBe(3);
        editor.setCursorScreenPosition([1, 12]);
        dispatchCommand('quick-highlight:toggle');
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(true);
        expect(editor).lengthOfDecorationsToBe(6);
        dispatchCommand('quick-highlight:clear');
        expect(editor).lengthOfDecorationsToBe(0);
        expect(main.keywords.has('orange')).toBe(false);
        expect(main.keywords.has('apple')).toBe(false);
        expect(editor).toHaveAllMarkerDestoyed();
        return expect(main.decorationsByEditor.has(editor)).toBe(false);
      });
    });
    describe("multiple editors is displayed", function() {
      var editor2, editor2Element, _ref1;
      _ref1 = [], editor2 = _ref1[0], editor2Element = _ref1[1];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample-2', {
            split: 'right'
          }).then(function(e) {
            editor2 = e;
            editor2.setText(editorContent);
            editor2Element = getView(editor2);
            return editor2.setCursorBufferPosition([0, 0]);
          });
        });
        return runs(function() {
          expect(editor2).toBeActiveEditor();
          dispatchCommand('quick-highlight:clear');
          expect(editor).lengthOfDecorationsToBe(0);
          expect(main.decorationsByEditor.has(editor)).toBe(false);
          expect(editor2).lengthOfDecorationsToBe(0);
          return expect(main.decorationsByEditor.has(editor2)).toBe(false);
        });
      });
      it("can decorate keyword across visible editors", function() {
        dispatchCommand('quick-highlight:toggle', editor2Element);
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(false);
        expect(editor).toHaveDecorations({
          color: '01',
          length: 3,
          text: 'orange'
        });
        return expect(editor2).toHaveDecorations({
          color: '01',
          length: 3,
          text: 'orange'
        });
      });
      it("clear selectionDecorations when activePane changed", function() {
        dispatchCommand('core:select-right', {
          element: editor2Element
        });
        dispatchCommand('core:select-right', {
          element: editor2Element
        });
        advanceClock(150);
        expect(editor2.getSelectedText()).toBe("or");
        expect(getDecorations(editor2)).toHaveLength(3);
        dispatchCommand('window:focus-next-pane', {
          element: editor2Element
        });
        expect(editor).toBeActiveEditor();
        return expect(getDecorations(editor2)).toHaveLength(0);
      });
      return it("decorate keywords when new editor was opened", function() {
        var editor3, pathSample3;
        dispatchCommand('quick-highlight:toggle', editor2Element);
        expect(main.keywords.has('orange')).toBe(true);
        expect(main.keywords.has('apple')).toBe(false);
        editor3 = null;
        pathSample3 = atom.project.resolvePath("sample-3");
        waitsForPromise(function() {
          return atom.workspace.open(pathSample3, {
            split: 'right'
          }).then(function(e) {
            return editor3 = e;
          });
        });
        return runs(function() {
          expect(editor).toHaveDecorations({
            color: '01',
            length: 3,
            text: 'orange'
          });
          expect(editor2).toHaveDecorations({
            color: '01',
            length: 3,
            text: 'orange'
          });
          return expect(editor3).toHaveDecorations({
            color: '01',
            length: 3,
            text: 'orange'
          });
        });
      });
    });
    describe("selection changed when highlightSelection", function() {
      beforeEach(function() {
        dispatchCommand('quick-highlight:clear');
        expect(editor).lengthOfDecorationsToBe(0);
        expect(main.keywords.has('orange')).toBe(false);
        expect(main.keywords.has('apple')).toBe(false);
        expect(editor).toHaveAllMarkerDestoyed();
        return expect(main.decorationsByEditor.has(editor)).toBe(false);
      });
      it("decorate selected keyword", function() {
        dispatchCommand('editor:select-word');
        advanceClock(150);
        return expect(editor).toHaveDecorations({
          length: 3,
          color: 'selection',
          text: 'orange'
        });
      });
      it("clear decoration when selection is cleared", function() {
        dispatchCommand('editor:select-word');
        advanceClock(150);
        expect(editor).toHaveDecorations({
          length: 3,
          color: 'selection',
          text: 'orange'
        });
        editor.clearSelections();
        advanceClock(150);
        return expect(getDecorations(editor)).toHaveLength(0);
      });
      it("won't decorate selectedText length is less than highlightSelectionMinimumLength", function() {
        setConfig('highlightSelectionMinimumLength', 3);
        dispatchCommand('core:select-right');
        advanceClock(150);
        expect(editor.getSelectedText()).toBe("o");
        expect(getDecorations(editor)).toHaveLength(0);
        dispatchCommand('core:select-right');
        advanceClock(150);
        expect(editor.getSelectedText()).toBe("or");
        expect(getDecorations(editor)).toHaveLength(0);
        dispatchCommand('core:select-right');
        advanceClock(150);
        expect(editor.getSelectedText()).toBe("ora");
        return expect(editor).toHaveDecorations({
          color: 'selection',
          length: 3,
          text: 'ora'
        });
      });
      it("won't decorate when selection is all white space", function() {
        var end, start, _ref1;
        editor.setCursorBufferPosition([1, 0]);
        dispatchCommand('core:select-right');
        dispatchCommand('core:select-right');
        advanceClock(150);
        _ref1 = editor.getLastSelection().getBufferRange(), start = _ref1.start, end = _ref1.end;
        expect(start).toEqual([1, 0]);
        expect(end).toEqual([1, 4]);
        return expect(getDecorations(editor)).toHaveLength(0);
      });
      it("won't decorate when selection is multi-line", function() {
        editor.setCursorBufferPosition([1, 0]);
        dispatchCommand('core:select-down');
        advanceClock(150);
        expect(editor.getLastSelection().isEmpty()).toBe(false);
        return expect(getDecorations(editor)).toHaveLength(0);
      });
      it("won't decorate when highlightSelection is disabled", function() {
        setConfig('highlightSelection', false);
        dispatchCommand('editor:select-word');
        advanceClock(150);
        expect(editor.getSelectedText()).toBe("orange");
        return expect(getDecorations(editor)).toHaveLength(0);
      });
      describe("highlightSelectionExcludeScopes", function() {
        beforeEach(function() {
          return setConfig('highlightSelectionExcludeScopes', ['foo.bar', 'hoge']);
        });
        it("won't decorate when editor have specified scope case-1", function() {
          editorElement.classList.add('foo', 'bar');
          dispatchCommand('editor:select-word');
          advanceClock(150);
          expect(editor.getSelectedText()).toBe("orange");
          return expect(getDecorations(editor)).toHaveLength(0);
        });
        return it("won't decorate when editor have specified scope case-2", function() {
          editorElement.classList.add('hoge');
          dispatchCommand('editor:select-word');
          advanceClock(150);
          expect(editor.getSelectedText()).toBe("orange");
          return expect(getDecorations(editor)).toHaveLength(0);
        });
      });
      return describe("highlightSelectionDelay", function() {
        beforeEach(function() {
          return setConfig('highlightSelectionDelay', 300);
        });
        return it("highlight selection after specified delay", function() {
          dispatchCommand('editor:select-word');
          advanceClock(150);
          expect(editor.getSelectedText()).toBe("orange");
          expect(getDecorations(editor)).toHaveLength(0);
          advanceClock(150);
          return expect(editor).toHaveDecorations({
            color: 'selection',
            length: 3,
            text: 'orange'
          });
        });
      });
    });
    return describe("editor is scrolled", function() {
      var editor4, editorElement4, lineHeightPx, rowsPerPage, scroll, _ref1;
      _ref1 = [], editor4 = _ref1[0], editorElement4 = _ref1[1];
      lineHeightPx = 10;
      rowsPerPage = 10;
      scroll = function(editor) {
        var amountInPixel, el;
        el = getView(editor);
        amountInPixel = editor.getRowsPerPage() * editor.getLineHeightInPixels();
        return el.setScrollTop(el.getScrollTop() + amountInPixel);
      };
      beforeEach(function() {
        var pathSample4;
        runs(function() {
          return dispatchCommand('quick-highlight:clear');
        });
        pathSample4 = atom.project.resolvePath("sample-4");
        waitsForPromise(function() {
          return atom.workspace.open(pathSample4).then(function(e) {
            editor4 = e;
            editorElement4 = getView(editor4);
            editorElement4.setHeight(rowsPerPage * lineHeightPx);
            editorElement4.style.font = "12px monospace";
            editorElement4.style.lineHeight = "" + lineHeightPx + "px";
            return atom.views.performDocumentPoll();
          });
        });
        return runs(function() {
          editor4.setCursorScreenPosition([1, 0]);
          dispatchCommand('quick-highlight:toggle', {
            element: editorElement4
          });
          editor4.setCursorBufferPosition([3, 0]);
          dispatchCommand('quick-highlight:toggle', {
            element: editorElement4
          });
          expect(main.keywords.has('orange')).toBe(true);
          return expect(main.keywords.has('apple')).toBe(true);
        });
      });
      describe("decorate only visible area", function() {
        return it("update decoration on scroll", function() {
          expect(editor4).toHaveDecorations({
            color: '01',
            length: 1,
            text: 'orange'
          });
          expect(editor4).toHaveDecorations({
            color: '02',
            length: 1,
            text: 'apple'
          });
          scroll(editor4);
          expect(editor4).toHaveDecorations({
            color: '01',
            length: 2,
            text: 'orange'
          });
          expect(editor4).toHaveDecorations({
            color: '02',
            length: 1,
            text: 'apple'
          });
          scroll(editor4);
          expect(editor4).toHaveDecorations({
            color: '01',
            length: 0
          });
          return expect(editor4).toHaveDecorations({
            color: '02',
            length: 3,
            text: 'apple'
          });
        });
      });
      describe("::getCountForKeyword", function() {
        return it('return count of keyword within editor', function() {
          expect(main.getCountForKeyword(editor4, 'orange')).toBe(3);
          return expect(main.getCountForKeyword(editor4, 'apple')).toBe(5);
        });
      });
      return describe("displayCountOnStatusBar", function() {
        var container, span, _ref2;
        _ref2 = [], container = _ref2[0], span = _ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage("status-bar");
          });
          waitsFor(function() {
            return main.statusBarManager.tile != null;
          });
          return runs(function() {
            dispatchCommand('quick-highlight:clear', {
              element: editorElement4
            });
            editor4.setCursorScreenPosition([1, 0]);
            dispatchCommand('quick-highlight:toggle', {
              element: editorElement4
            });
            expect(editor4).toHaveDecorations({
              color: '01',
              length: 1,
              text: 'orange'
            });
            container = workspaceElement.querySelector('#status-bar-quick-highlight');
            return span = container.querySelector('span');
          });
        });
        it('display latest highlighted count on statusbar', function() {
          expect(container.style.display).toBe('inline-block');
          expect(span.textContent).toBe('3');
          editor4.setCursorScreenPosition([3, 0]);
          dispatchCommand('quick-highlight:toggle', {
            element: editorElement4
          });
          expect(editor4).toHaveDecorations({
            color: '02',
            length: 1,
            text: 'apple'
          });
          expect(container.style.display).toBe('inline-block');
          return expect(span.textContent).toBe('5');
        });
        return it('hide count when decoration cleared', function() {
          dispatchCommand('quick-highlight:toggle', {
            element: editorElement4
          });
          expect(editor4).lengthOfDecorationsToBe(0);
          return expect(container.style.display).toBe('none');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL3F1aWNrLWhpZ2hsaWdodC9zcGVjL3F1aWNrLWhpZ2hsaWdodC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpR0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixrQkFGaEIsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsU0FBQyxNQUFELEdBQUE7V0FDZixNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLE1BQWpDLENBQXdDLFNBQUMsQ0FBRCxHQUFBO2FBQ3RDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBRCxDQUFNLENBQUMsS0FBbkIsQ0FBeUIsYUFBekIsRUFEc0M7SUFBQSxDQUF4QyxFQURlO0VBQUEsQ0FMakIsQ0FBQTs7QUFBQSxFQVNBLE9BQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtXQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixLQUFuQixFQURRO0VBQUEsQ0FUVixDQUFBOztBQUFBLEVBWUEsd0JBQUEsR0FBMkIsU0FBQyxNQUFELEdBQUE7V0FDekIsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLGtCQUFoQixDQUFBLENBQW9DLENBQUMsR0FBckMsQ0FBeUMsU0FBQyxHQUFELEdBQUE7YUFDdkMsTUFBTSxDQUFDLHFCQUFQLENBQTZCLEdBQTdCLEVBRHVDO0lBQUEsQ0FBekMsRUFEeUI7RUFBQSxDQVozQixDQUFBOztBQUFBLEVBZ0JBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7V0FDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBaUIsa0JBQUEsR0FBa0IsSUFBbkMsRUFBMkMsS0FBM0MsRUFEVTtFQUFBLENB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

//# sourceURL=/Users/david/.atom/packages/quick-highlight/spec/quick-highlight-spec.coffee
