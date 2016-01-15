{WorkspaceView} = require 'atom'

TerminalRunner = require '../lib/terminal-runner'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "TerminalRunner", ->
  activationPromise = null

  beforeEach ->
    atom.workspaceView = new WorkspaceView
    activationPromise = atom.packages.activatePackage('terminal-runner')

  describe "when the terminal-runner:run-command event is triggered", ->
    it "attaches the command prompt view", ->
      expect(atom.workspaceView.find('.terminal-runner')).not.toExist()

      # This is an activation event, triggering it will cause the package to be
      # activated.
      atom.workspaceView.trigger 'terminal-runner:run-command'

      waitsForPromise ->
        activationPromise

      runs ->
        expect(atom.workspaceView.find('.terminal-runner')).toExist()
