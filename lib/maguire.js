import { fmt, rjust, splitValueIntoGroups } from "./maguire/utils";

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
      formatting = locale.zero
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
  options = options || {};
  var locale = locales[options.locale || defaultLocale];

  var digitGroupingSymbol = locale.positive.digit_grouping_symbol;
  var decimalSymbol = locale.positive.decimal_symbol;

  value = value.replace(digitGroupingSymbol, '')
               .replace(decimalSymbol, '.')
               .replace(/[^\d-.()]/g, '');

  if (/\([\d\.]+\)/.test(value)) {
    return parseFloat(value.replace('(', '').replace(')', '').replace('-', ''), 10) * - 1;
  }

  return parseFloat(value, 10);
}

export { registerCurrency, registerLocale, format, parse, reset };
