Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

var BlockCursor;

// helper functions

// get the key in namespace
function getConfig(key) {
  var namespace = arguments.length <= 1 || arguments[1] === undefined ? 'block-cursor' : arguments[1];

  return atom.config.get(key ? namespace + '.' + key : namespace);
}

// set the key in namespace
function setConfig(key, value) {
  var namespace = arguments.length <= 2 || arguments[2] === undefined ? 'block-cursor' : arguments[2];

  return atom.config.set(namespace + '.' + key, value);
}

// get a clone of the global config
function getGlobalConfig() {
  var config = assign({}, getConfig('global'));
  assign(config.blinkOn, getConfig('global.blinkOn'));
  assign(config.blinkOff, getConfig('global.blinkOff'));
  return config;
}

// set the (own) properties of objs on target
function assign(target) {
  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objs[_key - 1] = arguments[_key];
  }

  for (var obj of objs) {
    for (var key of Object.keys(obj)) {
      target[key] = obj[key];
    }
  }
  return target;
}

// convert a color to a string
function toRGBAString(color) {
  if (typeof color == 'string') return color;
  if (typeof color.toRGBAString == 'function') return color.toRGBAString();
  return 'rgba(' + color.red + ', ' + color.green + ', ' + color.blue + ', ' + color.alpha + ')';
}

// private API

// keep a reference to the stylesheet
var style;

// create a stylesheet element and
// attach it to the DOM
function setupStylesheet() {
  style = document.createElement('style');
  style.type = 'text/css';
  document.querySelector('head atom-styles').appendChild(style);

  // return a disposable for easy removal :)
  return new _atom.Disposable(function () {
    style.parentNode.removeChild(style);
    style = null;
  });
}

// update the stylesheet when config changes
function updateCursorStyles(config) {
  // clear stylesheet
  style.innerHTML = '';
  for (var key of Object.keys(config)) {
    // and add styles for each cursor style
    style.innerHTML += cssForCursorStyle(config[key]);
  }
  // console.log(style.innerHTML);
}

function cssForCursorStyle(cursorStyle) {
  // fill the cursor style with global as defaults
  cursorStyle = assign(getGlobalConfig(), cursorStyle);
  var blinkOn = assign({}, getConfig('global.blinkOn'), cursorStyle.blinkOn);
  var blinkOff = assign({}, getConfig('global.blinkOff'), cursorStyle.blinkOff);
  var _cursorStyle = cursorStyle;
  var selector = _cursorStyle.selector;
  var scopes = _cursorStyle.scopes;
  var pulseDuration = _cursorStyle.pulseDuration;
  var cursorLineFix = _cursorStyle.cursorLineFix;

  // if cursor blinking is off, set the secondaryColor the same
  // as primaryColor to prevent cursor blinking in [mini] editors
  if (atom.packages.isPackageActive('cursor-blink-interval') && getConfig('cursorBlinkInterval', 'cursor-blink-interval') == 0) blinkOff = assign({}, blinkOn);

  // blink on rule
  blinkOn.selector = selectorForScopes(selector, scopes);
  blinkOn.properties = {
    // blink on background color
    backgroundColor: toRGBAString(blinkOn.backgroundColor),
    // pulse animation duration
    transitionDuration: pulseDuration + 'ms'
  };
  // blink on border
  // cursor line fix
  // zIndex: cursorLineFix ? 1 : -1 // @TODO: enable this when a solution is found for #20
  assign(blinkOn.properties, createBorderStyle(blinkOn));
  // end blink on rule

  // blink off rule
  blinkOff.selector = selectorForScopes(selector, scopes, true);
  blinkOff.properties = {};
  if (blinkOff.backgroundColor.alpha == 0 && (blinkOff.borderWidth == 0 || blinkOff.borderStyle == 'none' || blinkOff.borderColor.alpha == 0))
    // better animation performance by animating opacity
    // if blink off cursor is invisible
    blinkOff.properties.opacity = 0;else
    // blink off background color
    blinkOff.properties.backgroundColor = toRGBAString(blinkOff.backgroundColor);
  // blink off border
  assign(blinkOff.properties, createBorderStyle(blinkOff));
  // end blink off rule

  return createCSSRule(blinkOn) + createCSSRule(blinkOff);
}

