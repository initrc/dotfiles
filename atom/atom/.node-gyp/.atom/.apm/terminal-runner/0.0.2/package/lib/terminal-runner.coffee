CommandPromptView = require './terminal-runner/command-prompt-view'

module.exports =
  commandPromptView: null
  terminalSession: null

  activate: (state) ->
    @commandPromptView = new CommandPromptView(this, state.commandPromptState)

    atom.workspaceView.command 'terminal-runner:run-command', => @activateCommandPrompt()
    atom.workspaceView.command 'terminal-runner:run-last-command', => @runLastCommand()

  deactivate: ->
    @commandPromptView.destroy()

  serialize: ->
    commandPromptState: @commandPromptView.serialize()

  activateCommandPrompt: ->
    @commandPromptView.activate()

  createTerminalSession: ->
    lastActivePane = atom.workspace.activePane
    lastActivePaneItem = atom.workspace.activePaneItem
    atom.workspace.activePane.splitRight()

    path = atom.project.getPath() ? '~'
    atom.workspaceView.open("terminal://#{path}").then (session) =>
      @terminalSession = session
      session.on 'exit', => @terminalSession = null

      lastActivePane.activate()
      lastActivePane.activateItem(lastActivePaneItem)

  runCommand: (command) ->
    return unless command
    @lastCommand = command

    unless @terminalSession && @terminalSession.process.childProcess
      @createTerminalSession().then =>
        @runCommand(command)
      return

    @terminalSession.emit 'input', command + '\x0a'

  runLastCommand: ->
    if @lastCommand
      @runCommand @lastCommand
    else
      @toggleCommandPrompt()
