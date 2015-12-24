/* exported Video */

'use strict';

define([
  'inherit',
  'photo'
], function(inherit, Photo) {

  /**
   * Конструктор объекта Video.
   * @param {string} url
   * @extends {Photo}
   * @constructor
   */
  function Video(url) {
    Photo.call(this, url);
  }

  inherit(Video, Photo);

  return Video;

});
