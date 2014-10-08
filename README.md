## Maguire.js

A small client-side library that works in conjunction with maguire to format money.

### Configuring the library

Maguire.js doesn't come with any locale / currency support by default. It's designed to get data from your server tailored to the needs of the specific end user.

Adding a currencies is simply:

```javascript
var maguire = require('maguire');
maguire.registerCurrencies([{
  name: 'US Dollar',
  code: 'USD',
  number: '840',
  minor_units: 2,
  precision: 100,
  symbol: '$'
}]);
```
