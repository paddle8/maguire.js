import { fmt, rjust, trim, splitValueIntoGroups } from "./maguire/utils";

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

export { registerCurrency, registerLocale, format, parse, reset };
export default {
  registerCurrency: registerCurrency,
  registerLocale: registerLocale,
  format: format,
  parse: parse,
  reset: reset
};
