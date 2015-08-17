var maguire = require('maguire');
var parse = maguire.parse;

module("maguire#parse", {
  setup: function () {
    maguire.registerCurrency({
      name: 'US Dollar',
      code: 'USD',
      minor_units: 2,
      precision: 100,
      symbol: '$'
    });

    maguire.registerCurrency({
      name: 'Japanese Yen',
      code: 'JPY',
      minor_units: 0,
      precision: 1,
      symbol: '¥',
      symbol_html: '&yen;'
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
      },
      zero: {
        layout: "%{symbol}%{major_value}%{decimal}--",
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
  },
  teardown: maguire.reset
});

test("5 Yen", function () {
  equal(parse("5"), 5);
});

test("¥5000", function () {
  equal(parse("¥5000"), 5000);
});

test("¥5,0000", function () {
  equal(parse("¥5,0000"), 50000);
});

test("-¥5,0000", function () {
  equal(parse("-¥5,0000"), -50000);
});

test("-$500.--", function () {
  equal(parse("-$500.--"), -500);
});

test("$1,234,567,890.12", function () {
  equal(parse("$1,234,567,890.12"), 1234567890.12);
});

test("$(200)", function () {
  equal(parse("$(200)"), -200);
});

test("-$(200)", function () {
  equal(parse("-$(200)"), -200);
});

test("$200.2535", function () {
  equal(parse("$200.2535", { currency: 'USD' }), 20025);
});

test("$64.99", function () {
  equal(parse("$64.99", { currency: 'USD' }), 6499);
});

test("null", function () {
  equal(parse(null), null);
  equal(parse(''), null);
});

test("locale", function () {
  equal(parse("2 129,80", { locale: "fr-FR" }), 2129.80);
});
