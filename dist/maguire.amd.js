define("maguire", 
  ["maguire/utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fmt = __dependency1__.fmt;
    var rjust = __dependency1__.rjust;
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

    var formatNumber = function (money) {
      var currency = currencies[money.currency.toLowerCase()];
      var value = money.value;
      if (value == null || value === '') {
        return null;
      }

      var majorValue = Math.floor(Math.abs(value) / currency.precision);
      var minorValue = Math.round(Math.abs(value) - majorValue * currency.precision);

      return parseFloat(majorValue + "." + minorValue, 10);
    };

    var format = function (money, options) {
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

      var groups = splitValueIntoGroups(majorValue, formatting.digit_grouping_style);

      return fmt(formatting.layout, {
        symbol: symbol,
        code: currency.code,
        decimal: decimalSymbol,
        major_value: groups.join(formatting.digit_grouping_symbol),
        minor_value: minorValue
      });
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
    __exports__.formatNumber = formatNumber;
    __exports__.parse = parse;
    __exports__.reset = reset;
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