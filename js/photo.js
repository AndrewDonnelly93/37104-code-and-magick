/* global Photo: true, Video: true, inherit: true */
/* exported Photo */
/* exported Video */

'use strict';

(function() {
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

  /**
   * Конструктор объекта Video
   * @param url
   * @constructor
   */
  function Video(url) {
    Photo.call(this, url);
  }

  /**
   * Video объявляется наследником Photo
   */
  inherit(Video, Photo);

  window.Photo = Photo;

  window.Video = Video;
})();
