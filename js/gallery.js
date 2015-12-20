/* global toggleClass: true, Video: true */


'use strict';

(function() {

  /**
   * Создает объект типа 'Галерея'
   * @constructor
   */
  function Gallery() {
    this.element = document.querySelector('.overlay-gallery');
    // контейнер, в котором хранится фотография
    this.photoContainer = document.querySelector('.overlay-gallery-preview');
    // номер текущей фотографии
    this.previewNumberCurrent = document.querySelector('.preview-number-current');
    // количество всех фотографий
    this.previewNumberTotal = document.querySelector('.preview-number-total');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._prevButton = document.querySelector('.overlay-gallery-control-left');
    this._nextButton = document.querySelector('.overlay-gallery-control-right');
    // номер текущего изображения
    this._currentImageNumber = 0;
    this.pictures = [];
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._pressPrevButton = this._pressPrevButton.bind(this);
    this._pressNextButton = this._pressNextButton.bind(this);
    this.togglePlayVideo = this.togglePlayVideo.bind(this);
    this.setPictures = this.setPictures.bind(this);
  }

  Gallery.prototype = {

    /**
     * Отдает номер текущего изображения
     * @return {number}
     * @private
     */
    _getCurrentImageNumber: function() {
      return this._currentImageNumber;
    },

    /**
     * Устанавливает номер текущего изображения
     * @param {number} number
     * @private
     */
    _setCurrentImageNumber: function(number) {
      this._currentImageNumber = number;
    },

    /**
     * Отдает оверлей галереи
     * @return {Element}
     */
    getElement: function() {
      return this.element;
    },

    /**
     * Отдает контейнер, в котором находится фотография
     * @return {HTMLElement|*}
     * @private
     */
    _getPhotoContainer: function() {
      return this.photoContainer;
    },

    /**
     * Отдает контейнер, в котором находится номер текущей фотографии
     * @return {HTMLElement|*}
     * @private
     */
    _getPreviewNumberCurrent: function() {
      return this.previewNumberCurrent;
    },

    /**
     * Отдает контейнер, в котором находится количество всех фотографий
     * @return {HTMLElement|*}
     * @private
     */
    _getPreviewNumberTotal: function() {
      return this.previewNumberTotal;
    },

    /**
     * Отдает крестик для закрытия галереи
     * @private
     * @return {Element}
     */
    _getCloseButton: function() {
      return this._closeButton;
    },

    /**
     * Отдает левый контрол
     * @private
     * @return {Element}
     */
    _getPrevButton: function() {
      return this._prevButton;
    },

    /**
     * Отдает правый контрол
     * @private
     * @return {Element}
     */
    _getNextButton: function() {
      return this._nextButton;
    },

    /**
     * Показывает галерею
     */
    show: function() {
      toggleClass(this.getElement(), 'invisible');
      // Установка слушателя кликов на крестике
      document.addEventListener('click', this._onCloseClick);
      // Установка слушатели событий на клики по контролам
      this._getPrevButton().addEventListener('click', this._pressPrevButton);
      this._getNextButton().addEventListener('click', this._pressNextButton);
      // Закрываем галерею по клику на esc
      document.addEventListener('keydown', this._onDocumentKeyDown);
    },

    /**
     * Прячет галерею
     */
    hide: function() {
      toggleClass(this.getElement(), 'invisible', true);
      // Удаление слушателя событий с крестика
      document.removeEventListener('click', this._onCloseClick);
      // Удаление слушателей событий кликов по контролам
      this._getPrevButton().removeEventListener('click', this._pressPrevButton);
      this._getNextButton().removeEventListener('click', this._pressNextButton);
      document.removeEventListener('keydown', this._onDocumentKeyDown);
    },

    /**
     * Обработчик события клика на крестике
     * @private
     */
    _onCloseClick: function(e) {
      // По клику на document галерея закрывается, если этот элемент не принадлежит самой галерее
      // По клику на крестик галерея также закрывается
      if (!(e.target === this._getCloseButton())) {
        if (this.contains(this.getElement(), e.target)) {
          return false;
        }
      }
      this.hide();
    },

    /**
     * Закрывает галерею по клику на esc
     * @private
     */
    _onDocumentKeyDown: function(e) {
      switch (e.keyCode) {
        // escape
        case 27:
          this.hide();
          break;
        // правая стрелка
        case 39:
          this._pressNextButton();
          break;
        // левая стрелка
        case 37:
          this._pressPrevButton();
          break;
        default:
          break;
      }
    },

    /**
     * Проверка, находится ли элемент, на котором произошло событие,
     * в контейнере
     * @param container
     * @param element
     */
    contains: function(container, element) {
      if (container === element) {
        return true;
      } else if (element.parentNode) {
        return this.contains(container, element.parentNode);
      } else {
        return false;
      }
    },

    /**
     * Обработчик нажатия на контрол для перемещения влево
     * @private
     */
    _pressPrevButton: function() {
      var currentPicture = this._getCurrentImageNumber();
      if (currentPicture - 1 >= 0) {
        currentPicture -= 1;
        this._setCurrentImageNumber(currentPicture);
        this.setCurrentPicture(currentPicture);
      }
    },

    /**
     * Обработчик нажатия на контрол для перемещения вправо
     * @private
     */
    _pressNextButton: function() {
      var currentPicture = this._getCurrentImageNumber();
      // Если номер следующей фотографии меньше, чем длина массива
      // pictures, уменьшенная на 1, показываем следующую фотографию
      if (currentPicture + 1 <= (this.getPictures().length - 1)) {
        currentPicture += 1;
        this._setCurrentImageNumber(currentPicture);
        this.setCurrentPicture(currentPicture);
      }
    },

    /**
     * Передает в галерею фотографии
     * @param {Array.<Photo|Video>} photos
     */
    setPictures: function(photos) {
      photos.forEach((function(photo) {
        this.pictures.push(photo);
      }).bind(this));
    },

    /**
     * Отдает массив фотографий
     * @returns {Array}
     */
    getPictures: function() {
      return this.pictures;
    },

    /**
     * Берет фотографию из массива фотографий,
     * отрисовывает ее в галерее, обновляя .overlay-gallery:
     * добавляет фото в .overlay-gallery-preview, обновляет блоки
     * .preview-number-current и .preview-number-total
     * @param {number} number
     */
    setCurrentPicture: function(number) {
      var container = this._getPhotoContainer();
      var pictures = this.getPictures();
      var prevButton = this._getPrevButton();
      var nextButton = this._getNextButton();

      switch (number) {
        // Если текущая фотография является первой, показываем ее
        // и скрываем левый контрол
        case 0:
          toggleClass(prevButton, 'invisible', true);
          break;
        // Если текущая фотография является последней, показываем ее
        // и скрываем правый контрол
        case pictures.length - 1:
          toggleClass(nextButton, 'invisible', true);
          break;
        // Показываем оба контрола
        default:
          toggleClass(prevButton, 'invisible', false);
          toggleClass(nextButton, 'invisible', false);
          break;
      }

      // Это потребуется при вызове метода, если
      // e.target - preview картинки на основной странице
      if (this._getCurrentImageNumber() !== number) {
        this._setCurrentImageNumber(number);
      }
      // Добавление фотографии в контейнер
      // Сначала удаляются предыдущие изображения/видео
      Array.prototype.forEach.call(container.children, function(item) {
        document.removeEventListener('click', Gallery.togglePlayVideo);
        container.removeChild(item);
      });
      // Создаем фотографию или видео
      if (pictures[number] instanceof Video) {
        var video = document.createElement('video');
        var sourceMP4 = document.createElement('source');
        sourceMP4.type = 'video/mp4';
        sourceMP4.src = pictures[number].getUrl();
        video.autoplay = true;
        video.loop = true;
        video.appendChild(sourceMP4);
        // По клике на видео оно будет останавливаться или запускаться
        document.addEventListener('click', this.togglePlayVideo);
        container.appendChild(video);
      } else {
        var photo = new Image();
        photo.src = pictures[number].getUrl();
        container.appendChild(photo);
      }
      // Обновление блока .preview-number-current
      this._getPreviewNumberCurrent().textContent = (number + 1).toString();
      // Обновление блока .preview-number-total
      this._getPreviewNumberTotal().textContent = pictures.length.toString();
    },

    /**
     * Метод для переключения текущего состояния видео
     * @param e
     */
    togglePlayVideo: function(e) {
      if (e.target.tagName === 'VIDEO') {
        return e.target.paused ? e.target.play() : e.target.pause();
      }
    }
  };

  window.Gallery = Gallery;

})();


