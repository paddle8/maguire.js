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
  
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function(name, deps, callback) {
  
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }
  
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function(name) {
    if (state[name] !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

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
      
      var registry = {}, seen = {}, state = {};
      var FAILED = false;

      define = function(name, deps, callback) {
      
        if (!_isArray(deps)) {
          callback = deps;
          deps     =  [];
        }
      
        registry[name] = {
          deps: deps,
          callback: callback
        };
      };

      function reify(deps, name, seen) {
        var length = deps.length;
        var reified = new Array(length);
        var dep;
        var exports;

        for (var i = 0, l = length; i < l; i++) {
          dep = deps[i];
          if (dep === 'exports') {
            exports = reified[i] = seen;
          } else {
            reified[i] = require(resolve(dep, name));
          }
        }

        return {
          deps: reified,
          exports: exports
        };
      }

      requirejs = require = requireModule = function(name) {
        if (state[name] !== FAILED &&
            seen.hasOwnProperty(name)) {
          return seen[name];
        }

        if (!registry[name]) {
          throw new Error('Could not find module ' + name);
        }

        var mod = registry[name];
        var reified;
        var module;
        var loaded = false;

        seen[name] = { }; // placeholder for run-time cycles

        try {
          reified = reify(mod.deps, name, seen[name]);
          module = mod.callback.apply(this, reified.deps);
          loaded = true;
        } finally {
          if (!loaded) {
            state[name] = FAILED;
          }
        }

        return reified.exports ? seen[name] : (seen[name] = module);
      };

      function resolve(child, name) {
        if (child.charAt(0) !== '.') { return child; }

        var parts = child.split('/');
        var nameParts = name.split('/');
        var parentBase;

        if (nameParts.length === 1) {
          parentBase = nameParts;
        } else {
          parentBase = nameParts.slice(0, -1);
        }

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
    var trim = __dependency1__.trim;
    var splitValueIntoGroups = __dependency1__.splitValueIntoGroups;

    var currencies = {};
    var registerCurrency = function (data) {
      currencies[data.code.toLowerCase()] = data;
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
      // Fast path; null values should return null
      if (money == null || money.value == null) {
        return null;
      }

      options = options || {};

      var currency = currencies[money.currency.toLowerCase()];
      var value = money.value;
      var locale = locales[options.locale || defaultLocale];

      var majorValue = Math.floor(Math.abs(value) / currency.precision);
      var minorValue = Math.round(Math.abs(value) - majorValue * currency.precision);

      var formatting = locale.positive;
      if (value < 0) {
        formatting = locale.negative;
      }

      var code = currency.code;
      var symbol = currency.symbol;
      if (options.html && currency.symbol_html) {
        symbol = currency.symbol_html;
      }

      var stripInsignificantZeros = options.stripInsignificantZeros;
      if (options.noMinorUnits || currency.minor_units === 0) {
        minorValue = 0;
        stripInsignificantZeros = true;
      }

      if (minorValue === 0 && majorValue === 0 && options.free) {
        return options.free;
      }

      var decimalSymbol = formatting.decimal_symbol;
      if (stripInsignificantZeros && minorValue === 0) {
        minorValue = '';
        decimalSymbol = '';
      } else {
        if (minorValue === 0 && locale.zero) {
          formatting = locale.zero;
        } else {
          minorValue = rjust(minorValue, currency.minor_units, "0");
        }
      }

      var majorValue = splitValueIntoGroups(majorValue, formatting.digit_grouping_style).join(formatting.digit_grouping_symbol);

      if (options.number) {
        symbol = '';
        code = '';
      }

      return trim(fmt(formatting.layout, {
        symbol: symbol,
        code: code,
        decimal: decimalSymbol,
        major_value: majorValue,
        minor_value: minorValue
      }));
    };

    var parse = function (value, options) {
      if (value == null || value === '') {
        return null;
      }

      options = options || {};
      var locale = locales[options.locale || defaultLocale];
      var currency = currencies[(options.currency || '').toLowerCase()];

      var digitGroupingSymbol = locale.positive.digit_grouping_symbol;
      var decimalSymbol = locale.positive.decimal_symbol;

      value = value.replace(digitGroupingSymbol, '')
                   .replace(decimalSymbol, '.')
                   .replace(/[^\d-.()]/g, '');

      if (/\([\d\.]+\)/.test(value)) {
        value = parseFloat(value.replace('(', '').replace(')', '').replace('-', ''), 10) * - 1;
      } else {
        value = parseFloat(value, 10);
      }

      if (currency) {
        value = Math.floor(value * currency.precision);
      }

      return value;
    };

    __exports__.registerCurrency = registerCurrency;
    __exports__.registerLocale = registerLocale;
    __exports__.format = format;
    __exports__.parse = parse;
    __exports__.reset = reset;
    __exports__["default"] = {
      currencies: currencies,
      locales: locales,
      registerCurrency: registerCurrency,
      registerLocale: registerLocale,
      format: format,
      parse: parse,
      reset: reset
    };
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

    var trim = function (string) {
      if (typeof String.prototype.trim !== 'function') {
        return string.replace(/^\s+|\s+$/g, '');
      } else {
        return string.trim();
      }
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
    __exports__.trim = trim;
  });