// create a css properties object for given border properties
function createBorderStyle(_ref) {
  var borderWidth = _ref.borderWidth;
  var borderStyle = _ref.borderStyle;
  var borderColor = _ref.borderColor;

  var borderString = borderWidth + 'px solid ' + toRGBAString(borderColor);
  switch (borderStyle) {
    case 'bordered-box':
      // border on all sides
      return { border: borderString };
    case 'i-beam':
      // border on left side
      return { border: 'none', borderLeft: borderString };
    case 'underline':
      // border on bottom side
      return { border: 'none', borderBottom: borderString };
    default:
      // no border
      return { border: 'none' };
  }
}

// create a css rule from a selector and an
// object containint propertyNames and values
// of the form
// <selector> {
//    <propertyName1>: <value1>;
//    <propertyName2>: <value2>;
//    ...
// }
function createCSSRule(_ref2) {
  var selector = _ref2.selector;
  var properties = _ref2.properties;

  var cssRule = selector + ' {\n';
  for (var key of Object.keys(properties)) {
    var cssKey = key.replace(/([A-Z])/g, function (match) {
      return '-' + match.toLowerCase();
    });
    cssRule += '\t' + cssKey + ': ' + properties[key] + ';\n';
  }
  cssRule += '}\n';
  return cssRule;
}

// creates a css selector for the given scopes
// @param base: selector that selects the atom-text-editor element
// @param scopes: array of scopes to select
// @param blinkOff: create a blink-off selector?
function selectorForScopes(base, scopes) {
  var blinkOff = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var selectors = [];
  for (var scope of scopes) {
    var selector = base;
    if (scope != '*') selector += scope.split('.').map(function mapper(scope) {
      return scope ? '[data-grammar~="' + scope + '"]' : '';
    }).join('');
    selector += '::shadow .cursors';
    if (blinkOff) selector += '.blink-off';
    selector += ' .cursor';
    selectors.push(selector);
  }
  return selectors.join(',\n');
}

// add a custom cursor to the config. an easy
// shortcut when you want to define a new cursor type
function addCustomCursor() {
  var i = 0;
  while (getConfig('custom-' + i)) i++;
  setConfig('custom-' + i, getGlobalConfig());
}

// public API

// module.exports = BlockCursor = {
var config = {
  global: {
    type: 'object',
    properties: {
      scopes: {
        type: 'array',
        'default': ['*']
      },
      selector: {
        type: 'string',
        'default': 'atom-text-editor'
      },
      blinkOn: {
        type: 'object',
        properties: {
          backgroundColor: {
            type: 'color',
            'default': '#393939'
          },
          borderWidth: {
            type: 'integer',
            'default': 1,
            minimum: 0
          },
          borderStyle: {
            type: 'string',
            'default': 'none',
            'enum': ['none', 'bordered-box', 'i-beam', 'underline']
          },
          borderColor: {
            type: 'color',
            'default': 'transparent'
          }
        }
      },
      blinkOff: {
        type: 'object',
        properties: {
          backgroundColor: {
            type: 'color',
            'default': 'transparent'
          },
          borderWidth: {
            type: 'integer',
            'default': 1,
            minimum: 0
          },
          borderStyle: {
            type: 'string',
            'default': 'none',
            'enum': ['none', 'bordered-box', 'i-beam', 'underline']
          },
          borderColor: {
            type: 'color',
            'default': 'transparent'
          }
        }
      },
      pulseDuration: {
        type: 'integer',
        'default': 0,
        minimum: 0
      },
      cursorLineFix: {
        description: 'Temporarily ignored (always true) because of an issue with the tile rendering introduced in Atom 0.209.0.',
        type: 'boolean',
        'default': false
      }
    }
  }
};

var disposables;

function activate() {
  // wait for cursor-blink-interval package to activate
  // if it is loaded
  Promise.resolve(atom.packages.isPackageLoaded('cursor-blink-interval') && atom.packages.activatePackage('cursor-blink-interval')).then(function go() {
    disposables = new _atom.CompositeDisposable(setupStylesheet(), atom.config.observe('block-cursor', updateCursorStyles), atom.commands.add('atom-workspace', 'block-cursor:new-custom-cursor', addCustomCursor));
  })['catch'](function error(error) {
    console.error(error.message);
  });
}

function deactivate() {
  disposables.dispose();
  disposables = null;
}

