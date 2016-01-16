(function() {
  describe("atom-terminal-panel Testing terminal functionality", function() {
    var activationPromise, atp, executeCommand, initTerm, t, tests, workspaceElement, _ref;
    atp = null;
    _ref = [], activationPromise = _ref[0], workspaceElement = _ref[1];
    tests = {
      parseTemplateLabels: {
        'echo test %(label:badge:text:error)': 'echo test <span class="badge">error</span>',
        'echo test %(label:default:text:error)': 'echo test <span class="inline-block highlight">error</span>',
        'echo test %(label:primary:text:error)': 'echo test <span class="label label-primary">error</span>',
        'echo test %(label:success:text:error)': 'echo test <span class="inline-block highlight-success">error</span>',
        'echo test %(label:warning:text:error)': 'echo test <span class="inline-block highlight-warning">error</span>',
        'echo test %(label:danger:text:error)': 'echo test <span class="inline-block highlight-error">error</span>',
        'echo test %(label:error:text:error)': 'echo test <span class="inline-block highlight-error">error</span>'
      },
      parseTemplateUnusedVariables: {
        '%(-9999999999)%(-100)%(-5)%(-4)%(-3)%(-2)%(-1)%(0)%(1)%(2)%(3)%(99999999)': '',
        '%(foo)%(bar)%(crap)%(0.009)%(nope)': ''
      },
      util: {
        dir: [[["./a.txt", "b.txt"], "path", ["path/a.txt", "b.txt"]], [["./a.txt", "/non/relative/path/b.txt", "non/relative/path/c.txt"], "path", ["path/a.txt", "C:/non/relative/path/b.txt", "non/relative/path/c.txt"]], ["./sample.sample.smpl", "E:/user/test/example/falsy/path", "E:/user/test/example/falsy/path/sample.sample.smpl"]],
        getFileName: {
          'Z:/not/existing/strange/path/LOL/.././anything/test.lol.rar': 'test.lol.rar',
          'Z:/not/existing/path/to_the_file?/filename.b.c.d.extension': 'filename.b.c.d.extension',
          'C:/A/B/C/../../../D/EXAMPLE/PaTh/.file.txt': '.file.txt'
        },
        getFilePath: {
          'Z:/not/existing/strange/path/LOL/.././anything/test.lol.rar': 'Z:/not/existing/strange/path/LOL/.././anything/',
          'Z:/not/existing/path/to_the_file?/filename.b.c.d.extension': 'Z:/not/existing/path/to_the_file?/',
          'C:/A/B/C/../../../D/EXAMPLE/PaTh/.file.txt': 'C:/A/B/C/../../../D/EXAMPLE/PaTh/'
        },
        mkdir: [['__heeello', '__heeello/destiny'], '__test', '__anything', '__.op'],
        rename: [['__.op', '__.ops'], ['./__.ops', '__.op']],
        rmdir: ['__anything', '__test', '__.op', ['__heeello/destiny', '__heeello']]
      }
    };
    t = null;
    initTerm = (function(_this) {
      return function() {
        workspaceElement = atom.views.getView(atom.workspace);
        activationPromise = atom.packages.activatePackage('atom-terminal-panel');
        atp = atom.packages.getLoadedPackage('atom-terminal-panel').mainModule;
        return t = atp.getPanel().createCommandView();
      };
    })(this);
    executeCommand = function(name, callback) {
      atom.commands.dispatch(workspaceElement, 'atom-terminal-panel:' + name);
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      return initTerm();
    });
    it("tests basic modules presence", function() {
      return initTerm();
    });
    it("tests the console initialization (in the specs mode)", function() {
      return expect(initTerm).not.toThrow();
    });
    it("tests the terminal events dispatching", function() {
      executeCommand('toggle', function() {});
      executeCommand('new', function() {});
      executeCommand('next', function() {});
      executeCommand('prev', function() {});
      executeCommand('toggle-autocompletion', function() {});
      executeCommand('destroy', function() {});
      return executeCommand('new', function() {});
    });
    it("tests the console label parsing", function() {
      var k, v, _i, _len, _ref1, _results;
      _ref1 = tests.parseTemplateLabels;
      _results = [];
      for (v = _i = 0, _len = _ref1.length; _i < _len; v = ++_i) {
        k = _ref1[v];
        _results.push(expect(t.parseTemplate(k)).toBe(v));
      }
      return _results;
    });
    it("tests the console ability to remove unused variables", function() {
      var k, v, _i, _len, _ref1, _results;
      _ref1 = tests.parseTemplateUnusedVariables;
      _results = [];
      for (v = _i = 0, _len = _ref1.length; _i < _len; v = ++_i) {
        k = _ref1[v];
        _results.push(expect(t.parseTemplate(k)).toBe(v));
      }
      return _results;
    });
    it("test the \"echo test\" command", function() {
      return expect(function() {
        return t.exec("echo test");
      }).not.toThrow();
    });
    it("test the terminal.util.dir calls", function() {
      var k, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      t.cd('/');
      expect(t.util.os).not.toThrow();
      _ref1 = tests.util.dir;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        v = _ref1[_i];
        expect(t.util.dir(v[0], v[1])).toEqual(v[2]);
      }
      _ref2 = tests.util.getFileName;
      for (v = _j = 0, _len1 = _ref2.length; _j < _len1; v = ++_j) {
        k = _ref2[v];
        expect(t.util.getFileName(k)).toEqual(v);
      }
      _ref3 = tests.util.getFilePath;
      _results = [];
      for (v = _k = 0, _len2 = _ref3.length; _k < _len2; v = ++_k) {
        k = _ref3[v];
        _results.push(expect(t.util.getFilePath(k)).toEqual(v));
      }
      return _results;
    });
    it("test the terminal.util filesystem operations", function() {
      var e, k, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref2, _ref3, _ref4, _results;
      t.cd('/');
      _ref1 = tests.util.rmdir;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        k = _ref1[_i];
        try {
          t.util.rmdir(k);
        } catch (_error) {
          e = _error;
        }
      }
      _ref2 = tests.util.mkdir;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        k = _ref2[_j];
        expect(function() {
          return t.util.mkdir(k);
        }).not.toThrow();
      }
      _ref3 = tests.util.rename;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        k = _ref3[_k];
        expect(function() {
          return t.util.rename(k[0], k[1]);
        }).not.toThrow();
      }
      _ref4 = tests.util.rmdir;
      _results = [];
      for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
        k = _ref4[_l];
        _results.push(expect(function() {
          return t.util.rmdir(k);
        }).not.toThrow());
      }
      return _results;
    });
    it("tests the terminal choosen commands", function() {
      expect(function() {
        return t.onCommand('ls');
      }).not.toThrow();
      expect(function() {
        return t.onCommand('info');
      }).not.toThrow();
      return expect(function() {
        return t.onCommand('memdump');
      }).not.toThrow();
    });
    it("tests the terminal cwd (cp)", function() {
      var cwd, e;
      expect(function() {
        return t.cd('/');
      }).not.toThrow();
      cwd = t.getCwd();
      expect(cwd).toEqual(t.util.dir('/', ''));
      try {
        t.util.rmdir('/example_dir');
      } catch (_error) {
        e = _error;
      }
      expect(function() {
        return t.util.mkdir('/example_dir');
      }).not.toThrow();
      expect(function() {
        return t.cd(['/example_dir']);
      }).not.toThrow();
      return expect(t.getCwd()).toEqual(t.util.dir('./example_dir', cwd));
    });
    return it("tests terminal.removeQuotes()", function() {
      return expect(t.removeQuotes('\"Some examples3\'2\"1\'->?@#($)*@)#)\"\"\'asdsad\'')).toEqual('Some examples321->?@#($)*@)#)asdsad');
    });
  });


  /*
    t = core.init().createSpecsTerminal()
    tests =
      units:
        'tests the console label parsing':
          expect: [
            ['call', t.parseTemplate, 'toBe', 'echo test <span class="badge">error</span>']
          ]
  
  
    runTest = (tests) ->
      console.log 'called.runTest'
      if tests.init?
        tests.init.apply(v, [])
      for k, v of tests.units
        it k, ->
          console.log 'called.it'
          if v.init?
            v.init.apply(v, [])
          if v.beforeEach?
            beforeEach v.beforeEach
          if v.afterEach?
            afterEach v.afterEach
          for unit in v.expect
            expectation = unit
            value = null
            expectationStepsLength = expectation.length
            for i in [0..expectationStepsLength-1] by 1
              step = expectation[i]
              if step == 'call'
                if expectation[i+1] instanceof Array
                  functname = expectation[i+1][0]
                  expectation[i+1].shift()
                  value = expect(functname.apply(null, expectation[i+1]))
                else
                  value = expect((expectation[i+1])())
                ++i
                continue
              else if step == 'value'
                value = expect(expectation[i+1])
                ++i
                continue
              else if step == 'and'
                value = value.and
              else if step == 'throwError'
                value = value.throwError(expectation[i+1])
                ++i
                continue
              else if step == 'callThrough'
                value = value.callThrough()
              else if step == 'stub'
                value = value.stub()
              else if step == 'not'
                value = value.not
              else if step == 'toThrow'
                value = value.toThrow()
              else if step == 'toBe'
                value = value.toBe(expectation[i+1])
                ++i
                continue
              else if step == 'toBeNull'
                value = value.toBeNull()
              else if step == 'toEqual'
                value = value.toEqual(expectation[i+1])
                ++i
                continue
              else if step == 'toMatch'
                value = value.toMatch(expectation[i+1])
                ++i
                continue
              else if step == 'toThrowError'
                value = value.toThrowError(expectation[i+1])
                ++i
                continue
              else if step == 'toHaveBeenCalled'
                value = value.toHaveBeenCalled()
              else if step == 'toHaveBeenCalledWith'
                value = value.toHaveBeenCalledWith.apply(this, expectation[i+1])
                ++i
                continue
              else if step == 'toBeDefined'
                value = value.toBeDefined()
              else if step == 'toBeUndefined'
                value = value.toBeUndefined()
  
    runTest tests
   */

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC1wYW5lbC9zcGVjL3Rlcm1pbmFsLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxvREFBVCxFQUErRCxTQUFBLEdBQUE7QUFFN0QsUUFBQSxrRkFBQTtBQUFBLElBQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTtBQUFBLElBQ0EsT0FBd0MsRUFBeEMsRUFBQywyQkFBRCxFQUFvQiwwQkFEcEIsQ0FBQTtBQUFBLElBR0EsS0FBQSxHQUNFO0FBQUEsTUFBQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxxQ0FBQSxFQUF1Qyw0Q0FBdkM7QUFBQSxRQUNBLHVDQUFBLEVBQXlDLDZEQUR6QztBQUFBLFFBRUEsdUNBQUEsRUFBeUMsMERBRnpDO0FBQUEsUUFHQSx1Q0FBQSxFQUF5QyxxRUFIekM7QUFBQSxRQUlBLHVDQUFBLEVBQXlDLHFFQUp6QztBQUFBLFFBS0Esc0NBQUEsRUFBd0MsbUVBTHhDO0FBQUEsUUFNQSxxQ0FBQSxFQUF1QyxtRUFOdkM7T0FERjtBQUFBLE1BUUEsNEJBQUEsRUFDRTtBQUFBLFFBQUEsMkVBQUEsRUFBNkUsRUFBN0U7QUFBQSxRQUNBLG9DQUFBLEVBQXNDLEVBRHRDO09BVEY7QUFBQSxNQVdBLElBQUEsRUFDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLENBQ0gsQ0FDRSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBREYsRUFFRSxNQUZGLEVBR0UsQ0FBRSxZQUFGLEVBQWdCLE9BQWhCLENBSEYsQ0FERyxFQU1ILENBQ0UsQ0FBQyxTQUFELEVBQVksMEJBQVosRUFBd0MseUJBQXhDLENBREYsRUFFRSxNQUZGLEVBR0UsQ0FBRSxZQUFGLEVBQWdCLDRCQUFoQixFQUE4Qyx5QkFBOUMsQ0FI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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/atom-terminal-panel/spec/terminal-spec.coffee
