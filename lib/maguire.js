import { fmt, rjust, splitValueIntoGroups } from "./maguire/utils";

var config = function (currencies, locale) {
};

var format = function (money, options) {
  var currency = [money.currency];
  var value = money.value;

  var majorValue = Math.abs(value) / currency.precision;
  var minorValue = Math.round(Math.abs(value) - majorValue * currency.precision);

  var groups = splitValueIntoGroups(majorValue, locale.format_style);

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
    decmialSymbol = '';
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

export { config, format };
