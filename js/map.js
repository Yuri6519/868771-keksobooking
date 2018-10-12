// модуль для работы с картой

'use strict';

(function () {
  // главная метка
  var mainPin = document.querySelector('.map__pin--main');

  // блок для вставки сообщений
  var main = document.querySelector('main');

  // блок сообщения об успехе
  var successElement = document.querySelector('#success').content.querySelector('.success');

  // блок сообщения об ошибке
  var errorElement = document.querySelector('#error').content.querySelector('.error');

  var ERROR_LOADED_CLASS = 'error_on_load';

  var ERROR_SAVED_CLASS = 'error_on_save';

  // начальное положение главной метки- константа для инициализации Y
  var MAIN_PIN_INIT_TOP = parseInt(mainPin.style.top, 10);

  // лабел для кнопки
  var CLOSE_BUTTON_LABEL = 'Закрыть';

  // ограничения
  var MAP_MIN_LEFT = 0;
  var MAP_MIN_TOP = 130;
  var MAP_MAX_HEIGHT = 630;

  // ширина главной метки (беру по размеру из панели дебагера)
  var MAIN_PIN_WIDTH = 65;
  // высота главной метки (беру по размеру из панели дебагера)
  var MAIN_PIN_HEIGHT = 65;
  // хвост метки (беру по размеру из панели дебагера)
  var MAIN_PIN_TAIL = 20; // весь квадрат = 65, image = 62, хвост идет от image и длина = 22. Округлил до 2 (65 - 62 / 2 = 1,5) и тогда хвост выходит за рамку 22-2=20. Как-так...

  // переменная для хранения левого верхнего угла главной метки - left
  var mainPinLeft;
  // переменная для хранения левого верхнего угла главной метки - top
  var mainPinTop;
  // координата X середины главной метки
  var mainPinMiddleX;
  // координата Y середины главной метки
  var mainPinMiddleY;
  // метка с хвостом
  var mainPinFullHeight = MAIN_PIN_HEIGHT + MAIN_PIN_TAIL;

  // ключ на блокировку отрисовки пинов из moseup
  var isMouseUp = false;

  var mapSectionElement = document.querySelector('.map');

  // отрисовка меток похожих объявлений
  function showAdsData(filter) {
    // 1. Создадим DOM элементы меток
    var pinContainer = window.pin.createPins(window.data.getAds(filter));

    // 2. Отрисуем сгенерированные DOM-элементы в блок .map__pins
    // 2.1. Чистка блока от старых пинов
    window.pin.removeAll();

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

  // отрисовка ошибки
  function showError(errNode, errClassName, mes) {
    errNode.classList.add(errClassName);
    errNode.querySelector('.error__message').textContent = mes;

    // блок для вставки
    main.appendChild(errNode);

  }

  // callback на ошибку при загрузке данных с сервера
  function cbErrorLoadAds(mes) {
    // кнопка
    var errBtn = errorElement.querySelector('.error__button');
    errBtn.textContent = CLOSE_BUTTON_LABEL;

    // покажем ошибку
    var errNode = errorElement.cloneNode(true);
    showError(errNode, ERROR_LOADED_CLASS, mes);

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
    var successNode = successElement.cloneNode(true);
    main.appendChild(successNode);

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
    var errNode = errorElement.cloneNode(true);
    showError(errNode, ERROR_SAVED_CLASS, mes);

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
    var errBtn = errorElement.querySelector('.error__button');
    errBtn.addEventListener('click', function () {
      closeErrWindow();
    });

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);

  }

  // ф-ия блокирует/разблокирует карту
  function toggleAbility(isNotFaded) {
    if (isNotFaded) {
      mapSectionElement.classList.remove('map--faded');
    } else {
      mapSectionElement.classList.add('map--faded');
    }

  }

  // главная ф-ия переключения активности формы и карты
  function toggleMainFormActivity(isActive) {
    window.form.toggleAdFormAbility(isActive);
    window.filter.toggleFormAbility(isActive);
    toggleAbility(isActive);
  }

  // установка значения адреса (острый конец метки)
  function setAddress(mainPinNewLeft, mainPinNewRight) {

    // координаты хвоста относительно верхнего левого угла
    var tailX = mainPinNewLeft + Math.round(MAIN_PIN_WIDTH / 2);
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
      var mapMaxLength = mapSectionElement.offsetWidth;
      shiftLeft = shiftLeft >= MAP_MIN_LEFT - Math.round(MAIN_PIN_WIDTH / 2) ? shiftLeft : MAP_MIN_LEFT - Math.round(MAIN_PIN_WIDTH / 2);
      shiftLeft = shiftLeft + Math.round(MAIN_PIN_WIDTH / 2) <= mapMaxLength ? shiftLeft : mapMaxLength - Math.round(MAIN_PIN_WIDTH / 2);

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
    window.pin.removeAll();

    // очистим и проинициализируем объекты фото
    window.photo.initLoader();

    // инициализируем
    init();

  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    window.backend.saveData(new FormData(window.form.adForm), cbSuccessSaveAds, cbErrorSaveAds);

  }

  function cbFilterEvent(data) {
    showAdsData(data);
  }

  // инициализация
  function init() {
    // перевод формы в неактивное состояние
    toggleMainFormActivity(false);

    // проверка и установка ограничений на поля ввода
    window.form.setRulesForInputFields();

    // регистрация события mousedown на главной метке
    mainPin.addEventListener('mousedown', onMainPinMouseDown);

    // начальное значение поля address ТЗ:
    // насчёт определения координат метки в этом случае нет никаких инструкций, ведь в неактивном режиме страницы метка круглая, поэтому мы можем взять за исходное значение поля адреса середину метки.

    // верхний левый угол главной метки зависит от размеров карты, которая уменьшпется при изменении размера окна
    mainPinLeft = Math.round((mapSectionElement.offsetWidth / 2)) - Math.round(MAIN_PIN_WIDTH / 2);

    // верхний левый угол главной метки - top
    mainPinTop = MAIN_PIN_INIT_TOP;

    // координата X середины главной метки
    mainPinMiddleX = mainPinLeft + Math.round(MAIN_PIN_WIDTH / 2);
    // координата Y середины главной метки
    mainPinMiddleY = mainPinTop + Math.round((MAIN_PIN_HEIGHT / 2));
    // начальное положение главной метки
    setMainPinPos(mainPinLeft, mainPinTop);
    // начальная строка ареса
    window.form.getAddressStr(mainPinMiddleX, mainPinMiddleY);

    // отрисовка пинов - исходное состояние
    isMouseUp = false;

  }

  // Точка входа
  // Инициализация
  init();

  // кнопка reset
  document.querySelector('.ad-form__reset').addEventListener('click', onButtonResetClick);

  // отправка данных - форма
  window.form.adForm.addEventListener('submit', onFormSubmit);


  // Инициализация формы фильтра
  window.filter.initForm(cbFilterEvent);

  // Инициализация загрузчика фотографий
  window.photo.initLoader();

})();
