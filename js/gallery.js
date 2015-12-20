'use strict';

define([
  'toggle-class',
  'video',
  'get-relative-url'
], function(toggleClass, Video, getRelativeUrl) {

  /**
   * Создает объект типа 'Галерея'.
   * @constructor
   */
  function Gallery() {
    this.element = document.querySelector('.overlay-gallery');
    this.photoContainer = document.querySelector('.overlay-gallery-preview'); // Контейнер, в котором хранится фотография.
    this.previewNumberCurrent = document.querySelector('.preview-number-current');  // Номер текущей фотографии.
    this.previewNumberTotal = document.querySelector('.preview-number-total');  // Количество всех фотографий.
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._prevButton = document.querySelector('.overlay-gallery-control-left');
    this._nextButton = document.querySelector('.overlay-gallery-control-right');

    this._currentImageNumber = 0; // Номер текущего изображения.
    this.pictures = [];
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPrevButtonPress = this._onPrevButtonPress.bind(this);
    this._onNextButtonPress = this._onNextButtonPress.bind(this);
    this.togglePlayVideo = this.togglePlayVideo.bind(this);
    this.setPictures = this.setPictures.bind(this);
    this.restoreFromHash = this.restoreFromHash.bind(this);
    this._onHashChange = this._onHashChange.bind(this);
    this.changeLocationHash = this.changeLocationHash.bind(this);

    // При создании галереи вызывается метод, определяющий
    // изменение состояния хэша в адресной строке.
    window.addEventListener('hashchange', this._onHashChange);
  }

  Gallery.prototype = {

    /**
     * Отдает номер текущего изображения.
     * @return {number}
     * @private
     */
    _getCurrentImageNumber: function() {
      return this._currentImageNumber;
    },

    /**
     * Устанавливает номер текущего изображения.
     * @param {number} number
     * @private
     */
    _setCurrentImageNumber: function(number) {
      this._currentImageNumber = number;
    },

    /**
     * Отдает оверлей галереи.
     * @return {Element}
     */
    getElement: function() {
      return this.element;
    },

    /**
     * Отдает контейнер, в котором находится фотография.
     * @return {HTMLElement}
     * @private
     */
    _getPhotoContainer: function() {
      return this.photoContainer;
    },

    /**
     * Отдает контейнер, в котором находится номер текущей фотографии.
     * @return {HTMLElement}
     * @private
     */
    _getPreviewNumberCurrent: function() {
      return this.previewNumberCurrent;
    },

    /**
     * Отдает контейнер, в котором находится количество всех фотографий.
     * @return {HTMLElement}
     * @private
     */
    _getPreviewNumberTotal: function() {
      return this.previewNumberTotal;
    },

    /**
     * Отдает крестик для закрытия галереи.
     * @return {Element}
     * @private
     */
    _getCloseButton: function() {
      return this._closeButton;
    },

    /**
     * Отдает левый контрол.
     * @return {Element}
     * @private
     */
    _getPrevButton: function() {
      return this._prevButton;
    },

    /**
     * Отдает правый контрол.
     * @return {Element}
     * @private
     */
    _getNextButton: function() {
      return this._nextButton;
    },

    /** Показывает галерею. */
    show: function() {

      toggleClass(this.getElement(), 'invisible');
      document.addEventListener('click', this._onCloseClick); // Установка слушателя кликов на крестике.
      // Установка слушатели событий на клики по контролам.
      this._getPrevButton().addEventListener('click', this._onPrevButtonPress);
      this._getNextButton().addEventListener('click', this._onNextButtonPress);
      document.addEventListener('keydown', this._onDocumentKeyDown);  // Обработка нажатий на клавиши.

    },

    /** Прячет галерею. */
    hide: function() {

      toggleClass(this.getElement(), 'invisible', true);
      document.removeEventListener('click', this._onCloseClick);  // Удаление слушателя событий с крестика.
      // Удаление слушателей событий кликов по контролам.
      this._getPrevButton().removeEventListener('click', this._onPrevButtonPress);
      this._getNextButton().removeEventListener('click', this._onNextButtonPress);
      document.removeEventListener('keydown', this._onDocumentKeyDown);

      history.pushState('', document.title, window.location.pathname);  // Очистка хэша адресной строки.

    },

    /**
     * Обработчик события клика на крестике.
     * @private
     */
    _onCloseClick: function(e) {
      // По клику на document галерея закрывается, если этот элемент не принадлежит самой галерее.
      // По клику на крестик галерея также закрывается.
      if (!(e.target === this._getCloseButton())) {
        if (this.contains(this.getElement(), e.target)) {
          return false;
        }
      }
      this.hide();
    },

    /**
     * Обработка событий нажатия на клавиши
     * @param {KeyboardEvent} e
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
          this._onNextButtonPress();
          break;
        // левая стрелка
        case 37:
          this._onPrevButtonPress();
          break;
        default:
          break;
      }
    },

    /**
     * Проверка, находится ли элемент, на котором произошло событие,
     * в контейнере.
     * @param {Element} container
     * @param {Element} element
     * @return {boolean}
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
     * Обработчик нажатия на контрол для перемещения влево.
     * @private
     */
    _onPrevButtonPress: function() {
      var currentPicture = this._getCurrentImageNumber();
      if (currentPicture - 1 >= 0) {
        currentPicture -= 1;
        this.changeLocationHash(currentPicture);
      }
    },

    /**
     * Обработчик нажатия на контрол для перемещения вправо.
     * @private
     */
    _onNextButtonPress: function() {
      var currentPicture = this._getCurrentImageNumber();
      var pictures = this.getPictures();
      // Если номер следующей фотографии меньше, чем длина массива
      // pictures, уменьшенная на 1, показываем следующую фотографию.
      if (currentPicture < pictures.length - 1) {
        currentPicture += 1;
        this.changeLocationHash(currentPicture);
      }
    },

    /**
     * Передает в галерею фотографии.
     * @param {Array.<Photo>} photos
     */
    setPictures: function(photos) {
      this.pictures = this.pictures.concat(photos);
      // Обновление блока .preview-number-total.
      this._getPreviewNumberTotal().textContent = this.pictures.length.toString();
    },

    /**
     * Отдает массив фотографий.
     * @return {Array}
     */
    getPictures: function() {
      return this.pictures;
    },

    /**
     * Определяет номер текущей фотографии или видео в массиве
     * фотографий и видео, устанавливает ее номер и вызывает
     * отрисовку, если он корректен.
     * @param {number|string} currentPhoto
     */
    setCurrentPicture: function(currentPhoto) {
      var pictures = this.getPictures();

      // Если передана строка, то нужно найти фотографию или видео, соответствующие
      // этому адресу в массиве фотографий и видео.
      if (typeof currentPhoto === 'string') {

        for (var i = 0; i < pictures.length; i++) { // Вычисление соответствующего элемента массива.
          if (getRelativeUrl(pictures[i].getUrl()) === currentPhoto) {
            currentPhoto = i;
            break;
          }
        }

      }

      // Показываем фотографию, если она находится в массиве фотографий и видео,
      // иначе закрываем галерею.
      if (currentPhoto >= 0 && currentPhoto < pictures.length && typeof currentPhoto === 'number') {

        // Установка номера текущей фотографии.
        this._setCurrentImageNumber(currentPhoto);
        this._renderPicture(currentPhoto);

      } else {
        this.hide();
      }
    },

    /**
     * Берет фотографию из массива фотографий,
     * отрисовывает ее в галерее, обновляя .overlay-gallery:
     * добавляет фото в .overlay-gallery-preview, обновляет блок
     * .preview-number-current.
     * @param {number} currentPhoto
     * @private
     */
    _renderPicture: function(currentPhoto) {

      var container = this._getPhotoContainer();
      var pictures = this.getPictures();

      // Если текущая фотография является первой, показываем ее
      // и скрываем левый контрол.
      toggleClass(this._getPrevButton(), 'invisible', currentPhoto === 0);

      // Если текущая фотография является последней, показываем ее
      // и скрываем правый контрол.
      toggleClass(this._getNextButton(), 'invisible', currentPhoto === pictures.length - 1);

      // Добавление фотографии в контейнер.
      // Сначала удаляются предыдущие изображения/видео.
      Array.prototype.forEach.call(container.children, function(item) {
        if (item.tagName === 'VIDEO') {
          document.removeEventListener('click', this.togglePlayVideo);
        }
        if (item.tagName === 'VIDEO' || item.tagName === 'IMG') {
          container.removeChild(item);
        }
      }.bind(this));

      // Создаем фотографию или видео.
      if (pictures[currentPhoto] instanceof Video) {
        var video = document.createElement('video');
        var sourceMP4 = document.createElement('source');
        sourceMP4.type = 'video/mp4';
        sourceMP4.src = pictures[currentPhoto].getUrl();
        video.autoplay = true;
        video.loop = true;
        video.appendChild(sourceMP4);
        // По клике на видео оно будет останавливаться или запускаться.
        document.addEventListener('click', this.togglePlayVideo);
        container.appendChild(video);
      } else {
        var photo = new Image();
        photo.src = pictures[currentPhoto].getUrl();
        container.appendChild(photo);
      }

      // Обновление блока .preview-number-current.
      this._getPreviewNumberCurrent().textContent = (currentPhoto + 1).toString();

    },

    /**
     * Метод для переключения текущего состояния видео.
     * @param {MouseEvent} e
     */
    togglePlayVideo: function(e) {
      console.log(this);
      if (e.target.tagName === 'VIDEO') {
        return e.target.paused ? e.target.play() : e.target.pause();
      }
    },

    /**
     * Обработчик события hashchange, который будет показывать или
     * прятать галерею на определенной фотографии в зависимости от содержимого хэша.
     * @private
     */
    _onHashChange: function() {
      this.restoreFromHash();
    },

    /**
     * Показывает фотографию, если хэш в адресной строке соответствует адресу
     * из массива фотографий и видео, прячет галерею, если таких фотографий нет.
     */
    restoreFromHash: function() {
      var photo = location.hash.match(/#photo\/(\S+)/);
      if (photo) {
        photo = photo[1].indexOf('/') === 0 ? photo[1] : '/' + photo[1];
        this.show();
        this.setCurrentPicture(photo);
      } else {
        this.hide();
      }
    },

    /**
     * Изменение хэша у объекта location по номеру текущей фотографии
     * @param {number} currentPicture
     */
    changeLocationHash: function(currentPicture) {
      // Меняем hash в адресной строке на #photo/<путь к фотографии>.
      location.hash = 'photo' + getRelativeUrl(this.getPictures()[currentPicture].getUrl());
    }
  };

  return Gallery;

});


