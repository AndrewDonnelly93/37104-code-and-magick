function getArraySum(a){
  var sum = 0;
  a.forEach(function(item, i, a) {
    sum += item;
  });
  return sum;
}

function getArraysProduct(a,b) {
  var product = 0;
  a.forEach(function(item, i, a) {
    product += item * b[i];
  });
  return product;
}

function getMessage(a,b) {
  var typeA = typeof a;
  var typeB = typeof b;
  switch (typeA) {
    case 'boolean':
      if (a) {
        return 'Я попал в ' + b;
      } else {
        return 'Я никуда не попал';
      }
      break;
    case 'number':
      return 'Я прыгнул на ' + a*100 + ' сантиметров';
      break;
    case 'object':
      if (typeA !== typeB) {
        var sum = getArraySum(a);
        return 'Я прошел ' + sum + ' шагов';
      } else {
        var product = getArraysProduct(a,b);
        return 'Я прошел ' + product + ' метров';
      }
      break;
    default:
      break;
  }
}
