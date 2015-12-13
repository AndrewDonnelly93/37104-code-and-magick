/* global toggleClass: true */

'use strict';

(function () {

  /**
   * Создает объект типа 'Галерея'
   * @constructor
   */
  function Gallery() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._prevButton = document.querySelector('.overlay-gallery-control-left');
    this._nextButton = document.querySelector('.overlay-gallery-control-right');
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._pressPrevButton = this._pressPrevButton.bind(this);
    this._pressNextButton = this._pressNextButton.bind(this);
  }

  Gallery.prototype = {

    /**
     * Отдает оверлей галереи
     * @return {Element}
     */
    getElement: function() {
      return this.element;
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
      this._getPrevButton().addEventListener('click', this._pressPrevButton);
      this._getNextButton().addEventListener('click', this._pressNextButton);
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
      if (e.keyCode === 27) {
        this.hide();
      }
    },

    /**
     * Проверка, находится ли элемент, на котором произошло событие,
     * в контейнере
     * @param container
     * @param element
     */
    contains: function(container, element) {
      if (container == element) {
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
    _pressPrevButton: function () {

    },

    /**
     * Обработчик нажатия на контрол для перемещения вправо
     * @private
     */
    _pressNextButton: function () {

    }
  };

  window.Gallery = Gallery;

})();


