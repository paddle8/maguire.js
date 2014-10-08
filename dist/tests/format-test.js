var maguire = require('maguire');
var format = maguire.format;

maguire.registerCurrency("USD", {
  name: 'US Dollar',
  code: 'USD',
  minor_units: 2,
  precision: 100,
  symbol: '$'
});

maguire.registerCurrency("EUR", {
  name: 'Euro',
  code: 'EUR',
  minor_units: 2,
  precision: 100,
  symbol: '€',
  symbol_html: '&euro;'
});

maguire.registerCurrency("JPY", {
  name: 'Japanese Yen',
  code: 'JPY',
  minor_units: 0,
  precision: 1,
  symbol: '¥',
  symbol_html: '&yen;'
});

maguire.registerCurrency("DOGE", {
  name: 'Doge coin',
  code: 'DOGE',
  minor_units: 0,
  precision: 1,
  symbol: 'D'
});

maguire.registerLocale('en-US', {
  digit_grouping_style: 'triples',
  positive: {
    layout: "%{symbol}%{major_value}%{decimal}%{minor_value}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
  },
  negative: {
    layout: "-%{symbol}%{major_value}%{decimal}%{minor_value}",
    decimal_symbol: '.',
    digit_grouping_symbol: ','
  }
});

maguire.registerLocale('fr-FR', {
  digit_grouping_style: 'triples',
  positive: {
    layout: "%{major_value}%{decimal}%{minor_value} %{symbol}",
    decimal_symbol: ',',
    digit_grouping_symbol: ' ',
  }
});

maguire.registerLocale('en-IN', {
  digit_grouping_style: 'south_asian',
  positive: {
    layout: "%{symbol}%{major_value}%{decimal}%{minor_value}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
  },
});

maguire.registerLocale('ja-JP', {
  digit_grouping_style: 'quadruples',
  positive: {
    layout: "%{major_value}%{decimal}%{minor_value}%{symbol}",
    decimal_symbol: '.',
    digit_grouping_symbol: ',',
  },
});

maguire.registerLocale('en-NO', {
  digit_grouping_style: 'triples',
  positive: {
    layout: "%{symbol} %{major_value}%{decimal}%{minor_value}",
    decimal_symbol: ',',
    digit_grouping_symbol: '.'
  },
  zero: {
    layout: "%{symbol} %{major_value}%{decimal}-",
    decimal_symbol: ',',
    digit_grouping_symbol: '.'
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
