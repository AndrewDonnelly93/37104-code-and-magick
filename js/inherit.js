/* exported inherit */

'use strict';

define(function() { //eslint-disable-line no-undef

  /**
   * Принимает два конструктора и записывает в прототип
   * дочернего конструктора child методы и свойства родительского конструктора parent
   * через пустой конструктор
   * @param {Function} child
   * @param {Function} parent
   */

  function inherit(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
    child.prototype.constructor = child;
  }

  return inherit;
});
