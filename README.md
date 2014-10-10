## Maguire.js

A small client-side library that works in conjunction with maguire to format money.

### Configuring the library

Maguire.js doesn't come with any locale / currency support by default. It's designed to get data from your server tailored to the needs of the specific end user.

If maguire.js is being used in conjunction with maguire for Ruby, the following snippit should do the trick:

```javascript
var maguire = require('maguire');

// Register currencies for this user
$.getJSON('/currencies', function (currencies) {
  currencies.forEach(maguire.registerCurrency);
});

$.getJSON('/locale', function (locale) {
  maguire.registerLocale(locale.id, locale);
});
```

### Formatting

Once configured, you may start formatting your money:

```javascript
var format = require('maguire').format;

format({ value: 2000, currency: 'USD' });
// => $20.00
```
