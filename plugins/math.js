// include decimal.js module
const Decimal = require('decimal.js');

module.exports = {
  multiply: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    x = x1.mul(x2);
    return x;
  },
  divide: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    x = x1.div(x2);
    return x;
  },
  add: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    x = x1.plus(x2);
    return x;
  },
  subtract: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    x = x1.sub(x2);
    return x;
  },
  squared: function (x) {
    x1 = new Decimal(x[1])
    x = x1.pow(2);
    return x;
  },
  cubed: function (x) {
    x1 = new Decimal(x[1])
    x = x1.pow(3);
    return x;
  },
  rootsquared: function (x) {
    x1 = new Decimal(x[1])
    x = x1.sqrt();
    return x;
  },
  rootcubed: function (x) {
    x1 = new Decimal(x[1])
    x = x1.cbrt();
    return x;
  }
}