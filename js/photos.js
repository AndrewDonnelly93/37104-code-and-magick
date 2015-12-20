'use strict';

define([ //eslint-disable-line no-undef
  'photo',
  'video',
  'gallery'
], function(Photo, Video, Gallery) {

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
      gallery.changeLocationHash(i);
    });
  });

});
