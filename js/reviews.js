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
      element.className = !element.className.length ? className :
        element.className + ' ' + className;
    } else if (!action && element.className.indexOf(className) !== -1) {
      var classList = element.className.split(' ');
      classList.splice(classList.indexOf(className), 1);
      element.className = classList.join(' ');
    }
  }

  /**
   * Конструктор
   * @param {Element} filter список фильтров
   * @param {Element} container контейнер для размещения списка отзывов
   * @param {Element} template шаблон для отзыва
   * @param {Element} more кнопка для показа следующей страницы отзывов
   * @constructor
   */
  var ReviewsList = function(filter, container, template, more) {
    this.filter = {
      all: filter,
      active: 'reviews-all'
    };
    this.pages = {
      current: 0,
      PAGE_SIZE: 3
    };
    toggleClass(this.filter.all, 'invisible', true);
    this.container = container;
    this.template = template;
    this.more = more;
    this.filteredReviews = [];
    this.getReviewsByAJAX();
    this.showMoreReviews();
  };

  ReviewsList.prototype = {

    /**
     * Получение списка отзывов по AJAX
     */
    getReviewsByAJAX: function() {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/reviews.json');
      xhr.timeout = 15000;

      /**
       * Обработка списка отзывов в случае зависания сервера
       * К reviews добавляется класс review-load-failure
       */
      xhr.ontimeout = (function() {
        toggleClass(this.container, 'invisible', true);
        toggleClass(this.container.parentElement, 'reviews-list-loading');
        toggleClass(this.container.parentElement, 'review-load-failure', true);
      }).bind(this);

      // Пока длится загрузка файла, к reviews добавлятся класс
      // reviews-list-loading
      xhr.onreadystatechange = (function() {
        if (xhr.readyState < 4) {
          toggleClass(this.container, 'invisible', true);
          toggleClass(this.container.parentElement, 'reviews-list-loading', true);
        } else if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            toggleClass(this.container.parentElement, 'review-load-failure');
            toggleClass(this.container, 'invisible');
          }
          toggleClass(this.container.parentElement, 'reviews-list-loading');
        }
      }).bind(this);

      xhr.onerror = (function() {
        toggleClass(this.container.parentElement, 'reviews-list-loading');
        toggleClass(this.container, 'invisible', true);
        toggleClass(this.container.parentElement, 'review-load-failure', true);
      }).bind(this);

      xhr.onload = (function(e) {
        toggleClass(this.container, 'invisible');
        toggleClass(this.container.parentElement, 'reviews-list-loading');
        toggleClass(this.container.parentElement, 'review-load-failure');
        this.setReviews(JSON.parse(e.target.response));
      }).bind(this);

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
     * Получение текущей страницы
     */
    getCurrentPage: function() {
      return this.pages.current;
    },

    /**
     * Получение количества отзывов на странице
     */
    getPageSize: function() {
      return this.pages.PAGE_SIZE;
    },

    /**
     * Получение списка отфильтрованных отзывов
     */
    getFilteredReviews: function() {
      return this.filteredReviews;
    },

    /**
     * Установка списка отфильтрованных отзывов
     * @param {Array.<Object>} reviews
     */
    setFilteredReviews: function(reviews) {
      this.filteredReviews = reviews;
    },

    /**
     * Получение кнопки 'еще отзывы'
     */
    getMore: function() {
      return this.more;
    },

    /**
     * Установка обработчика событий по клику на кнопку 'еще отзывы'
     */
    showMoreReviews: function() {
      this.getMore().addEventListener('click', (function() {
        var currentPage = this.getCurrentPage();
        // Для отображения следующей порции отзывов нужно посмотреть, есть ли они
        // Страницы нумеруются с 0, поэтому вычитаем из потолка единицу
        if (currentPage < (Math.ceil(this.getFilteredReviews().length / this.getPageSize())) - 1) {
          this.setCurrentPage(currentPage + 1);
          this.templateAndAppend();
        }
      }).bind(this));
    },

    /**
     * Установка текущей страницы
     * @param {number} page
     */
    setCurrentPage: function(page) {
      this.pages.current = page;
    },

    /**
    * Установка обработчика событий по клику на список фильтров
     */
    setCurrentFilter: function() {
      this.getFilters().addEventListener('click', (function(e) {
        var clickedElement = e.target;
        if (clickedElement.className.indexOf('reviews-filter-item')) {
          this.setActiveFilter(clickedElement.id);
        }
      }).bind(this));
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
        case 'reviews-all':
        default:
          break;
      }
      this.setCurrentPage(0);
      this.setFilteredReviews(filteredReviews);
      this.templateAndAppend(true);
      this.filter.active = id;
    },

    /**
     * Создает список отзывов: изначально в DocumentFragment,
     * после этого в DOM.
     * @param {boolean=} replace При true очистка контейнера
     */
    templateAndAppend: function(replace) {
      var tempContainer = document.createDocumentFragment();
      if (replace) {
        this.container.innerHTML = '';
      }
      var PAGE_SIZE = this.getPageSize();
      var from = this.getCurrentPage() * PAGE_SIZE;
      var to = from + PAGE_SIZE;
      var reviews = this.getFilteredReviews().slice(from, to);
      var reviewTemplate;
      for (var i = 0; i < reviews.length; i++) {
        // Свойство 'content' у шаблонов не работает в IE, поскольку он
        // не поддерживает template. Поэтому для IE пишется альтернативный
        // вариант.
        // 'content' in template вернет true, если template является
        // объектом DocumentFragment, иначе шаблоны не поддерживаются, и это IE.
        reviewTemplate = 'content' in this.template ?
          this.template.content.children[0].cloneNode(true) :
          this.template.children[0].cloneNode(true);
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
    }
  };

  var reviewList = new ReviewsList(document.querySelector('.reviews-filter'),
  document.querySelector('.reviews-list'), document.querySelector('#review-template'),
  document.querySelector('.reviews-controls-more'));

  reviewList.setCurrentFilter();

})();
