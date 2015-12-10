/* global toggleClass: true */

'use strict';

(function() {

  /**
   * Создает объект типа 'Галерея'
   * @constructor
   */
  function Gallery() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._prevButton = document.querySelector('.overlay-gallery-control-left');
    this._nextButton = document.querySelector('.overlay-gallery-control-right');
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
      this._getCloseButton().addEventListener('click', this._onCloseClick);
      // Установка слушатели событий на клики по контролам
      this._getPrevButton().addEventListener('click', this._pressPrevButton);
      this._getNextButton().addEventListener('click', this._pressNextButton);
      // Закрываем галерею по клику на esc
      window.addEventListener('keydown', this._onDocumentKeyDown());
    },

    /**
     * Прячет галерею
     */
    hide: function() {
      toggleClass(this.getElement(), 'invisible', true);
      // Удаление слушателя событий с крестика
      this._getCloseButton().removeEventListener('click', this._onCloseClick);
      // Удаление слушателей событий кликов по контролам
      this._getPrevButton().addEventListener('click', this._pressPrevButton);
      this._getNextButton().addEventListener('click', this._pressNextButton);
    },

    /**
     * Обработчик события клика на крестике
     * @private
     */
    _onCloseClick: function() {
      this.hide();
    },

    /**
     * Закрывает галерею по клику на esc
     * @private
     */
    _onDocumentKeyDown: (function(e) {
      if (e.keyCode === 27) {
        this.hide();
      }
    }).bind(this),

    /**
     * Обработчик нажатия на контрол для перемещения влево
     * @private
     */
    _pressPrevButton: function() {

    },

    /**
     * Обработчик нажатия на контрол для перемещения вправо
     * @private
     */
    _pressNextButton: function() {

    }
  };

  window.Gallery = Gallery;

})();


