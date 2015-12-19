/* exported Video */

'use strict';

define([ //eslint-disable-line no-undef
  'inherit',
  'photo'
], function(inherit, Photo) {
  /**
   * Конструктор объекта Video
   * @param url
   * @extends {Photo}
   * @constructor
   */
  function Video(url) {
    Photo.call(this, url);
  }

  /**
   * Video объявляется наследником Photo
   */
  inherit(Video, Photo);

  return Video;

});
