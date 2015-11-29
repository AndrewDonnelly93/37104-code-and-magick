'use strict';

(function() {
  /**
   * Убирает класс или добавляет его
   * @param {Element} element
   * @param {string} className
   * @param {boolean=} action
   */
  function toggleClass(element, className, action) {
    if (action && element.className.indexOf(className) === -1) {
      element.className += ' ' + className;
    } else if (!action) {
      element.className =
        element.className.replace(new RegExp('\s*' + className + '\s*', 'g'), '');
    }
  }

  /**
   * Конструктор
   * @param {Element} filter список фильтров
   * @param {Element} container контейнер для размещения списка отзывов
   * @param {Element} template шаблон для отзыва
   * @constructor
   */
  var ReviewsList = function(filter, container, template) {
    this.filter = {
      all: filter,
      active: 'reviews-all'
    };
    // Прячет список фильтров при инициализации списка отзывов
    toggleClass(this.filter.all, 'invisible', true);
    this.container = container;
    this.template = template;
    this.getReviewsByAJAX();
  };

  ReviewsList.prototype = {

    /**
     * Получение списка отзывов по AJAX
     */
    getReviewsByAJAX: function() {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/reviews.json');
      var self = this;
      xhr.timeout = 15000;

      /**
       * Обработка списка отзывов в случае зависания сервера
       * К reviews добавляется класс review-load-failure
       */
      xhr.ontimeout = function() {
        toggleClass(self.container, 'invisible', true);
        toggleClass(self.container.parentElement, 'review-load-failure', true);
      };

      // Пока длится загрузка файла, к reviews добавлятся класс
      // reviews-list-loading
      xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
          toggleClass(self.container, 'invisible', true);
          toggleClass(self.container.parentElement, 'reviews-list-loading', true);
        } else if (xhr.readyState === 4 && xhr.status === 200) {
          toggleClass(self.container.parentElement, 'review-load-failure');
          toggleClass(self.container, 'invisible');
          toggleClass(self.container.parentElement, 'reviews-list-loading');
        }
      };

      xhr.onerror = function() {
        toggleClass(self.container, 'invisible', true);
        toggleClass(self.container.parentElement, 'review-load-failure', true);
      };

      xhr.onload = function(e) {
        toggleClass(self.container, 'invisible');
        toggleClass(self.container.parentElement, 'review-load-failure');
        self.setReviews(JSON.parse(e.target.response));
      };

      xhr.send();
    },

    /**
     * Получение списка фильтров
     */
    getFilters: function() {
      return this.filter.all;
    },

    /**
    * Получение активного фильтра
    */
    getActiveFilter: function() {
      return this.filter.active;
    },

    /**
    * Установка обработчика событий по клику на список фильтров
     */
    setCurrentFilter: function() {
      var self = this;
      this.getFilters().parentElement.addEventListener('click', function(e) {
        var clickedElement = e.target;
        if (clickedElement.className.indexOf('reviews-filter-item')) {
          self.setActiveFilter(clickedElement.id);
        }
      });
    },

    /**
     * Установка значения reviews у объекта, вызов рендеринга списка отзывов
     */
    setReviews: function(reviews) {
      this.reviews = reviews;
      this.setActiveFilter(this.filter.active, true);
    },

    /**
     * Получение списка отзывов
     */
    getReviews: function() {
      return this.reviews;
    },

    /**
     * Установка значения reviews у объекта, вызов рендеринга списка отзывов
     * @param {string} id - id текущего активного фильтр
     * @param {boolean=} force Флаг, при котором игнорируется проверка
     *     на повторное присвоение фильтра
     */
    setActiveFilter: function(id, force) {
      if ((this.getActiveFilter() === id) && !force) {
        return;
      }
      var filteredReviews = this.reviews.slice(0);
      switch (id) {
        case 'reviews-all':
          break;
        case 'reviews-recent':
          // Выборка отзывов за прошедшие полгода
          filteredReviews = filteredReviews.filter(function(review) {
            var currentDate = new Date();
            var reviewDate = Date.parse(review.date);
            var DAYS_TO_EXPIRE = 180;
            var dateToExpire = DAYS_TO_EXPIRE * 24 * 3600 * 1000;
            return (currentDate - reviewDate <= dateToExpire);
          });
          filteredReviews.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          break;
        case 'reviews-good':
          // Выборка отзывов с рейтингом не меньше 3
          // по убыванию рейтинга
          filteredReviews = filteredReviews.filter(function(review) {
            return (review.rating >= 3);
          });
          filteredReviews.sort(function(a, b) {
            return b.rating - a.rating;
          });
          break;
        case 'reviews-bad':
          // Выборка отзывов с рейтингом не выше 2,
          // отсортированные по возрастанию рейтинга
          filteredReviews = filteredReviews.filter(function(review) {
            return (review.rating <= 2);
          });
          filteredReviews.sort(function(a, b) {
            return a.rating - b.rating;
          });
          break;
        case 'reviews-popular':
          // Выборка, отсортированная по убыванию оценки отзыва (поле review-rating).
          filteredReviews.sort(function(a, b) {
            return b['review-rating'] - a['review-rating'];
          });
          break;
        default:
          break;
      }
      this.templateAndAppend(filteredReviews);
      this.filter.active = id;
    },

    /**
     * Создает список отзывов: изначально в DocumentFragment,
     * после этого в DOM.
     */
    templateAndAppend: function(filteredReviews) {
      var reviews = filteredReviews;
      var template = this.template;
      var tempContainer = document.createDocumentFragment();
      this.container.innerHTML = '';
      for (var i = 0; i < reviews.length; i++) {
        var reviewTemplate;
        // Свойство 'content' у шаблонов не работает в IE, поскольку он
        // не поддерживает template. Поэтому для IE пишется альтернативный
        // вариант.
        // 'content' in template вернет true, если template является
        // объектом DocumentFragment, иначе шаблоны не поддерживаются, и это IE.
        if ('content' in template) {
          reviewTemplate = template.content.children[0].cloneNode(true);
        } else {
          reviewTemplate = template.children[0].cloneNode(true);
        }
        // Добавление изображения
        var author = reviewTemplate.querySelector('.review-author');
        this.uploadImage(reviews[i].author.picture, author, reviews[i].author.name);
        // Добавление рейтинга
        for (var j = 0; j < reviews[i].rating; j++) {
          var star = document.createElement('span');
          toggleClass(star, 'review-rating', true);
          reviewTemplate.insertBefore(star, reviewTemplate.querySelector('.review-text'));
        }
        reviewTemplate.querySelector('.review-text').textContent = reviews[i].description;
        tempContainer.appendChild(reviewTemplate);
      }
      this.container.appendChild(tempContainer);
      // Показывает фильтры у отзывов после загрузки списка отзывов
      toggleClass(this.filter.all, 'invisible');
    },

    /**
     * Обработчик изображений
     * @param {string} imageSrc адрес фотографии автора отзыва
     * @param {Element} author шаблон отзыва
     * @param {string} authorName имя автора
     */
    uploadImage: function(imageSrc, author, authorName) {
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
        clearTimeout(imageLoadTimeout);
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
        clearTimeout(imageLoadTimeout);
        author.parentElement.querySelector('img').setAttribute('alt', authorName);
        author.parentElement.querySelector('img').setAttribute('title', authorName);
        authorImage.src = '';
        toggleClass(author.parentElement, 'review-load-failure', true);
      };

      authorImage.src = imageSrc;
    }
  };

  var reviewList = new ReviewsList(document.querySelector('.reviews-filter'),
  document.querySelector('.reviews-list'), document.querySelector('#review-template'));

  reviewList.setCurrentFilter();

})();
