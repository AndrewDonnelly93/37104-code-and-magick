'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  function checkRequiredField(element) {
    return element.value.length ? true : false;
  }

  /**
   * Конструктор объекта Form.
   * @param {Element} form
   * @param {Element} controlList
   * @param {Element} submit
   * @param {NodeList} radios
   * @param {Element} username
   * @param {Element} review
   * @constructor
   */
  var Form = function(form, controlList, submit, radios, username, review) {
    this.form = form;
    this.controlList = controlList;
    this.submit = submit;
    this.radios = radios;
    this.username = username;
    this.review = review;
  };

  Form.prototype = {

    /**
     * Получение формы
     * @return {Element} form
     */
    getForm: function() {
      return this.form;
    },

    /**
     * Получение submit
     * @return {Element} submit
     */
    getSubmit: function() {
      return this.submit;
    },

    /**
     * Получение radio кнопок
     * @return {NodeList} radios
     */
    getRadios: function() {
      return this.radios;
    },

    /**
     * Получение review
     * @return {Element} review
     */
    getReview: function() {
      return this.review;
    },

    /**
     * Получение элемента имени пользователя
     * @return {Element} username
     */
    getUsername: function() {
      return this.username;
    },

    /**
     * Проверка текущей оценки игры
     * @return {number} mark
     */
    getCurrentMark: function() {
      // Если оценка меньше 3, поле отзыва становится обязательным
      // Если оно не заполнено, то ставим disabled на submit
      var radios = this.getRadios();
      var getCurrentMark = function() {
        for (var i = 0; i < radios.length; i++) {
          if (radios[i].checked) {
            return radios[i].value;
          }
        }
        return 0;
      };
      var currentMark = getCurrentMark();
      var result = 0;
      switch (true) {
        case (currentMark === 0):
          // Оценка не поставлена, выводится сообщение о необходимости
          // проставления оценки
          this.createErrorNode('Поставьте оценку', radios[0]);
          this.getSubmit().setAttribute('disabled', '');
          break;
        case (currentMark < 3):
          // Удаление сообщения при непоставленной оценке
          this.removeErrorNode(radios[0]);
          // Поле 'отзыв' становится обязательным, если оно не заполнено,
          // ставится disabled на submit
          result = this.validReview(true);
          break;
        default:
          // Используется для удаления осталось заполнить - отзыв,
          // action - false, по умолчанию поле отзыв не обязательное
          this.validReview(false);
          // Если имя заполнено и оценка >= 3, то форму можно отправлять, удаляем disabled
          if (this.validUsername()) {
            this.getSubmit().removeAttribute('disabled');
          }
          // Удаляем ошибки от предыдуших вызовов, если они есть
          this.removeErrorNode(this.getReview());
          this.removeErrorNode(radios[0]);
          result = 1;
          break;
      }
      return result;
    },

    /**
     * Получение контролов 'осталось заполнить'
     * @return {Element} controlList
     */
    getControlList: function() {
      return this.controlList;
    },

    /**
     * Изменение значений элементов в 'осталось заполнить'
     * @param {string} currentField
     * @param {boolean} action
     * action - при true скрываем элемент, иначе отображаем
     */
    checkControlList: function(currentField, action) {
      var controlList = this.getControlList();
      /**
       * Получение текущего контрола
       * @return {NodeList} control
       */
      var getCurrentControl = function() {
        switch (currentField) {
          case 'username':
            return controlList.getElementsByClassName('review-fields-name')[0];
          case 'review':
            return controlList.getElementsByClassName('review-fields-text')[0];
          default:
            break;
        }
      };
      var currentControl = getCurrentControl();
      // Изменение статуса текущего элемента
      if (action) {
        currentControl.classList.add('hidden');
      } else {
        currentControl.classList.remove('hidden');
      }
      // Проверка, совпадает ли число скрытых элементов с дочерними элементами контрольного листа
      // Получение числа скрытых элементов
      var countHiddenElements = controlList.getElementsByClassName('hidden').length;
      // Получение общего количества контролов
      var countAllControls = controlList.getElementsByClassName('review-fields-label').length;
      // Если true, то форма заполнена, все контролы скрыты, можно удалить disabled
      // с сабмита
      var isSubmitEnabled = (countHiddenElements === countAllControls);
      if (isSubmitEnabled) {
        controlList.classList.add('hidden');
      } else {
        controlList.classList.remove('hidden');
      }
      // Удаление disabled из сабмита в случае заполнения формы
      if (isSubmitEnabled) {
        this.getSubmit().removeAttribute('disabled');
      }
    },

    /**
     * Вставка в DOM элемента с сообщением об ошибке
     * @param {string} errorMessage
     * @param {Element} currentField
     */

    createErrorNode: function(errorMessage, currentField) {
      var parent = currentField.parentElement;
      var children = parent.children;
      if (!parent.getElementsByClassName('form-error').length) {
        for (var i = 0; i < children.length; i++) {
          if (children[i].tagName === 'LABEL') {
            var error = document.createElement('span');
            error.className = 'review-form-label form-error';
            var node = document.createTextNode(errorMessage);
            error.appendChild(node);
            parent.insertBefore(error, children[i].nextSibling);
            break;
          }
        }
      }
    },

    /**
     * Удаление из DOM элемента с сообщением об ошибке
     * @param {Element} currentField
     */
    removeErrorNode: function(currentField) {
      var parent = currentField.parentElement;
      if (parent.getElementsByClassName('form-error').length) {
        parent.removeChild(parent.querySelector('.form-error'));
      }
    },

    /**
     * Валидация ввода имени пользователя в форму
     */
    validUsername: function() {
      var currentField = 'username';
      if (!checkRequiredField(this.getUsername())) {
        this.getSubmit().setAttribute('disabled', '');
         // Вывод 'осталось заполнить - имя',
         // если оно скрыто
        this.checkControlList(currentField, false);
         // Вывод сообщения с ошибкой
        this.createErrorNode('Введите имя пользователя!', this.getUsername());
        return false;
      } else {
        // Удаление 'осталось заполнить имя' (display: none)
        this.checkControlList(currentField, true);
        this.removeErrorNode(this.getUsername());
        return true;
      }
    },

    /**
     * Валидация ввода отзыва в форму
     * @param {boolean} action
     */
    validReview: function(action) {
      // action - нужно ли проверять на обязательность
      var currentField = 'review';
      if (!checkRequiredField(this.getReview())) {
        // Если поле обязательно, запрещаем сабмит, выводим ошибку
        if (action) {
          this.getSubmit().setAttribute('disabled', '');
          this.createErrorNode('Введите отзыв!', this.getReview());
        }
        // Вывод 'осталось заполнить - отзыв',
        // если оно скрыто
        this.checkControlList(currentField, false);
        return false;
      } else {
        // Удаление 'осталось заполнить отзыв' (display: none)
        this.checkControlList(currentField, true);
        this.removeErrorNode(this.getReview());
        return true;
      }
    }
  };

  var form = document.querySelector('.review-form');

  var controlList = document.querySelector('.review-fields');

  var submit = document.querySelector('.review-form-controls').getElementsByClassName('review-submit')[0];

  var radios = document.getElementsByName('review-mark');

  var username = document.getElementById('review-name');

  var review = document.getElementById('review-text');

  var reviewForm = new Form(form, controlList, submit, radios, username, review);

  reviewForm.getUsername().onchange = function() {
    // Имя не пустое
    reviewForm.validUsername(this);
  };

  reviewForm.getUsername().oninput = function() {
    // Имя не пустое
    reviewForm.validUsername(this);
  };

  reviewForm.getReview().onchange = function() {
    reviewForm.getCurrentMark();
  };

  reviewForm.getReview().oninput = function() {
    reviewForm.getCurrentMark();
  };

  var currentRadios = reviewForm.getRadios();
  for (var i = 0; i < currentRadios.length; i++) {
    currentRadios[i].onchange = function() {
      reviewForm.getCurrentMark();
    };
  }

  // На сабмит - проверка ввода имени пользователя
  // Проверка текущей оценки игры, при отсутствии заданной оценки просит задать
  reviewForm.form.onsubmit = function(e) {
    e.preventDefault();
    // Имя не пустое
    var validName = reviewForm.validUsername(username);
    // Оценка задана
    var validMarkAndReview = reviewForm.getCurrentMark();
    if (validName && validMarkAndReview) {
      // Валидация прошла успешно, форма отправляется на сервер
      this.submit();
    }
  };
})();
