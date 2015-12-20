'use strict';

define([ //eslint-disable-line no-undef
  'photo',
  'video',
  'gallery',
  'get-relative-url'
], function(Photo, Video, Gallery, getRelativeUrl) {

  var galleryImages = document.querySelectorAll('.photogallery-image');

  /**
   * Собираем массив объектов Photo из photogallery.
   * @type {Array}
   */

  var pictures = Array.prototype.map.call(galleryImages, function(pic) {
    return pic.dataset.replacementVideo ?
      new Video(pic.dataset.replacementVideo) : new Photo(pic.querySelector('img').src);
  });

  /**
   * Создание текущей галереи.
   * @type {Gallery}
   */
  var gallery = new Gallery();

  gallery.setPictures(pictures); // Заполняем галерею картинками.

  // При создании галереи вызывается метод, определяющий
  // изменение состояния хэша в адресной строке.
  gallery.restoreFromHash();

  /**
   * При клике на картинку изменяется хэш в адресной строке, что
   * вызывает показ галереи.
   */
  Array.prototype.forEach.call(galleryImages, function(image, i) {
    image.addEventListener('click', function(e) {
      e.preventDefault();
      var url = getRelativeUrl(gallery.getPictures()[i].getUrl());
      location.hash = 'photo' + url; // Меняем hash в адресной строке на #photo/<путь к фотографии>.
    });
  });

});
