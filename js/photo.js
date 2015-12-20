/* exported Photo */

'use strict';

define(function() {

  /**
   * Конструктор объекта Photo.
   * @param {string} url
   * @constructor
   */
  function Photo(url) {
    this.url = url;
  }

  Photo.prototype = {

    /**
     * Возвращает адрес картинки.
     * @return {string}
     */
    getUrl: function() {
      return this.url;
    },

    /**
     * Устанавливает картинку в фотографию
     * объекта Photo.
     * @param {string} url
     */
    setUrl: function(url) {
      this.url = url;
    }

  };

  return Photo;
});
