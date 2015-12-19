'use strict';

define([ //eslint-disable-line no-undef
  'photo',
  'video',
  'gallery',
  'get-relative-url'
], function(Photo, Video, Gallery, getRelativeUrl) {

  /**
   * Собираем массив объектов Photo из photogallery
   * @type {*|Array}
   */

  var pictures = Array.prototype.map.call(document.querySelectorAll('.photogallery-image'), function(pic) {
    return pic.dataset.replacementVideo ?
      new Video(pic.dataset.replacementVideo) : new Photo(pic.querySelector('img').src);
  });

  /**
   * Создание текущей галереи
   * @type {Gallery}
   */
  var gallery = new Gallery();

  // Заполняем галерею картинками
  gallery.setPictures(pictures);

  // При создании галереи вызывается метод, определяющий
  // изменение состояния хэша в адресной строке
  gallery.restoreFromHash();

  var galleryImages = document.querySelectorAll('.photogallery .photogallery-image');

  /**
   * При клике на картинку изменяется хэш в адресной строке, что
   * вызывает показ галереи
   */
  Array.prototype.forEach.call(galleryImages, function(image, i) {
    image.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var url = getRelativeUrl(gallery.getPictures()[i].getUrl());
      // Меняем hash в адресной строке на #photo/<путь к фотографии>
      location.hash = 'photo' + url;
    });
  });

});
