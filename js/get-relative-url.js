/* exported getRelativeUrl */

'use strict';

define(function() { //eslint-disable-line no-undef

  /**
   * Получение относительного адреса из абсолютного
   * @example
   * На входе:
   * https://js-htmlacademy.github.io/37104-code-and-magick/index.html/img/screenshots/2.png
   * На выходе:
   * /img/screenshots/2.png
   * @param absoluteUrl
   * @return {*}
   */
  function getRelativeUrl(absoluteUrl) {
    var pathArray = window.location.pathname.split('/');
    pathArray = pathArray[1];
    return absoluteUrl.replace(location.origin + '/' + pathArray, '').indexOf('/') === 0 ? absoluteUrl.replace(location.origin + '/' + pathArray, '') : '/' + absoluteUrl.replace(location.origin + '/' + pathArray, '');
  }

  return getRelativeUrl;

});
