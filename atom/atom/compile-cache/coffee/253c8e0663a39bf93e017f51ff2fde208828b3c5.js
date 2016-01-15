(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, ScrollView, amountOfCommitsToShow, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  git = require('../git');

  GitShow = require('../models/git-show');

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  module.exports = LogListView = (function(_super) {
    __extends(LogListView, _super);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
        };
      })(this));
    };

    LogListView.prototype.onDidChangeTitle = function() {
      return new Disposable;
    };

    LogListView.prototype.onDidChangeModified = function() {
      return new Disposable;
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      LogListView.__super__.initialize.apply(this, arguments);
      this.skipCommits = 0;
      this.on('click', '.commit-row', (function(_this) {
        return function(_arg) {
          var currentTarget;
          currentTarget = _arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      return this.scroll((function(_this) {
        return function() {
          if (_this.scrollTop() + _this.height() === _this.prop('scrollHeight')) {
            return _this.getLog();
          }
        };
      })(this));
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length > 0) {
        separator = ';|';
        newline = '_.;._';
        data = data.substring(0, data.length - newline.length - 1);
        commits = data.split(newline).map(function(line) {
          var tmpData;
          if (line.trim() !== '') {
            tmpData = line.trim().split(separator);
            return {
              hashShort: tmpData[0],
              hash: tmpData[1],
              author: tmpData[2],
              email: tmpData[3],
              message: tmpData[4],
              date: tmpData[5]
            };
          }
        });
        return this.renderLog(commits);
      }
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += amountOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, "" + commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + commit.message);
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function(repo) {
      this.repo = repo;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(repo, currentFile) {
      this.repo = repo;
      this.currentFile = currentFile;
      this.onlyCurrentFile = true;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (amountOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return _this.parseData(data);
        };
      })(this));
    };

    return LogListView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RhdmlkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9sb2ctbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1R0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxrQkFBQSxVQUZULENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUpWLENBQUE7O0FBQUEsRUFNQSxxQkFBQSxHQUF3QixTQUFBLEdBQUE7V0FDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQURzQjtFQUFBLENBTnhCLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sa0NBQVA7QUFBQSxRQUEyQyxRQUFBLEVBQVUsQ0FBQSxDQUFyRDtPQUFMLEVBQThELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzVELEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxZQUFBLEVBQUEsRUFBSSxrQkFBSjtBQUFBLFlBQXdCLE1BQUEsRUFBUSxpQkFBaEM7V0FBUCxFQUQ0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

//# sourceURL=/Users/david/.atom/packages/git-plus/lib/views/log-list-view.coffee
