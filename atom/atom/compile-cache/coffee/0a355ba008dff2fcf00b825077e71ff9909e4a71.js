(function() {
  module.exports = {
    config: {
      toggles: {
        type: 'object',
        order: 1,
        properties: {
          autoClose: {
            title: 'Close Terminal on Exit',
            description: 'Should the terminal close if the shell exits?',
            type: 'boolean',
            "default": false
          },
          cursorBlink: {
            title: 'Cursor Blink',
            description: 'Should the cursor blink when the terminal is active?',
            type: 'boolean',
            "default": true
          },
          runInsertedText: {
            title: 'Run Inserted Text',
            description: 'Run text inserted via `terminal-plus:insert-text` as a command? **This will append an end-of-line character to input.**',
            type: 'boolean',
            "default": true
          }
        }
      },
      core: {
        type: 'object',
        order: 2,
        properties: {
          autoRunCommand: {
            title: 'Auto Run Command',
            description: 'Command to run on terminal initialization.',
            type: 'string',
            "default": ''
          },
          mapTerminalsTo: {
            title: 'Map Terminals To',
            description: 'Map terminals to each file or folder. Default is no action or mapping at all. **Restart required.**',
            type: 'string',
            "default": 'None',
            "enum": ['None', 'File', 'Folder']
          },
          mapTerminalsToAutoOpen: {
            title: 'Auto Open a New Terminal (For Terminal Mapping)',
            description: 'Should a new terminal be opened for new items? **Note:** This works in conjunction with `Map Terminals To` above.',
            type: 'boolean',
            "default": false
          },
          scrollback: {
            title: 'Scroll Back',
            description: 'How many lines of history should be kept?',
            type: 'integer',
            "default": 1000
          },
          shell: {
            title: 'Shell Override',
            description: 'Override the default shell instance to launch.',
            type: 'string',
            "default": (function() {
              var path;
              if (process.platform === 'win32') {
                path = require('path');
                return path.resolve(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
              } else {
                return process.env.SHELL;
              }
            })()
          },
          shellArguments: {
            title: 'Shell Arguments',
            description: 'Specify some arguments to use when launching the shell.',
            type: 'string',
            "default": ''
          },
          workingDirectory: {
            title: 'Working Directory',
            description: 'Which directory should be the present working directory when a new terminal is made?',
            type: 'string',
            "default": 'Project',
            "enum": ['Home', 'Project', 'Active File']
          }
        }
      },
      style: {
        type: 'object',
        order: 3,
        properties: {
          animationSpeed: {
            title: 'Animation Speed',
            description: 'How fast should the window animate?',
            type: 'number',
            "default": '1',
            minimum: '0',
            maximum: '100'
          },
          fontFamily: {
            title: 'Font Family',
            description: 'Override the terminal\'s default font family. **You must use a [monospaced font](https://en.wikipedia.org/wiki/List_of_typefaces#Monospace)!**',
            type: 'string',
            "default": ''
          },
          fontSize: {
            title: 'Font Size',
            description: 'Override the terminal\'s default font size.',
            type: 'string',
            "default": ''
          },
          defaultPanelHeight: {
            title: 'Default Panel Height',
            description: 'Default height of a terminal panel. **You may enter a value in px, em, or %.**',
            type: 'string',
            "default": '300px'
          },
          theme: {
            title: 'Theme',
            description: 'Select a theme for the terminal.',
            type: 'string',
            "default": 'standard',
            "enum": ['standard', 'inverse', 'grass', 'homebrew', 'man-page', 'novel', 'ocean', 'pro', 'red', 'red-sands', 'silver-aerogel', 'solid-colors', 'dracula']
          }
        }
      },
      ansiColors: {
        type: 'object',
        order: 4,
        properties: {
          normal: {
            type: 'object',
            order: 1,
            properties: {
              black: {
                title: 'Black',
                description: 'Black color used for terminal ANSI color set.',
                type: 'color',
                "default": '#000000'
              },
              red: {
                title: 'Red',
                description: 'Red color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CD0000'
              },
              green: {
                title: 'Green',
                description: 'Green color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00CD00'
              },
              yellow: {
                title: 'Yellow',
                description: 'Yellow color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CDCD00'
              },
              blue: {
                title: 'Blue',
                description: 'Blue color used for terminal ANSI color set.',
                type: 'color',
                "default": '#0000CD'
              },
              magenta: {
                title: 'Magenta',
                description: 'Magenta color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CD00CD'
              },
              cyan: {
                title: 'Cyan',
                description: 'Cyan color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00CDCD'
              },
              white: {
                title: 'White',
                description: 'White color used for terminal ANSI color set.',
                type: 'color',
                "default": '#E5E5E5'
              }
            }
          },
          zBright: {
            type: 'object',
            order: 2,
            properties: {
              brightBlack: {
                title: 'Bright Black',
                description: 'Bright black color used for terminal ANSI color set.',
                type: 'color',
                "default": '#7F7F7F'
              },
              brightRed: {
                title: 'Bright Red',
                description: 'Bright red color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FF0000'
              },
              brightGreen: {
                title: 'Bright Green',
                description: 'Bright green color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00FF00'
              },
              brightYellow: {
                title: 'Bright Yellow',
                description: 'Bright yellow color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FFFF00'
              },
              brightBlue: {
                title: 'Bright Blue',
                description: 'Bright blue color used for terminal ANSI color set.',
                type: 'color',
                "default": '#0000FF'
              },
              brightMagenta: {
                title: 'Bright Magenta',
                description: 'Bright magenta color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FF00FF'
              },
              brightCyan: {
                title: 'Bright Cyan',
                description: 'Bright cyan color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00FFFF'
              },
              brightWhite: {
                title: 'Bright White',
                description: 'Bright white color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FFFFFF'
              }
            }
          }
        }
      },
      iconColors: {
        type: 'object',
        order: 5,
        properties: {
          red: {
            title: 'Status Icon Red',
            description: 'Red color used for status icon.',
            type: 'color',
            "default": 'red'
          },
          orange: {
            title: 'Status Icon Orange',
            description: 'Orange color used for status icon.',
            type: 'color',
            "default": 'orange'
          },
          yellow: {
            title: 'Status Icon Yellow',
            description: 'Yellow color used for status icon.',
            type: 'color',
            "default": 'yellow'
          },
          green: {
            title: 'Status Icon Green',
            description: 'Green color used for status icon.',
            type: 'color',
            "default": 'green'
          },
          blue: {
            title: 'Status Icon Blue',
            description: 'Blue color used for status icon.',
            type: 'color',
            "default": 'blue'
          },
          purple: {
            title: 'Status Icon Purple',
            description: 'Purple color used for status icon.',
            type: 'color',
            "default": 'purple'
          },
          pink: {
            title: 'Status Icon Pink',
            description: 'Pink color used for status icon.',
            type: 'color',
            "default": 'hotpink'
          },
          cyan: {
            title: 'Status Icon Cyan',
            description: 'Cyan color used for status icon.',
            type: 'color',
            "default": 'cyan'
          },
          magenta: {
            title: 'Status Icon Magenta',
            description: 'Magenta color used for status icon.',
            type: 'color',
            "default": 'magenta'
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2RzaGkvY29kZS9kb3RmaWxlcy9hdG9tL2F0b20vcGFja2FnZXMvdGVybWluYWwtcGx1cy9saWIvdGVybWluYWwtcGx1cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sQ0FEUDtBQUFBLFFBRUEsVUFBQSxFQUNFO0FBQUEsVUFBQSxTQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyx3QkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLCtDQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEtBSFQ7V0FERjtBQUFBLFVBS0EsV0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHNEQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLElBSFQ7V0FORjtBQUFBLFVBVUEsZUFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSx5SEFEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxJQUhUO1dBWEY7U0FIRjtPQURGO0FBQUEsTUFtQkEsSUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxRQUVBLFVBQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sa0JBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSw0Q0FEYjtBQUFBLFlBRUEs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

//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/terminal-plus/lib/terminal-plus.coffee
