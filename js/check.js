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
  if (Array.isArray(a) && Array.isArray(b)) {
    var product = getArraysProduct(a, b);
    return 'Я прошёл ' + product + ' метров';
  } else if (Array.isArray(a)) {
    var sum = getArraySum(a);
    return 'Я прошёл ' + sum + ' шагов';
  } else if (typeof a === 'number') {
    return 'Я прыгнул на ' + a * 100 + ' сантиметров';
  } else if (typeof a === 'boolean') {
    if (a && b) {
      return 'Я попал в ' + b;
    } else {
      return 'Я никуда не попал';
    }
  } else {
    return 'Я не знаю, что вы хотели сделать.';
  }
}
