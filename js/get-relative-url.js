/* global getRelativeUrl: true */
/* exported getRelativeUrl */

'use strict';

(function() {
  function getRelativeUrl(absoluteUrl) {
    // Получение относительного адреса из абсолютного
    var pathArray = window.location.pathname.split('/');
    pathArray = pathArray[1];
    return absoluteUrl.replace(location.origin + '/' + pathArray, '').indexOf('/') === 0 ? absoluteUrl.replace(location.origin + '/' + pathArray, '') : '/' + absoluteUrl.replace(location.origin + '/' + pathArray, '');
  }

  window.getRelativeUrl = getRelativeUrl;
})();
