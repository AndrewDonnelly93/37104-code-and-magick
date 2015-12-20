'use strict';

requirejs.config({ //eslint-disable-line no-undef
  baseUrl: 'js'
});

define([ //eslint-disable-line no-undef
  'review',
  'toggle-class',
  'game',
  'form',
  'photos'
], function(Review, toggleClass) {

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
      active: localStorage.getItem('activeFilter') || 'reviews-all'
    };
    this.pages = {
      current: 0,
      PAGE_SIZE: 3
    };
    toggleClass(this.getFilters(), 'invisible', true);
    this.container = container;
    this.more = more;
    this.filteredReviews = [];
    // Отрисованные отзывы
    this.renderedReviews = [];
    this.getReviewsByAJAX();
    this.showMoreReviews();
    this._xhrError = this._xhrError.bind(this);
    this._xhrSuccess = this._xhrSuccess.bind(this);
  };

  ReviewsList.prototype = {

    /**
     * Устанавливает отрисованные отзывы
     * @param {Array.<Review>} reviews
     */
    setRenderedReviews: function(reviews) {
      this.renderedReviews = reviews;
    },

    /**
     * Возвращает отрисованные отзывы
     * @return {Array.<Review>}
     */
    getRenderedReviews: function() {
      return this.renderedReviews;
    },

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
      xhr.ontimeout = (function() {
        this._xhrError();
      }).bind(this);

      /**
       * Пока длится загрузка файла, к reviews добавлятся класс
       * reviews-list-loading
       */
      xhr.onreadystatechange = (function() {
        if (xhr.readyState < 4) {
          toggleClass(container, 'invisible', true);
          toggleClass(container.parentElement, 'reviews-list-loading', true);
        } else if (xhr.readyState === 4) {
          return xhr.status === 200 ?
            this._xhrSuccess() : toggleClass(container.parentElement, 'reviews-list-loading');
        }
      }).bind(this);

      /**
       * При ошибке в процессе загрузки отзыву добавляется класс
       * review-load-failure
       */
      xhr.onerror = (function() {
        this._xhrError();
      }).bind(this);

      /**
       * После загрузки данных по AJAX список отзывов записывается
       * в прототип ReviewsList
       * @type {function(this:ReviewsList)}
       */
      xhr.onload = (function(e) {
        this._xhrSuccess();
        this.setReviews(JSON.parse(e.target.response));
      }).bind(this);

      xhr.send();
    },


    /**
     * Обработка данных при ошибочном выполнении XHR
     * @private
     */
    _xhrError: function() {
      var container = this.getContainer();
      toggleClass(container.parentElement, 'reviews-list-loading');
      toggleClass(container, 'invisible', true);
      toggleClass(container.parentElement, 'review-load-failure', true);
    },

    /**
     * Обработка данных при успешном выполнении XHR
     * @private
     */
    _xhrSuccess: function() {
      var container = this.getContainer();
      toggleClass(container, 'invisible');
      toggleClass(container.parentElement, 'reviews-list-loading');
      toggleClass(container.parentElement, 'review-load-failure');
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
      var getMoreBtn = this.getMore();

      getMoreBtn.addEventListener('click', (function() {
        var currentPage = this.getCurrentPage();
        // Для отображения следующей порции отзывов нужно посмотреть, есть ли они
        // Страницы нумеруются с 0, поэтому вычитаем из потолка единицу
        var pageCount = (Math.ceil(this.getFilteredReviews().length / this.getPageSize())) - 1;

        if (currentPage < pageCount) {
          // Предпоследняя страница
          if (currentPage === (pageCount - 1)) {
            toggleClass(getMoreBtn, 'invisible', true);
          } else {
            toggleClass(getMoreBtn, 'invisible', false);
          }
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
      this.reviews = reviews.map(function(review) {
        return new Review(review);
      });
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
      if (this.getActiveFilter() === id && !force) {
        return;
      }

      var filteredReviews = this.getReviews().slice(0);
      switch (id) {
        case 'reviews-recent':
          // Выборка отзывов за прошедшие полгода
          var currentDate = new Date();
          var DAYS_TO_EXPIRE = 180;
          var dateToExpire = DAYS_TO_EXPIRE * 24 * 3600 * 1000;
          filteredReviews = filteredReviews.filter(function(review) {
            return (currentDate - Date.parse(review.getDate()) <= dateToExpire);
          });
          filteredReviews.sort(function(a, b) {
            return new Date(b.getDate()) - new Date(a.getDate());
          });
          break;
        case 'reviews-good':
          // Выборка отзывов с рейтингом не меньше 3
          // по убыванию рейтинга
          filteredReviews = filteredReviews.filter(function(review) {
            return review.getRating() >= 3;
          });
          filteredReviews.sort(function(a, b) {
            return b.getRating() - a.getRating();
          });
          break;
        case 'reviews-bad':
          // Выборка отзывов с рейтингом не выше 2,
          // отсортированные по возрастанию рейтинга
          filteredReviews = filteredReviews.filter(function(review) {
            return review.getRating() <= 2;
          });
          filteredReviews.sort(function(a, b) {
            return a.getRating() - b.getRating();
          });
          break;
        case 'reviews-popular':
          // Выборка, отсортированная по убыванию оценки отзыва (поле review-rating).
          filteredReviews.sort(function(a, b) {
            return b.getReviewRating() - a.getReviewRating();
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
      document.querySelector('#' + id).checked = true;
      // Установка активного фильтра в localStorage
      localStorage.setItem('activeFilter', id);
    },

    /**
     * Создает список отзывов: изначально в DocumentFragment,
     * после этого в DOM.
     * @param {boolean=} replace При true очистка контейнера
     */
    renderReviews: function(replace) {
      var renderedReviews = this.getRenderedReviews();
      var tempContainer = document.createDocumentFragment();
      var container = this.getContainer();
      // Очищение списка отзывов в контейнере
      if (replace) {
        // Больше не работаем с DOM-элементом компоненты
        toggleClass(this.getMore(), 'invisible', false);
        var el;
        // Удаляем отрисованные элементы из массива renderedReviews
        // и из DOM
        while ((el = renderedReviews.shift())) { //eslint-disable-line no-cond-assign
          container.removeChild(el.getElement());
          el.remove();
        }
      }
      var PAGE_SIZE = this.getPageSize();
      var from = this.getCurrentPage() * PAGE_SIZE;
      var to = from + PAGE_SIZE;
      var reviews = this.getFilteredReviews().slice(from, to);
      this.setRenderedReviews(renderedReviews.concat(
        reviews.map(function(review) {
          var reviewElement = new Review(review);
          reviewElement.render();
          tempContainer.appendChild(reviewElement.getElement());
          return reviewElement;
        })
      ));
      container.appendChild(tempContainer);
      // Показывает фильтры у отзывов после загрузки списка отзывов
      toggleClass(this.getFilters(), 'invisible');
    }

  };

  /**
   * Создание нового объекта - списка отзывов
   * @type {ReviewsList}
   */
  var reviewList = new ReviewsList(document.querySelector('.reviews-filter'),
  document.querySelector('.reviews-list'), document.querySelector('.reviews-controls-more'));

  reviewList.setCurrentFilter();

});
