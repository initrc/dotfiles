{View, EditorView} = require 'atom'

module.exports =
class CommandPromptView extends View
  @content: ->
    @div class: 'terminal-runner overlay from-top', =>
      @div class: 'editor-container', outlet: 'editorContainer', =>
        editor = new EditorView(mini: true)
        editor.setPlaceholderText "enter command"
        @subview 'editor', editor

  initialize: (@terminalRunner, state) ->

  serialize: ->

  handleEvents: ->
    @editor.on 'core:confirm', @confirm
    @editor.on 'core:cancel', @deactivate
    @editor.find('input').on 'blur', @deactivate

  confirm: =>
    @terminalRunner.runCommand @editor.getText()
    @deactivate()

  focus: =>
    @removeClass('hidden')
    @editorContainer.find('.editor').focus()

  activate: ->
    if @hasParent()
      @focus()
    else
      atom.workspaceView.append(@)
      @focus()
      @handleEvents()

  deactivate: =>
    atom.workspaceView?.focus()
    @addClass('hidden')

  destroy: ->
    @detach()
