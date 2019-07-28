// include decimal.js module
const Decimal = require('decimal.js');

module.exports = {
  multiply: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    result = x1.mul(x2);
    result[1] = result[0];
    return result;
  },
  divide: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    result = x1.div(x2);
    result[1] = result[0];
    return result;
  },
  add: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    result = x1.plus(x2);
    result[1] = result[0];
    return result;
  },
  subtract: function (x) {
    x1 = new Decimal(x[1])
    x2 = new Decimal(x[2])
    result = x1.sub(x2);
    result[1] = result[0];
    return result;
  },
  squared: function (x) {
    x1 = new Decimal(x[1])
    result = x1.pow(2);
    result[1] = result[0];
    return result;
  },
  cubed: function (x) {
    x1 = new Decimal(x[1])
    result = x1.pow(3);
    result[1] = result[0];
    return result;
  },
  rootsquared: function (x) {
    x1 = new Decimal(x[1])
    result = x1.sqrt();
    result[1] = result[0];
    return result;
  },
  rootcubed: function (x) {
    x1 = new Decimal(x[1])
    result = x1.cbrt();
    result[1] = result[0];
    return result;
  }
}