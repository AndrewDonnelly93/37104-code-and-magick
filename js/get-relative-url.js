/* exported getRelativeUrl */

'use strict';

define(function() {

  /**
   * Получение относительного адреса из абсолютного.
   * @example
   * На входе:
   * https://js-htmlacademy.github.io/37104-code-and-magick/index.html/img/screenshots/2.png
   * На выходе:
   * /img/screenshots/2.png
   * @param absoluteUrl
   * @return {string}
   */
  function getRelativeUrl(absoluteUrl) {
    var pathArray = window.location.pathname.split('/');
    pathArray = pathArray[1];
    var replacedPath = absoluteUrl.replace(location.origin + '/' + pathArray, '');
    return replacedPath.indexOf('/') === 0
      ? replacedPath
      : '/' + replacedPath;
  }

  return getRelativeUrl;

});
