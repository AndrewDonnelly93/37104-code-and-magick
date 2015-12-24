/**
 * Возвращает сообщение в зависимости от действий пользователя
 * @param {Array|number|boolean} a
 * @param {Array|number|boolean=} b
 * @return {string}
 */
function getMessage(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    var product = a.reduce(function(sum, item, i) {
      return sum + item * b[i];
    }, 0);
    return 'Я прошёл ' + product + ' метров';

  } else if (Array.isArray(a)) {
    var sum = a.reduce(function(sum, item) {
      return sum + item;
    }, 0);
    return 'Я прошёл ' + sum + ' шагов';

  } else if (typeof a === 'number') {
    return 'Я прыгнул на ' + a * 100 + ' сантиметров';

  } else if (typeof a === 'boolean') {
      return a && b ? 'Я попал в ' + b : 'Я никуда не попал';

  } else {
    return 'Я не знаю, что вы хотели сделать.';
  }
}
