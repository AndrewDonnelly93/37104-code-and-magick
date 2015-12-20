/* global toggleClass: true */

'use strict';

(function() {
  /**
   * Конструктор отзыва
   * @param data
   * @constructor
   */
  var Review = function(data) {
    this._data = data;
  };

  Review.prototype = {

    _template: document.querySelector('#review-template'),

    /**
     * Получение шаблона с разметкой отзыва
     * @returns {Element}
     */
    _getTemplate: function() {
      return this._template;
    },

    /**
     * Получение данных отзыва
     * @returns {Object}
     */
    _getData: function() {
      return this._data;
    },

    /**
     * Получение одного отзыва
     * @returns {Element}
     */
    getElement: function() {
      return this.element;
    },

    /**
     * Получение одного отзыва
     * @param {Object} element
     * @returns {Object}
     * @private
     */
    _setElement: function(element) {
      this.element = element;
    },

    /**
     * Создание элемента отзыва из шаблона
     */
    render: function() {
      var template = this._getTemplate();
      var data = this._getData();
      var reviewTemplate = 'content' in template ?
        template.content.children[0].cloneNode(true) :
        template.children[0].cloneNode(true);
      // Добавление изображения
      var author = reviewTemplate.querySelector('.review-author');
      this._uploadImage(data.author.picture, author, data.author.name);
      // Добавление рейтинга
      for (var j = 0; j < data.rating; j++) {
        var star = document.createElement('span');
        toggleClass(star, 'review-rating', true);
        reviewTemplate.insertBefore(star, reviewTemplate.querySelector('.review-text'));
      }
      reviewTemplate.querySelector('.review-text').textContent = data.description;
      this._setElement(reviewTemplate);
    },

    /**
     * Обработчик изображений
     * @param {string} imageSrc адрес фотографии автора отзыва
     * @param {Element} author шаблон отзыва
     * @param {string} authorName имя автора
     */
    _uploadImage: function(imageSrc, author, authorName) {
      var IMAGE_SIZE = 124;
      var authorImage = new Image();
      var IMAGE_TIMEOUT = 10000;

      /**
       * Обработка изображения в случае зависания сервера
       */
      var imageLoadTimeout = setTimeout(function() {
        authorImage.src = '';
        toggleClass(author.parentElement, 'review-load-failure', true);
      }, IMAGE_TIMEOUT);

      /**
       * Обработка изображения в случае успешной загрузки
       */
      authorImage.onload = function() {
        if (imageLoadTimeout) {
          clearTimeout(imageLoadTimeout);
        }
        authorImage.width = IMAGE_SIZE;
        authorImage.height = IMAGE_SIZE;
        toggleClass(authorImage, 'review-author', true);
        authorImage.setAttribute('alt', authorName);
        authorImage.setAttribute('title', authorName);
        author.parentElement.replaceChild(authorImage, author.parentElement.querySelector('img'));
      };

      /**
       * Обработка изображения в случае ошибки при загрузке
       */
      authorImage.onerror = function() {
        if (imageLoadTimeout) {
          clearTimeout(imageLoadTimeout);
        }
        author.parentElement.querySelector('img').setAttribute('alt', authorName);
        author.parentElement.querySelector('img').setAttribute('title', authorName);
        authorImage.src = '';
        toggleClass(author.parentElement, 'review-load-failure', true);
      };

      authorImage.src = imageSrc;
    },

    /**
     * Получение данных из отзыва
     * @returns {Object}
     */
    getData: function() {
      return this._data;
    }
  };

  window.Review = Review;
})();

