(function() {

  /**
   * Собираем массив объектов Photo из photogallery
   * @type {*|Array}
   */
  var pictures = Array.prototype.map.call(document.querySelectorAll('.photogallery-image'), function(pic) {
    return new Photo(pic.querySelector('img').src);
  });

  console.log(pictures);

  /**
   * Создание текущей галереи
   * @type {Gallery}
   */
  var gallery = new Gallery();

  // Заполняем галерею картинками
  gallery.setPictures(pictures);

  var galleryImages = document.querySelectorAll('.photogallery .photogallery-image');

  /**
   * Галерея показывается при клике на картинку
   */
  Array.prototype.forEach.call(galleryImages, function(image, i) {
    image.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      gallery.show();
      gallery.setCurrentPicture(i);
    });
  });
})();
