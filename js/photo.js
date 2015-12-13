/* global Photo: true */

'use strict';

(function() {
  /**
   * Конструктор объекта Photo
   * @param picture
   * @constructor
   */
  function Photo(picture) {
    this.picture = picture;
  }

  Photo.prototype = {

    /**
     * Возвращает адрес картинки
     * @returns {*}
     */
    getPhoto: function() {
      return this.picture;
    },

    /**
     * Устанавливает картинку в фотографию
     * объекта Photo
     * @param picture
     */
    setPhoto: function(picture) {
      this.picture = picture;
    }

  };

  window.Photo = Photo;
})();
