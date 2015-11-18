function getArraySum(a){
  var sum = 0;
  a.forEach(function(item) {
    sum += item;
  });
  return sum;
}

function getArraysProduct(a, b) {
  var product = 0;
  a.forEach(function(item, i) {
    product += item * b[i];
  });
  return product;
}

function getMessage(a, b) {
  switch (true) {
    case (Array.isArray(a) && Array.isArray(b)):
      var product = getArraysProduct(a, b);
      return 'Я прошёл ' + product + ' метров';
      break;
    case (Array.isArray(a)):
      var sum = getArraySum(a);
      return 'Я прошёл ' + sum + ' шагов';
      break;
    case (typeof a === 'number'):
      return 'Я прыгнул на ' + a * 100 + ' сантиметров';
      break;
    case (typeof a === 'boolean'):
      if (a) {
        return 'Я попал в ' + b;
      } else {
        return 'Я никуда не попал';
      }
      break;
    default:
      return 'Я не знаю, что вы хотели сделать.';
      break;
  }
}
