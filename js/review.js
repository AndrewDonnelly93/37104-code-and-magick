/* exported ReviewData */

'use strict';

define([
  'toggle-class',
  'inherit'
], function(toggleClass, inherit) {

  /**
   * Конструктор данных отзыва.
   * @param {Object} review
   * @constructor
   */
  var ReviewData = function(review) {
    this.author = {
      name: review.author.name,
      picture: review.author.picture
    };
    this.date = review.date;
    this.reviewRating = review['review-rating'];
    this.rating = review.rating;
    this.description = review.description;
  };

  ReviewData.prototype = {

    /**
     * Возвращает имя автора отзыва.
     * @return {string}
     */
    getAuthorName: function() {
      return this.author.name;
    },

    /**
     * Устанавливает имя автора отзыва.
     * @param {string} name
     */
    setAuthorName: function(name) {
      this.author.name = name;
    },

    /**
     * Возвращает фотографию автора отзыва.
     * @return {string}
     */
    getAuthorPicture: function() {
      return this.author.picture;
    },

    /**
     * Устанавливает фотографию автора отзыва.
     * @param {string} picture
     */
    setAuthorPicture: function(picture) {
      this.author.picture = picture;
    },

    /**
     * Возвращает дату отзыва.
     * @return {string}
     */
    getDate: function() {
      return this.date;
    },

    /**
     * Устанавливает дату отзыва.
     * @param {string} date
     */
    setDate: function(date) {
      this.date = date;
    },

    /**
     * Возвращает рейтинг отзыва.
     * @return {number}
     */
    getReviewRating: function() {
      return this.reviewRating;
    },

    /**
     * Устанавливает рейтинг текущего отзыва.
     * @param {number} reviewRating
     */
    setReviewRating: function(reviewRating) {
      this.reviewRating = reviewRating;
    },

    /**
     * Получает количество звезд в текущем отзыве.
     * @return {number}
     */
    getRating: function() {
      return this.rating;
    },

    /**
     * Устанавливает количество звезд в текущем отзыве.
     * @param {number} rating
     */
    setRating: function(rating) {
      this.rating = rating;
    },

    /**
     * Получает описание отзыва.
     * @return {string} description
     */
    getDescription: function() {
      return this.description;
    },

    /**
     * Устанавливает описание отзыва.
     * @param {string} description
     */
    setDescription: function(description) {
      this.description = description;
    }
  };

  /**
   * Конструктор отзыва.
   * @param {ReviewData} reviewData
   * @extends {ReviewData}
   * @constructor
   */
  var Review = function(reviewData) {
    ReviewData.call(this, reviewData);
    this._uploadImage = this._uploadImage.bind(this);
    this.setPositiveReviewButton = this.setPositiveReviewButton.bind(this);
    this.setNegativeReviewButton = this.setNegativeReviewButton.bind(this);
    this.reviewButtons = {};
    this.getReviewButtons = this.getReviewButtons.bind(this);
    this.onPositiveReviewClick = this.onPositiveReviewClick.bind(this);
    this.onNegativeReviewClick = this.onNegativeReviewClick.bind(this);
    this.remove = this.remove.bind(this);
  };

  inherit(Review, ReviewData);

  Review.prototype._template = document.querySelector('#review-template');

  /**
   * Получение шаблона с разметкой отзыва.
   * @return {Element}
   */
  Review.prototype._getTemplate = function() {
    return this._template;
  };

  /**
   * Получение одного отзыва.
   * @return {Element}
   */
  Review.prototype.getElement = function() {
    return this.element;
  };

  /**
   * Получение одного отзыва.
   * @param {Object} element
   * @return {Object}
   * @private
   */
  Review.prototype._setElement = function(element) {
    this.element = element;
  };

  // Создание элемента отзыва из шаблона.
  Review.prototype.render = function() {
    var template = this._getTemplate();
    var reviewTemplate = 'content' in template
      ? template.content.children[0].cloneNode(true)
      : template.children[0].cloneNode(true);

    // Добавление изображения.
    var author = reviewTemplate.querySelector('.review-author');
    this._uploadImage(author);

    // Установка кнопок полезный отзыв - да и нет.
    this.setPositiveReviewButton(reviewTemplate.querySelector('.review-quiz-answer-yes'));
    this.setNegativeReviewButton(reviewTemplate.querySelector('.review-quiz-answer-no'));

    // Установка обработчиков событий на нажатия кнопок полезный отзыв.
    this.getPositiveReviewButton().addEventListener('click', this.onPositiveReviewClick);
    this.getNegativeReviewButton().addEventListener('click', this.onNegativeReviewClick);

    // Добавление рейтинга.
    for (var j = 0; j < this.getRating(); j++) {
      var star = document.createElement('span');
      toggleClass(star, 'review-rating', true);
      reviewTemplate.insertBefore(star, reviewTemplate.querySelector('.review-text'));
    }

    reviewTemplate.querySelector('.review-text').textContent = this.getDescription();
    this._setElement(reviewTemplate);
  };

  /**
   * Обработчик изображений.
   * @param {Element} author шаблон отзыва
   */
  Review.prototype._uploadImage = function(author) {
    var authorName = this.getAuthorName();
    var imageSrc = this.getAuthorPicture();
    var IMAGE_SIZE = 124;
    var authorImage = new Image();
    var IMAGE_TIMEOUT = 10000;

    // Обработка изображения в случае зависания сервера.
    var imageLoadTimeout = setTimeout(function() {
      authorImage.src = '';
      toggleClass(author.parentElement, 'review-load-failure', true);
    }, IMAGE_TIMEOUT);

    // Обработка изображения в случае успешной загрузки.
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

    // Обработка изображения в случае ошибки при загрузке.
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
  };

  /**
   * Установка кнопки 'полезный отзыв' - да.
   * @param {Element} button
   */
  Review.prototype.setPositiveReviewButton = function(button) {
    this.reviewButtons.positiveReviewButton = button;
  };

  /**
   * Возврат кнопки 'полезный отзыв' - да.
   * @return {HTMLElement}
   */
  Review.prototype.getPositiveReviewButton = function() {
    return this.reviewButtons.positiveReviewButton;
  };

  /**
   * Установка кнопки 'полезный отзыв' - нет.
   * @param {Element} button
   */
  Review.prototype.setNegativeReviewButton = function(button) {
    this.reviewButtons.negativeReviewButton = button;
  };

  /**
   * Кнопки 'полезный отзыв' - да и нет.
   * @return {Object}
   */
  Review.prototype.getReviewButtons = function() {
    return this.reviewButtons;
  };

  /**
   * Возврат кнопки 'полезный отзыв' - нет.
   * @return {HTMLElement}
   */
  Review.prototype.getNegativeReviewButton = function() {
    return this.reviewButtons.negativeReviewButton;
  };

  Review.prototype.onPositiveReviewClick = function() {
    // Если кнопка уже была нажата.
    if (this.getPositiveReviewButton().className.indexOf('review-quiz-answer-active') !== -1) {
      return;
    }
    this.setReviewRating(this.getReviewRating() + 1);

    // Удаляем активный класс с кнопки полезный отзыв - нет.
    toggleClass(this.getNegativeReviewButton(), 'review-quiz-answer-active', false);
    toggleClass(this.getPositiveReviewButton(), 'review-quiz-answer-active', true);
  };

  Review.prototype.onNegativeReviewClick = function() {
    // Если кнопка уже была нажата.
    if (this.getNegativeReviewButton().className.indexOf('review-quiz-answer-active') !== -1) {
      return;
    }
    this.setReviewRating(this.getReviewRating() - 1);

    // Удаляем активный класс с кнопки полезный отзыв - да.
    toggleClass(this.getPositiveReviewButton(), 'review-quiz-answer-active', false);
    toggleClass(this.getNegativeReviewButton(), 'review-quiz-answer-active', true);
  };

  // Удаление обработчиков событий с кнопок 'полезный отзыв'.
  Review.prototype.remove = function() {
    this.getPositiveReviewButton().removeEventListener('click', this.onPositiveReviewClick);
    this.getNegativeReviewButton().removeEventListener('click', this.onNegativeReviewClick);
  };

  return Review;

});

