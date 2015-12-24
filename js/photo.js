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
     * @return {string}
     */
    getUrl: function() {
      return this.url;
    },

    /**
     * @param {string} url
     */
    setUrl: function(url) {
      this.url = url;
    }

  };

  return Photo;
});
