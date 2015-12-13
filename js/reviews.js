/* global Review: true, Gallery: true */

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
   * @param {Element} more кнопка для показа следующей страницы отзывов
   * @constructor
   */
  var ReviewsList = function(filter, container, more) {
    this.filter = {
      all: filter,
      active: 'reviews-all'
    };
    this.pages = {
      current: 0,
      PAGE_SIZE: 3
    };
    toggleClass(this.getFilters(), 'invisible', true);
    this.container = container;
    this.more = more;
    this.filteredReviews = [];
    this.getReviewsByAJAX();
    this.showMoreReviews();
  };

  ReviewsList.prototype = {

    /**
     * Получение контейнера
     */
    getContainer: function() {
      return this.container;
    },

    /**
     * Получение списка отзывов по AJAX
     */
    getReviewsByAJAX: function() {

      var container = this.getContainer();
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/reviews.json');
      xhr.timeout = 15000;

      /**
       * Обработка списка отзывов в случае зависания сервера
       * К reviews добавляется класс review-load-failure
       */
      xhr.ontimeout = function() {
        toggleClass(container, 'invisible', true);
        toggleClass(container.parentElement, 'reviews-list-loading');
        toggleClass(container.parentElement, 'review-load-failure', true);
      };

      // Пока длится загрузка файла, к reviews добавлятся класс
      // reviews-list-loading
      xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
          toggleClass(container, 'invisible', true);
          toggleClass(container.parentElement, 'reviews-list-loading', true);
        } else if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            toggleClass(container.parentElement, 'review-load-failure');
            toggleClass(container, 'invisible');
          }
          toggleClass(container.parentElement, 'reviews-list-loading');
        }
      };

      xhr.onerror = function() {
        toggleClass(container.parentElement, 'reviews-list-loading');
        toggleClass(container, 'invisible', true);
        toggleClass(container.parentElement, 'review-load-failure', true);
      };

      xhr.onload = (function(e) {
        toggleClass(container, 'invisible');
        toggleClass(container.parentElement, 'reviews-list-loading');
        toggleClass(container.parentElement, 'review-load-failure');
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
     * Установка активного фильтра
     * @param {Element} filter
     */
    setActiveFilter: function(filter) {
      this.filter.active = filter;
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
          this.renderReviews();
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
          this.filterReviews(clickedElement.id);
        }
      }).bind(this));
    },

    /**
     * Установка значения reviews у объекта, вызов рендеринга списка отзывов
     */
    setReviews: function(reviews) {
      this.reviews = reviews;
      this.filterReviews(this.getActiveFilter(), true);
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
    filterReviews: function(id, force) {
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
      this.renderReviews(true);
      this.setActiveFilter(id);
    },

    /**
     * Создает список отзывов: изначально в DocumentFragment,
     * после этого в DOM.
     * @param {boolean=} replace При true очистка контейнера
     */
    renderReviews: function(replace) {
      var tempContainer = document.createDocumentFragment();
      var container = this.getContainer();
      // Очищение списка отзывов в контейнере
      if (replace) {
        Array.prototype.forEach.call(container.querySelectorAll('.review'), function(review) {
          container.removeChild(review);
        });
      }
      var PAGE_SIZE = this.getPageSize();
      var from = this.getCurrentPage() * PAGE_SIZE;
      var to = from + PAGE_SIZE;
      var reviews = this.getFilteredReviews().slice(from, to);
      for (var i = 0; i < reviews.length; i++) {
        var review = new Review(reviews[i]);
        review.render();
        tempContainer.appendChild(review.getElement());
      }
      container.appendChild(tempContainer);
      // Показывает фильтры у отзывов после загрузки списка отзывов
      toggleClass(this.getFilters(), 'invisible');
    }

  };

  var reviewList = new ReviewsList(document.querySelector('.reviews-filter'),
  document.querySelector('.reviews-list'), document.querySelector('.reviews-controls-more'));

  reviewList.setCurrentFilter();

  /**
   * Создание текущей галереи
   * @type {Gallery}
   */
  var gallery = new Gallery();

  var galleryImages = document.querySelectorAll('.photogallery img');

  Array.prototype.forEach.call(galleryImages, function(image) {
    image.addEventListener('click', function(e) {
      e.stopPropagation();
      gallery.show();
    })
  });

  window.toggleClass = toggleClass;
})();
