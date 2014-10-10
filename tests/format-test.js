var maguire = require('maguire');
var format = maguire.format;

maguire.registerCurrency({
  name: 'US Dollar',
  code: 'USD',
  minor_units: 2,
  precision: 100,
  symbol: '$'
});

maguire.registerCurrency({
  name: 'Euro',
  code: 'EUR',
  minor_units: 2,
  precision: 100,
  symbol: '€',
  symbol_html: '&euro;'
});

maguire.registerCurrency({
  name: 'Japanese Yen',
  code: 'JPY',
  minor_units: 0,
  precision: 1,
  symbol: '¥',
  symbol_html: '&yen;'
});

maguire.registerCurrency({
  name: 'Doge coin',
  code: 'DOGE',
  minor_units: 0,
  precision: 1,
  symbol: 'D'
});

maguire.registerLocale('en-US', {
  positive: {
    layout: "%{symbol}%{major_value}%{decimal}%{minor_value}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
    digit_grouping_style: 'triples'
  },
  negative: {
    layout: "-%{symbol}%{major_value}%{decimal}%{minor_value}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
    digit_grouping_style: 'triples'
  }
});

maguire.registerLocale('fr-FR', {
  positive: {
    layout: "%{major_value}%{decimal}%{minor_value} %{symbol}",
    decimal_symbol: ',',
    digit_grouping_symbol: ' ',
    digit_grouping_style: 'triples'
  }
});

maguire.registerLocale('en-IN', {
  positive: {
    layout: "%{symbol}%{major_value}%{decimal}%{minor_value}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
    digit_grouping_style: 'south_asian'
  },
});

maguire.registerLocale('ja-JP', {
  positive: {
    layout: "%{major_value}%{decimal}%{minor_value}%{symbol}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
    digit_grouping_style: 'quadruples'
  },
});

maguire.registerLocale('en-NO', {
  positive: {
    layout: "%{symbol} %{major_value}%{decimal}%{minor_value}",
    decimal_symbol: ',',
    digit_grouping_symbol: '.',
    digit_grouping_style: 'triples'
  },
  zero: {
    layout: "%{symbol} %{major_value}%{decimal}-",
    decimal_symbol: ',',
    digit_grouping_symbol: '.',
    digit_grouping_style: 'triples'
  }
});

module("maguire#format");

test("without options", function () {
  equal(format({ value: 50000000, currency: 'USD' }), "$500,000.00");
});

test("negative values", function () {
  equal(format({ value: -2000, currency: 'USD' }), "-$20.00");
});

test("foreign currencies", function () {
  equal(format({ value: 50000000, currency: 'EUR' }, { locale: 'en-US' }), "€500,000.00");
  equal(format({ value: 50000000, currency: 'JPY' }, { locale: 'en-US' }), "¥50,000,000");

  equal(format({ value: 50000000, currency: 'EUR' }, { locale: 'fr-FR' }), "500 000,00 €");
  equal(format({ value: 50000000, currency: 'JPY' }, { locale: 'fr-FR' }), "50 000 000 ¥");
});

test("South Asian style formatting", function () {
  equal(format({ value: 123456789012, currency: 'USD' }, { locale: 'en-IN' }), "$1,23,45,67,890.12");
});

test("old style Chinese / Japanese formatting", function () {
  equal(format({ value: 123456789012, currency: 'USD' }, { locale: 'ja-JP' }), "12,3456,7890.12$");
});

test("html encoded symbols", function () {
  equal(format({ value: 1, currency: 'EUR' }, { html: true }), "&euro;0.01");
});

test("hiding minor units when noMinorUnits is passed as an option", function () {
  equal(format({ value: 2000, currency: 'USD' }, { noMinorUnits: true }), "$20");
});

test("only shows the minor value if it exists when stripInsignificantZeros is passed as an option", function () {
  equal(format({ value: 1, currency: 'USD' }, { stripInsignificantZeros: true }), "$0.01");
  equal(format({ value: 100, currency: 'USD' }, { stripInsignificantZeros: true }), "$1");
});

test("no decimal symbol is shown if the currency has no minor units", function () {
  equal(format({ value: 1, currency: 'DOGE' }), "D1");
});

test("custom formatting when the minor unit is zero", function () {
  equal(format({ value: 100000, currency: 'USD' }, { locale: 'en-NO' }), "$ 1.000,-");
});

test("free", function () {
  equal(format({ value: 0, currency: 'USD' }, { free: "Free" }), "Free");
  equal(format({ value: 10, currency: 'USD' }, { noMinorUnits: true, free: "Gratis" }), "Gratis");
  equal(format({ value: 1, currency: 'JPY' }, { free: "Free" }), "¥1");
});
