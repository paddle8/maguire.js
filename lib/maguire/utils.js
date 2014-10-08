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

export { rjust, fmt, splitValueIntoGroups };
