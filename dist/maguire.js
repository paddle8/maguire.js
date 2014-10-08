var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {}, seen = {};
  var FAILED = false;

  var uuid = 0;

  function tryFinally(tryable, finalizer) {
    try {
      return tryable();
    } finally {
      finalizer();
    }
  }


  function Module(name, deps, callback, exports) {
    var defaultDeps = ['require', 'exports', 'module'];

    this.id       = uuid++;
    this.name     = name;
    this.deps     = !deps.length && callback.length ? defaultDeps : deps;
    this.exports  = exports || { };
    this.callback = callback;
    this.state    = undefined;
  }

  define = function(name, deps, callback) {
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  define.amd = {};

  function reify(mod, name, seen) {
    var deps = mod.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    // TODO: new Module
    // TODO: seen refactor
    var module = { };

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        module.exports = reified[i] = seen;
      } else if (dep === 'require') {
        reified[i] = function requireDep(dep) {
          return require(resolve(dep, name));
        };
      } else if (dep === 'module') {
        mod.exports = seen;
        module = reified[i] = mod;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      module: module
    };
  }

  requirejs = require = requireModule = function(name) {
    var mod = registry[name];
    if (!mod) {
      throw new Error('Could not find module ' + name);
    }

    if (mod.state !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    tryFinally(function() {
      reified = reify(mod, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    }, function() {
      if (!loaded) {
        mod.state = FAILED;
      }
    });

    var obj;
    if (module === undefined && reified.module.exports) {
      obj = reified.module.exports;
    } else {
      obj = seen[name] = module;
    }

    if (obj !== null && typeof obj === 'object' && obj['default'] === undefined) {
      obj['default'] = obj;
    }

    return (seen[name] = obj);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("loader", 
  [],
  function() {
    "use strict";
    var define, requireModule, require, requirejs;

    (function() {

      var _isArray;
      if (!Array.isArray) {
        _isArray = function (x) {
          return Object.prototype.toString.call(x) === "[object Array]";
        };
      } else {
        _isArray = Array.isArray;
      }

      var registry = {}, seen = {};
      var FAILED = false;

      var uuid = 0;

      function tryFinally(tryable, finalizer) {
        try {
          return tryable();
        } finally {
          finalizer();
        }
      }


      function Module(name, deps, callback, exports) {
        var defaultDeps = ['require', 'exports', 'module'];

        this.id       = uuid++;
        this.name     = name;
        this.deps     = !deps.length && callback.length ? defaultDeps : deps;
        this.exports  = exports || { };
        this.callback = callback;
        this.state    = undefined;
      }

      define = function(name, deps, callback) {
        if (!_isArray(deps)) {
          callback = deps;
          deps     =  [];
        }

        registry[name] = new Module(name, deps, callback);
      };

      define.amd = {};

      function reify(mod, name, seen) {
        var deps = mod.deps;
        var length = deps.length;
        var reified = new Array(length);
        var dep;
        // TODO: new Module
        // TODO: seen refactor
        var module = { };

        for (var i = 0, l = length; i < l; i++) {
          dep = deps[i];
          if (dep === 'exports') {
            module.exports = reified[i] = seen;
          } else if (dep === 'require') {
            reified[i] = function requireDep(dep) {
              return require(resolve(dep, name));
            };
          } else if (dep === 'module') {
            mod.exports = seen;
            module = reified[i] = mod;
          } else {
            reified[i] = require(resolve(dep, name));
          }
        }

        return {
          deps: reified,
          module: module
        };
      }

      requirejs = require = requireModule = function(name) {
        var mod = registry[name];
        if (!mod) {
          throw new Error('Could not find module ' + name);
        }

        if (mod.state !== FAILED &&
            seen.hasOwnProperty(name)) {
          return seen[name];
        }

        var reified;
        var module;
        var loaded = false;

        seen[name] = { }; // placeholder for run-time cycles

        tryFinally(function() {
          reified = reify(mod, name, seen[name]);
          module = mod.callback.apply(this, reified.deps);
          loaded = true;
        }, function() {
          if (!loaded) {
            mod.state = FAILED;
          }
        });

        var obj;
        if (module === undefined && reified.module.exports) {
          obj = reified.module.exports;
        } else {
          obj = seen[name] = module;
        }

        if (obj !== null && typeof obj === 'object' && obj['default'] === undefined) {
          obj['default'] = obj;
        }

        return (seen[name] = obj);
      };

      function resolve(child, name) {
        if (child.charAt(0) !== '.') { return child; }

        var parts = child.split('/');
        var nameParts = name.split('/');
        var parentBase = nameParts.slice(0, -1);

        for (var i = 0, l = parts.length; i < l; i++) {
          var part = parts[i];

          if (part === '..') { parentBase.pop(); }
          else if (part === '.') { continue; }
          else { parentBase.push(part); }
        }

        return parentBase.join('/');
      }

      requirejs.entries = requirejs._eak_seen = registry;
      requirejs.clear = function(){
        requirejs.entries = requirejs._eak_seen = registry = {};
        seen = state = {};
      };
    })();
  });
;define("maguire", 
  ["maguire/utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fmt = __dependency1__.fmt;
    var rjust = __dependency1__.rjust;
    var splitValueIntoGroups = __dependency1__.splitValueIntoGroups;

    var currencies = {};
    var registerCurrency = function (currency, data) {
      currencies[currency] = data;
    };

    var locales = {};
    var defaultLocale;
    var registerLocale = function (locale, data) {
      if (defaultLocale == null) {
        defaultLocale = locale;
      }
      locales[locale] = data;
    };

    var reset = function () {
      defaultLocale = null;
      locales = {};
      currencies = {};
    };

    var format = function (money, options) {
      options = options || {};

      var currency = currencies[money.currency];
      var value = money.value;
      var locale = locales[options.locale || defaultLocale];

      var majorValue = Math.floor(Math.abs(value) / currency.precision);
      var minorValue = Math.round(Math.abs(value) - majorValue * currency.precision);

      var groups = splitValueIntoGroups(majorValue, locale.digit_grouping_style);

      var formatting = locale.positive;
      if (value < 0) {
        formatting = locale.negative;
      }

      var symbol = currency.symbol;
      if (options.html && currency.symbol_html) {
        symbol = currency.symbol_html;
      }

      var stripInsignificantZeros = options.stripInsignificantZeros;
      if (options.noMinorUnits || currency.minor_units === 0) {
        minorValue = 0;
        stripInsignificantZeros = true;
      }

      var decimalSymbol = formatting.decimal_symbol;
      if (stripInsignificantZeros && minorValue === 0) {
        minorValue = '';
        decimalSymbol = '';
      } else {
        if (minorValue === 0 && locale.zero) {
          formatting = locale.zero
        } else {
          minorValue = rjust(minorValue, currency.minor_units, "0");
        }
      }

      return fmt(formatting.layout, {
        symbol: symbol,
        code: currency.code,
        decimal: decimalSymbol,
        major_value: groups.join(formatting.digit_grouping_symbol),
        minor_value: minorValue
      });
    };

    __exports__.registerCurrency = registerCurrency;
    __exports__.registerLocale = registerLocale;
    __exports__.format = format;
  });
;define("maguire/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    // Adopted from underscore.string
    var repeat = function (string, quantity) {
      if (quantity < 1) {
        return '';
      }
      var result = '';
      while (quantity > 0) {
        if (quantity & 1) {
          result += string;
        }
        quantity >>= 1;
        string += string;
      }
      return result;
    };

    var rjust = function (string, length, padding) {
      string = string == null ? '' : String(string);
      length = ~~length;
      return repeat(padding, length - string.length) + string;
    };

    var fmt = function (template, object) {
      return template.replace(/%{([^}]*)}/g, function (match, key) {
        return object[key];
      });
    };

    var breakOff = function (value, number) {
      var len = value.length;
      if (number > len) {
        number = len;
      }

      return [value.slice(0, len - number), value.slice(len - number, len)];
    };

    var splitValueIntoGroupsOf = function (value, number) {
      var groups = [];
      while (value && value.length > 0) {
        var group = breakOff(value, number);
        value = group[0];
        groups.unshift(group[1]);
      }
      return groups;
    };

    var splitValueIntoGroups = function (value, format) {
      value = value.toString();

      switch(format) {
      case 'triples':
        return splitValueIntoGroupsOf(value, 3);
      case 'quadruples':
        return splitValueIntoGroupsOf(value, 4);
      case 'south_asian':
        var group = breakOff(value, 3);

        return splitValueIntoGroupsOf(group[0], 2).concat(group[1]);
      default:
        return [];
      }
    };

    __exports__.rjust = rjust;
    __exports__.fmt = fmt;
    __exports__.splitValueIntoGroups = splitValueIntoGroups;
  });