/* exported Photo */

'use strict';

define(function() { //eslint-disable-line no-undef

  /**
   * Конструктор объекта Photo
   * @param url
   * @constructor
   */
  function Photo(url) {
    this.url = url;
  }

  Photo.prototype = {

    /**
     * Возвращает адрес картинки
     * @returns {*}
     */
    getUrl: function() {
      return this.url;
    },

    /**
     * Устанавливает картинку в фотографию
     * объекта Photo
     * @param url
     */
    setUrl: function(url) {
      this.url = url;
    }

  };

  return Photo;
});
