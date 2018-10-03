// модуль для работы с картой

'use strict';

(function () {
  // главная метка
  var mainPin = document.querySelector('.map__pin--main');

  // блок для вставки сообщений
  var main = document.querySelector('main');

  // начальное положение главной метки- константа для инициализации X
  var MAIN_PIN_INIT_LEFT = parseInt(mainPin.style.left, 10);

  // начальное положение главной метки- константа для инициализации Y
  var MAIN_PIN_INIT_TOP = parseInt(mainPin.style.top, 10);

  // ограничения
  var MAP_MIN_LEFT = 0;
  var MAP_MAX_LENGTH = 1199;
  var MAP_MIN_TOP = 130;
  var MAP_MAX_HEIGHT = 630;

  // переменная для хранения левого верхнего угла главной метки - left
  var mainPinLeft;
  // переменная для хранения левого верхнего угла главной метки - top
  var mainPinTop;
  // ширина главной метки (беру по размеру из панели дебагера)
  var mainPinWidth = 65;
  // высота главной метки (беру по размеру из панели дебагера)
  var mainPinHeight = 65;
  // координата X середины главной метки
  var mainPinMiddleX;
  // координата Y середины главной метки
  var mainPinMiddleY;
  // хвост метки (беру по размеру из панели дебагера)
  var mainPinTail = 20; // весь квадрат = 65, image = 62, хвост идет от image и длина = 22. Округлил до 2 (65 - 62 / 2 = 1,5) и тогда хвост выходит за рамку 22-2=20. Как-так...
  // метка с хвостом
  var mainPinFullHeight = mainPinHeight + mainPinTail;

  // ключ на блокировку отрисовки пинов из moseup
  var isMouseUp = false;

  // отрисовка меток похожих объявлений
  function showAdsData(filter) {
    // 1. Создадим DOM элементы меток
    var pinContainer = window.pin.createPins(window.data.getAds(filter));

    // 2. Отрисуем сгенерированные DOM-элементы в блок .map__pins
    // 2.1. Чистка блока от старых пинов
    window.pin.removeAllPins();

    // 2.2. Добавляем в блок
    document.querySelector('.map__pins').appendChild(pinContainer);
  }

  // показ похожих объявлений
  function showSimilarAds() {
    window.backend.loadData(cbSuccessLoadAds, cbErrorLoadAds);
  }

  // callback на загрузку данных
  function cbSuccessLoadAds(data) {
    // заполним масив объявлений данными с сервера
    window.data.initRealAds(data);

    // покажем
    showAdsData();

  }

  // callback на ошибку при загрузке данных с сервера
  function cbErrorLoadAds(mes) {
    // покажем ошибку
    var errElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    errElement.classList.add('error_on_load');
    errElement.querySelector('.error__message').textContent = mes;

    // блок для вставки
    main = document.querySelector('main');
    main.appendChild(errElement);

    // обработка закрытия сообщения об ошибке
    function closeErrWindow() {

      // уберем сообщение об ошибке
      var err = main.querySelector('.error_on_load');

      if (err) {
        err.remove();
      }

      // вернем страницу в изначальное положение
      processResetButtonClick();

      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);

    }

    function onClick() {
      closeErrWindow();
    }

    function onKeyDown(evt) {
      if (evt.keyCode === window.utils.KEY_ESCAPE) {
        closeErrWindow();
      }
    }


    // кнопка
    var errBtn = errElement.querySelector('.error__button');
    errBtn.textContent = 'Закрыть';

    errBtn.addEventListener('click', function () {
      closeErrWindow();
    });

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);

  }

  // callback на сохранение данных
  function cbSuccessSaveAds() {

    // вернем страницу в изначальное положение
    processResetButtonClick();

    // покажем сообщение об успешном размещении объявления
    var successElement = document.querySelector('#success').content.querySelector('.success').cloneNode(true);

    // блок для вставки
    main = document.querySelector('main');
    main.appendChild(successElement);

    // обработка закрытия сообщения об успешном сохранении данных
    function closeSuccessWindow() {

      // уберем сообщение об ошибке
      var success = main.querySelector('.success');

      if (success) {
        success.remove();
      }

      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    }

    function onClick() {
      closeSuccessWindow();
    }

    function onKeyDown(evt) {
      if (evt.keyCode === window.utils.KEY_ESCAPE) {
        closeSuccessWindow();
      }
    }

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);

  }

  // callback на ошибку при загрузке данных с сервера
  function cbErrorSaveAds(mes) {
    // покажем ошибку
    var errElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    errElement.classList.add('error_on_save');
    errElement.querySelector('.error__message').textContent = mes;

    // блок для вставки
    main = document.querySelector('main');
    main.appendChild(errElement);

    // обработка закрытия сообщения об ошибке
    function closeErrWindow() {

      // уберем сообщение об ошибке
      var err = main.querySelector('.error_on_save');

      if (err) {
        err.remove();
      }

      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);

    }

    function onClick() {
      closeErrWindow();
    }

    function onKeyDown(evt) {
      if (evt.keyCode === window.utils.KEY_ESCAPE) {
        closeErrWindow();
      }
    }

    // кнопка
    var errBtn = errElement.querySelector('.error__button');
    errBtn.addEventListener('click', function () {
      closeErrWindow();
    });

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);

  }

  // ф-ия блокирует/разблокирует карту
  function toggleMapAbility(isNotFaded) {
    var map = document.querySelector('.map');
    if (isNotFaded) {
      map.classList.remove('map--faded');
    } else {
      map.classList.add('map--faded');
    }

  }

  // главная ф-ия переключения активности формы и карты
  function toggleMainFormActivity(isActive) {
    window.form.toggleAdFormAbility(isActive);
    window.filter.toggleFilterFormAbility(isActive);
    toggleMapAbility(isActive);
  }

  // установка значения адреса (острый конец метки)
  function setAddress(mainPinNewLeft, mainPinNewRight) {

    // координаты хвоста относительно верхнего левого угла
    var tailX = mainPinNewLeft + Math.round(mainPinWidth / 2);
    var tailY = mainPinNewRight + mainPinFullHeight;

    window.form.getAddressStr(tailX, tailY);
  }

  function setFormActive() {
    if (window.form.adForm.classList.contains('ad-form--disabled')) {
      // лишний раз не вызываем
      toggleMainFormActivity(true);
    }

  }

  // отрисовка нового положения метки
  function setMainPinPos(xPos, yPos) {
    mainPin.style.left = xPos + 'px';
    mainPin.style.top = yPos + 'px';
  }

  // событие mousedown на главной метке
  function onMainPinMouseDown(evt) {
    evt.preventDefault();

    // запомнили координаты курсора в момент нажатия
    var startPos = {
      x: evt.clientX,
      y: evt.clientY
    };

    // верхний левый угол метки
    var newConerPos = {
      x: mainPinLeft,
      y: mainPinTop
    };

    // обработка движения мыши
    function onMouseMove(evtMove) {
      evtMove.preventDefault();

      // перемещение
      var shiftPos = {
        x: startPos.x - evtMove.clientX,
        y: startPos.y - evtMove.clientY
      };

      // новые координаты курсора
      startPos.x = evtMove.clientX;
      startPos.y = evtMove.clientY;

      // Новые координаты верхнего левого угла метки, именно на них поставил ограничение
      // x
      var shiftLeft = (mainPin.offsetLeft - shiftPos.x);
      shiftLeft = shiftLeft >= MAP_MIN_LEFT - Math.round(mainPinWidth / 2) ? shiftLeft : MAP_MIN_LEFT - Math.round(mainPinWidth / 2);
      shiftLeft = shiftLeft + Math.round(mainPinWidth / 2) <= MAP_MAX_LENGTH ? shiftLeft : MAP_MAX_LENGTH - Math.round(mainPinWidth / 2);
      // y
      var shifTop = (mainPin.offsetTop - shiftPos.y);
      shifTop = shifTop >= MAP_MIN_TOP ? shifTop : MAP_MIN_TOP;
      shifTop = shifTop <= MAP_MAX_HEIGHT ? shifTop : MAP_MAX_HEIGHT;

      newConerPos = {
        x: shiftLeft,
        y: shifTop
      };

      // отрисовка нового положения метки
      setMainPinPos(newConerPos.x, newConerPos.y);

      // активация карты. ТЗ: первое перемещение метки переводит страницу в активное состояние.
      // уберем дрожание мыши иил тачпада
      if (Math.abs(shiftPos.x) >= 1 | Math.abs(shiftPos.y >= 1)) {
        setFormActive();
      }

      // адрес
      setAddress(newConerPos.x, newConerPos.y);

    }

    // событие mouseup
    function onMouseUp(evtUp) {
      evtUp.preventDefault();

      // активируем форму
      setFormActive();

      // покажем похожие метки - один раз
      if (!isMouseUp) {
        window.card.removeOldAds();
        showSimilarAds();
        isMouseUp = !isMouseUp;
      }

      // адрес
      setAddress(newConerPos.x, newConerPos.y);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  }

  function onButtonResetClick() {
    processResetButtonClick();
  }

  // обработка reset
  function processResetButtonClick() {
    // уберем похожие объявления
    window.card.removeOldAds();

    // очистим пины
    window.pin.removeAllPins();

    // уберем событие на кнопке reset, так как оно инициализируется в initMap
    document.querySelector('.ad-form__reset').removeEventListener('click', onButtonResetClick);

    // форма
    window.form.adForm.removeEventListener('submit', onFormSubmit);

    // инициализируем
    initMap();

  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    window.backend.saveData(new FormData(window.form.adForm), cbSuccessSaveAds, cbErrorSaveAds);

  }

  function cbFilterEvent(data) {
    showAdsData(data);
  }

  // инициализация
  function initMap() {
    // перевод формы в неактивное состояние
    // блок с картой .map содержит класс map--faded;
    // форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
    // все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset.
    // форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form
    toggleMainFormActivity(false);

    // проверка и установка ограничений на поля ввода
    window.form.setRulesForInputFields();

    // регистрация события mousedown на главной метке
    mainPin.addEventListener('mousedown', onMainPinMouseDown);

    // начальное значение поля address ТЗ:
    // насчёт определения координат метки в этом случае нет никаких инструкций, ведь в неактивном режиме страницы метка круглая, поэтому мы можем взять за исходное значение поля адреса середину метки.

    // верхний левый угол главной метки - left
    mainPinLeft = MAIN_PIN_INIT_LEFT;
    // верхний левый угол главной метки - top
    mainPinTop = MAIN_PIN_INIT_TOP;
    // координата X середины главной метки
    mainPinMiddleX = mainPinLeft + Math.round(mainPinWidth / 2);
    // координата Y середины главной метки
    mainPinMiddleY = mainPinTop + Math.round((mainPinHeight / 2));
    // начальное положение главной метки
    setMainPinPos(mainPinLeft, mainPinTop);
    // начальная строка ареса
    window.form.getAddressStr(mainPinMiddleX, mainPinMiddleY);

    // отрисовка пинов - исходное состояние
    isMouseUp = false;

    // кнопка reset
    document.querySelector('.ad-form__reset').addEventListener('click', onButtonResetClick);

    // отправка данных - форма
    window.form.adForm.addEventListener('submit', onFormSubmit);

  }


  // Точка входа
  // Инициализация
  initMap();

  // Инициализация формы фильтра
  window.filter.initFilerForm(cbFilterEvent);

})();