exports.config = config;
exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kc2hpL2NvZGUvZG90ZmlsZXMvYXRvbS9hdG9tL3BhY2thZ2VzL2Jsb2NrLWN1cnNvci9saWIvYmxvY2stY3Vyc29yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBQzhDLE1BQU07O0FBRHBELFdBQVcsQ0FBQzs7QUFFWixJQUFJLFdBQVcsQ0FBQzs7Ozs7QUFLaEIsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUE4QjtNQUE1QixTQUFTLHlEQUFHLGNBQWM7O0FBQ2hELFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFNLFNBQVMsU0FBSSxHQUFHLEdBQUssU0FBUyxDQUFDLENBQUM7Q0FDakU7OztBQUdELFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQThCO01BQTVCLFNBQVMseURBQUcsY0FBYzs7QUFDdkQsU0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBSSxTQUFTLFNBQUksR0FBRyxFQUFJLEtBQUssQ0FBQyxDQUFDO0NBQ3REOzs7QUFHRCxTQUFTLGVBQWUsR0FBRztBQUN6QixNQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDcEQsUUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUN0RCxTQUFPLE1BQU0sQ0FBQTtDQUNkOzs7QUFHRCxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQVc7b0NBQU4sSUFBSTtBQUFKLFFBQUk7OztBQUM3QixPQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNuQixTQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDL0IsWUFBTSxD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R0FDOUIsQ0FBQyxDQUFDO0NBQ0o7O0FBRUQsU0FBUyxVQUFVLEdBQUc7QUFDcEIsYUFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RCLGFBQVcsR0FBRyxJQUFJLENBQUM7Q0FDcEI7O1FBRU8sTUFBTSxHQUFOLE1BQU07UUFBRSxRQUFRLEdBQVIsUUFBUTtRQUFFLFVBQVUsR0FBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9kc2hpL2NvZGUvZG90ZmlsZXMvYXRvbS9hdG9tL3BhY2thZ2VzL2Jsb2NrLWN1cnNvci9saWIvYmxvY2stY3Vyc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQge0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG52YXIgQmxvY2tDdXJzb3I7XG5cbi8vIGhlbHBlciBmdW5jdGlvbnNcblxuLy8gZ2V0IHRoZSBrZXkgaW4gbmFtZXNwYWNlXG5mdW5jdGlvbiBnZXRDb25maWcoa2V5LCBuYW1lc3BhY2UgPSAnYmxvY2stY3Vyc29yJykge1xuICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KGtleSA/IGAke25hbWVzcGFjZX0uJHtrZXl9YCA6IG5hbWVzcGFjZSk7XG59XG5cbi8vIHNldCB0aGUga2V5IGluIG5hbWVzcGFjZVxuZnVuY3Rpb24gc2V0Q29uZmlnKGtleSwgdmFsdWUsIG5hbWVzcGFjZSA9ICdibG9jay1jdXJzb3InKSB7XG4gIHJldHVybiBhdG9tLmNvbmZpZy5zZXQoYCR7bmFtZXNwYWNlfS4ke2tleX1gLCB2YWx1ZSk7XG59XG5cbi8vIGdldCBhIGNsb25lIG9mIHRoZSBnbG9iYWwgY29uZmlnXG5mdW5jdGlvbiBnZXRHbG9iYWxDb25maWcoKSB7XG4gIHZhciBjb25maWcgPSBhc3NpZ24oe30sIGdldENvbmZpZygnZ2xvYmFsJykpO1xuICBhc3NpZ24oY29uZmlnLmJsaW5rT24sIGdldENvbmZpZygnZ2xvYmFsLmJsaW5rT24nKSk7XG4gIGFzc2lnbihjb25maWcuYmxpbmtPZmYsIGdldENvbmZpZygnZ2xvYmFsLmJsaW5rT2ZmJykpO1xuICByZXR1cm4gY29uZmlnXG59XG5cbi8vIHNldCB0aGUgKG93bikgcHJvcGVydGllcyBvZiBvYmpzIG9uIHRhcmdldFxuZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgLi4ub2Jqcykge1xuICBmb3IobGV0IG9iaiBvZiBvYmpzKSB7XG4gICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLy8gY29udmVydCBhIGNvbG9yIHRvIGEgc3RyaW5nXG5mdW5jdGlvbiB0b1JHQkFTdHJpbmcoY29sb3IpIHtcbiAgaWYodHlwZW9mIGNvbG9yID09ICdzdHJpbmcnKSByZXR1cm4gY29sb3I7XG4gIGlmKHR5cGVvZiBjb2xvci50b1JHQkFTdHJpbmcgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGNvbG9yLnRvUkdCQVN0cmluZygpO1xuICByZXR1cm4gYHJnYmEoJHtjb2xvci5yZWR9LCAke2NvbG9yLmdyZWVufSwgJHtjb2xvci5ibHVlfSwgJHtjb2xvci5hbHBoYX0pYDtcbn1cblxuLy8gcHJpdmF0ZSBBUElcblxuLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgc3R5bGVzaGVldFxudmFyIHN0eWxlO1xuXG4vLyBjcmVhdGUgYSBzdHlsZXNoZWV0IGVsZW1lbnQgYW5kXG4vLyBhdHRhY2ggaXQgdG8gdGhlIERPTVxuZnVuY3Rpb24gc2V0dXBTdHlsZXNoZWV0KCkge1xuICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkIGF0b20tc3R5bGVzJykuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gIC8vIHJldHVybiBhIGRpc3Bvc2FibGUgZm9yIGVhc3kgcmVtb3ZhbCA6KVxuICByZXR1cm4gbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgc3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG4gICAgc3R5bGUgPSBudWxsO1xuICB9KTtcbn1cblxuLy8gdXBkYXRlIHRoZSBzdHlsZXNoZWV0IHdoZW4gY29uZmlnIGNoYW5nZXNcbmZ1bmN0aW9uIHVwZGF0ZUN1cnNvclN0eWxlcyhjb25maWcpIHtcbiAgLy8gY2xlYXIgc3R5bGVzaGVldFxuICBzdHlsZS5pbm5lckhUTUwgPSAnJztcbiAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoY29uZmlnKSkge1xuICAgIC8vIGFuZCBhZGQgc3R5bGVzIGZvciBlYWNoIGN1cnNvciBzdHlsZVxuICAgIHN0eWxlLmlubmVySFRNTCArPSBjc3NGb3JDdXJzb3JTdHlsZShjb25maWdba2V5XSk7XG4gIH1cbiAgLy8gY29uc29sZS5sb2coc3R5bGUuaW5uZXJIVE1MKTtcbn1cblxuZnVuY3Rpb24gY3NzRm9yQ3Vyc29yU3R5bGUoY3Vyc29yU3R5bGUpIHtcbiAgLy8gZmlsbCB0aGUgY3Vyc29yIHN0eWxlIHdpdGggZ2xvYmFsIGFzIGRlZmF1bHRzXG4gIGN1cnNvclN0eWxlID0gYXNzaWduKGdldEdsb2JhbENvbmZpZygpLCBjdXJzb3JTdHlsZSk7XG4gIHZhciBibGlua09uID0gYXNzaWduKHt9LCBnZXRDb25maWcoJ2dsb2JhbC5ibGlua09uJyksIGN1cnNvclN0eWxlLmJsaW5rT24pO1xuICB2YXIgYmxpbmtPZmYgPSBhc3NpZ24oe30sIGdldENvbmZpZygnZ2xvYmFsLmJsaW5rT2ZmJyksIGN1cnNvclN0eWxlLmJsaW5rT2ZmKTtcbiAgdmFyIHtzZWxlY3Rvciwgc2NvcGVzLCBwdWxzZUR1cmF0aW9uLCBjdXJzb3JMaW5lRml4fSA9IGN1cnNvclN0eWxlO1xuXG4gIC8vIGlmIGN1cnNvciBibGlua2luZyBpcyBvZmYsIHNldCB0aGUgc2Vjb25kYXJ5Q29sb3IgdGhlIHNhbWVcbiAgLy8gYXMgcHJpbWFyeUNvbG9yIHRvIHByZXZlbnQgY3Vyc29yIGJsaW5raW5nIGluIFttaW5pXSBlZGl0b3JzXG4gIGlmKGF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKCdjdXJzb3ItYmxpbmstaW50ZXJ2YWwnKSAmJlxuICAgIGdldENvbmZpZygnY3Vyc29yQmxpbmtJbnRlcnZhbCcsICdjdXJzb3ItYmxpbmstaW50ZXJ2YWwnKSA9PSAwKVxuICAgIGJsaW5rT2ZmID0gYXNzaWduKHt9LCBibGlua09uKTtcblxuICAvLyBibGluayBvbiBydWxlXG4gIGJsaW5rT24uc2VsZWN0b3IgPSBzZWxlY3RvckZvclNjb3BlcyhzZWxlY3Rvciwgc2NvcGVzKTtcbiAgYmxpbmtPbi5wcm9wZXJ0aWVzID0ge1xuICAgIC8vIGJsaW5rIG9uIGJhY2tncm91bmQgY29sb3JcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHRvUkdCQVN0cmluZyhibGlua09uLmJhY2tncm91bmRDb2xvciksXG4gICAgLy8gcHVsc2UgYW5pbWF0aW9uIGR1cmF0aW9uXG4gICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtwdWxzZUR1cmF0aW9ufW1zYCxcbiAgICAvLyBjdXJzb3IgbGluZSBmaXhcbiAgICAvLyB6SW5kZXg6IGN1cnNvckxpbmVGaXggPyAxIDogLTEgLy8gQFRPRE86IGVuYWJsZSB0aGlzIHdoZW4gYSBzb2x1dGlvbiBpcyBmb3VuZCBmb3IgIzIwXG4gIH07XG4gIC8vIGJsaW5rIG9uIGJvcmRlclxuICBhc3NpZ24oYmxpbmtPbi5wcm9wZXJ0aWVzLCBjcmVhdGVCb3JkZXJTdHlsZShibGlua09uKSk7XG4gIC8vIGVuZCBibGluayBvbiBydWxlXG5cbiAgLy8gYmxpbmsgb2ZmIHJ1bGVcbiAgYmxpbmtPZmYuc2VsZWN0b3IgPSBzZWxlY3RvckZvclNjb3BlcyhzZWxlY3Rvciwgc2NvcGVzLCB0cnVlKTtcbiAgYmxpbmtPZmYucHJvcGVydGllcyA9IHt9O1xuICBpZihibGlua09mZi5iYWNrZ3JvdW5kQ29sb3IuYWxwaGEgPT0gMCAmJiAoYmxpbmtPZmYuYm9yZGVyV2lkdGggPT0gMCB8fFxuICAgIGJsaW5rT2ZmLmJvcmRlclN0eWxlID09ICdub25lJyB8fCBibGlua09mZi5ib3JkZXJDb2xvci5hbHBoYSA9PSAwKSlcbiAgICAvLyBiZXR0ZXIgYW5pbWF0aW9uIHBlcmZvcm1hbmNlIGJ5IGFuaW1hdGluZyBvcGFjaXR5XG4gICAgLy8gaWYgYmxpbmsgb2ZmIGN1cnNvciBpcyBpbnZpc2libGVcbiAgICBibGlua09mZi5wcm9wZXJ0aWVzLm9wYWNpdHkgPSAwO1xuICBlbHNlXG4gICAgLy8gYmxpbmsgb2ZmIGJhY2tncm91bmQgY29sb3JcbiAgICBibGlua09mZi5wcm9wZXJ0aWVzLmJhY2tncm91bmRDb2xvciA9IHRvUkdCQVN0cmluZyhibGlua09mZi5iYWNrZ3JvdW5kQ29sb3IpO1xuICAgIC8vIGJsaW5rIG9mZiBib3JkZXJcbiAgICBhc3NpZ24oYmxpbmtPZmYucHJvcGVydGllcywgY3JlYXRlQm9yZGVyU3R5bGUoYmxpbmtPZmYpKTtcbiAgLy8gZW5kIGJsaW5rIG9mZiBydWxlXG5cbiAgcmV0dXJuIGNyZWF0ZUNTU1J1bGUoYmxpbmtPbikgKyBjcmVhdGVDU1NSdWxlKGJsaW5rT2ZmKTtcbn1cblxuLy8gY3JlYXRlIGEgY3NzIHByb3BlcnRpZXMgb2JqZWN0IGZvciBnaXZlbiBib3JkZXIgcHJvcGVydGllc1xuZnVuY3Rpb24gY3JlYXRlQm9yZGVyU3R5bGUoe2JvcmRlcldpZHRoLCBib3JkZXJTdHlsZSwgYm9yZGVyQ29sb3J9KSB7XG4gIHZhciBib3JkZXJTdHJpbmcgPSBgJHtib3JkZXJXaWR0aH1weCBzb2xpZCAke3RvUkdCQVN0cmluZyhib3JkZXJDb2xvcil9YDtcbiAgc3dpdGNoKGJvcmRlclN0eWxlKSB7XG4gICAgY2FzZSAnYm9yZGVyZWQtYm94JzpcbiAgICAgIC8vIGJvcmRlciBvbiBhbGwgc2lkZXNcbiAgICAgIHJldHVybiB7Ym9yZGVyOiBib3JkZXJTdHJpbmd9O1xuICAgIGNhc2UgJ2ktYmVhbSc6XG4gICAgICAvLyBib3JkZXIgb24gbGVmdCBzaWRlXG4gICAgICByZXR1cm4ge2JvcmRlcjogJ25vbmUnLCBib3JkZXJMZWZ0OiBib3JkZXJTdHJpbmd9XG4gICAgY2FzZSAndW5kZXJsaW5lJzpcbiAgICAgIC8vIGJvcmRlciBvbiBib3R0b20gc2lkZVxuICAgICAgcmV0dXJuIHtib3JkZXI6ICdub25lJywgYm9yZGVyQm90dG9tOiBib3JkZXJTdHJpbmd9O1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBubyBib3JkZXJcbiAgICAgIHJldHVybiB7Ym9yZGVyOiAnbm9uZSd9O1xuICB9XG59XG5cbi8vIGNyZWF0ZSBhIGNzcyBydWxlIGZyb20gYSBzZWxlY3RvciBhbmQgYW5cbi8vIG9iamVjdCBjb250YWluaW50IHByb3BlcnR5TmFtZXMgYW5kIHZhbHVlc1xuLy8gb2YgdGhlIGZvcm1cbi8vIDxzZWxlY3Rvcj4ge1xuLy8gICAgPHByb3BlcnR5TmFtZTE+OiA8dmFsdWUxPjtcbi8vICAgIDxwcm9wZXJ0eU5hbWUyPjogPHZhbHVlMj47XG4vLyAgICAuLi5cbi8vIH1cbmZ1bmN0aW9uIGNyZWF0ZUNTU1J1bGUoe3NlbGVjdG9yLCBwcm9wZXJ0aWVzfSkge1xuICB2YXIgY3NzUnVsZSA9IGAke3NlbGVjdG9yfSB7XFxuYDtcbiAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMocHJvcGVydGllcykpIHtcbiAgICBsZXQgY3NzS2V5ID0ga2V5LnJlcGxhY2UoLyhbQS1aXSkvZywgKG1hdGNoKSA9PiBgLSR7bWF0Y2gudG9Mb3dlckNhc2UoKX1gKTtcbiAgICBjc3NSdWxlICs9IGBcXHQke2Nzc0tleX06ICR7cHJvcGVydGllc1trZXldfTtcXG5gO1xuICB9XG4gIGNzc1J1bGUgKz0gJ31cXG4nO1xuICByZXR1cm4gY3NzUnVsZTtcbn1cblxuLy8gY3JlYXRlcyBhIGNzcyBzZWxlY3RvciBmb3IgdGhlIGdpdmVuIHNjb3Blc1xuLy8gQHBhcmFtIGJhc2U6IHNlbGVjdG9yIHRoYXQgc2VsZWN0cyB0aGUgYXRvbS10ZXh0LWVkaXRvciBlbGVtZW50XG4vLyBAcGFyYW0gc2NvcGVzOiBhcnJheSBvZiBzY29wZXMgdG8gc2VsZWN0XG4vLyBAcGFyYW0gYmxpbmtPZmY6IGNyZWF0ZSBhIGJsaW5rLW9mZiBzZWxlY3Rvcj9cbmZ1bmN0aW9uIHNlbGVjdG9yRm9yU2NvcGVzKGJhc2UsIHNjb3BlcywgYmxpbmtPZmYgPSBmYWxzZSkge1xuICB2YXIgc2VsZWN0b3JzID0gW107XG4gIGZvcihsZXQgc2NvcGUgb2Ygc2NvcGVzKSB7XG4gICAgbGV0IHNlbGVjdG9yID0gYmFzZTtcbiAgICBpZihzY29wZSAhPSAnKicpIHNlbGVjdG9yICs9IHNjb3BlLnNwbGl0KCcuJykubWFwKGZ1bmN0aW9uIG1hcHBlcihzY29wZSkge1xuICAgICAgcmV0dXJuIHNjb3BlID8gYFtkYXRhLWdyYW1tYXJ+PVwiJHtzY29wZX1cIl1gIDogJyc7XG4gICAgfSkuam9pbignJyk7XG4gICAgc2VsZWN0b3IgKz0gJzo6c2hhZG93IC5jdXJzb3JzJztcbiAgICBpZihibGlua09mZikgc2VsZWN0b3IgKz0gJy5ibGluay1vZmYnO1xuICAgIHNlbGVjdG9yICs9ICcgLmN1cnNvcic7XG4gICAgc2VsZWN0b3JzLnB1c2goc2VsZWN0b3IpO1xuICB9XG4gIHJldHVybiBzZWxlY3RvcnMuam9pbignLFxcbicpO1xufVxuXG4vLyBhZGQgYSBjdXN0b20gY3Vyc29yIHRvIHRoZSBjb25maWcuIGFuIGVhc3lcbi8vIHNob3J0Y3V0IHdoZW4geW91IHdhbnQgdG8gZGVmaW5lIGEgbmV3IGN1cnNvciB0eXBlXG5mdW5jdGlvbiBhZGRDdXN0b21DdXJzb3IoKSB7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUoZ2V0Q29uZmlnKGBjdXN0b20tJHtpfWApKSBpKys7XG4gIHNldENvbmZpZyhgY3VzdG9tLSR7aX1gLCBnZXRHbG9iYWxDb25maWcoKSk7XG59XG5cbi8vIHB1YmxpYyBBUElcblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBCbG9ja0N1cnNvciA9IHtcbmNvbnN0IGNvbmZpZyA9IHtcbiAgZ2xvYmFsOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgc2NvcGVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IFsgJyonIF1cbiAgICAgIH0sXG4gICAgICBzZWxlY3Rvcjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogJ2F0b20tdGV4dC1lZGl0b3InXG4gICAgICB9LFxuICAgICAgYmxpbmtPbjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjoge1xuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcjMzkzOTM5J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBib3JkZXJTdHlsZToge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBkZWZhdWx0OiAnbm9uZScsXG4gICAgICAgICAgICBlbnVtOiBbICdub25lJywgJ2JvcmRlcmVkLWJveCcsICdpLWJlYW0nLCAndW5kZXJsaW5lJyBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBib3JkZXJDb2xvcjoge1xuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBibGlua09mZjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjoge1xuICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvcmRlcldpZHRoOiB7XG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgbWluaW11bTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyU3R5bGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ25vbmUnLFxuICAgICAgICAgICAgZW51bTogWyAnbm9uZScsICdib3JkZXJlZC1ib3gnLCAnaS1iZWFtJywgJ3VuZGVybGluZScgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9yZGVyQ29sb3I6IHtcbiAgICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHVsc2VEdXJhdGlvbjoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIG1pbmltdW06IDBcbiAgICAgIH0sXG4gICAgICBjdXJzb3JMaW5lRml4OiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGVtcG9yYXJpbHkgaWdub3JlZCAoYWx3YXlzIHRydWUpIGJlY2F1c2Ugb2YgYW4gaXNzdWUgd2l0aCB0aGUgdGlsZSByZW5kZXJpbmcgaW50cm9kdWNlZCBpbiBBdG9tIDAuMjA5LjAuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGRpc3Bvc2FibGVzO1xuXG5mdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgLy8gd2FpdCBmb3IgY3Vyc29yLWJsaW5rLWludGVydmFsIHBhY2thZ2UgdG8gYWN0aXZhdGVcbiAgLy8gaWYgaXQgaXMgbG9hZGVkXG4gIFByb21pc2UucmVzb2x2ZShcbiAgICBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgnY3Vyc29yLWJsaW5rLWludGVydmFsJykgJiZcbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdjdXJzb3ItYmxpbmstaW50ZXJ2YWwnKVxuICApLnRoZW4oZnVuY3Rpb24gZ28oKSB7XG4gICAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHNldHVwU3R5bGVzaGVldCgpLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYmxvY2stY3Vyc29yJywgdXBkYXRlQ3Vyc29yU3R5bGVzKSxcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdibG9jay1jdXJzb3I6bmV3LWN1c3RvbS1jdXJzb3InLCBhZGRDdXN0b21DdXJzb3IpXG4gICAgKTtcbiAgfSkuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICBkaXNwb3NhYmxlcyA9IG51bGw7XG59XG5cbmV4cG9ydCB7Y29uZmlnLCBhY3RpdmF0ZSwgZGVhY3RpdmF0ZX07XG4iXX0=
//# sourceURL=/Users/dshi/code/dotfiles/atom/atom/packages/block-cursor/lib/block-cursor.js
