'use strict';

(function () {
  // главная метка
  var mainPin = document.querySelector('.map__pin--main');

  // начальное положение главной метки- константа для инициализации X
  var MAIN_PIN_INIT_LEFT = parseInt(mainPin.style.left, 10);

  // начальное положение главной метки- константа для инициализации Y
  var MAIN_PIN_INIT_TOP = parseInt(mainPin.style.top, 10);

  // переменная для хранения левого верхнего угла главной метки - left
  var mainPinLeft;
  // переменная для хранения левого верхнего угла главной метки - top
  var mainPinTop;
  // ширина главной метки (непонятно где брать - беру по размеру из панели дебагера)
  var mainPinWidth = 65;
  // высота главной метки (непонятно где брать - беру по размеру из панели дебагера)
  var mainPinHeight = 65;
  // координата X середины главной метки
  var mainPinMiddleX;
  // координата Y середины главной метки
  var mainPinMiddleY;
  // хвост метки (непонятно где брать - беру по размеру из панели дебагера)
  var mainPinTail = 20; // весь квадрат = 65, image = 62, хвост идет от image и длина = 22. Округлил до 2 (65 - 62 / 2 = 1,5) и тогда хвост выходит за рамку 22-2=20. Как-так...
  // метка с хвостом
  var mainPinFullHeight = mainPinHeight + mainPinTail;

  // ключ на блокировку отрисовки пинов из moseup
  var isMouseUp = false;

  // показ похожих объявлений
  function showSimilarAds() {
    // инициализация массива объектов объявлений
    window.data.initAds(8);

    // 2. Создадим DOM элементы меток
    var pinContainer = window.pin.createPins(window.data.getAds());

    // 3. Отрисуем сгенерированные DOM-элементы в блок .map__pins
    // 3.1. Чистка блока от старых пинов
    window.pin.removeAllPins();

    // 3.2. Добавляем в блок
    document.querySelector('.map__pins').appendChild(pinContainer);

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

  // ф-ия блокирует/разблокирует форму фильтрации объявлений
  function toggleFilterFormAbility(isEnabled) {
    // block select elements
    var adFormFieldSets = document.querySelector('.map__filters').querySelectorAll('select');
    for (var i = 0; i < adFormFieldSets.length; i++) {
      adFormFieldSets[i].disabled = !isEnabled;
    }

    // block fieldset element
    document.querySelector('.map__filters').querySelector('fieldset').disabled = !isEnabled;
  }

  // главная ф-ия переключения активности формы и карты
  function toggleMainFormActivity(isActive) {
    window.form.toggleAdFormAbility(isActive);
    toggleFilterFormAbility(isActive);
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
      shiftLeft = shiftLeft >= window.data.MAP_MIN_LEFT - Math.round(mainPinWidth / 2) ? shiftLeft : window.data.MAP_MIN_LEFT - Math.round(mainPinWidth / 2);
      shiftLeft = shiftLeft + Math.round(mainPinWidth / 2) <= window.data.MAP_MAX_LENGTH ? shiftLeft : window.data.MAP_MAX_LENGTH - Math.round(mainPinWidth / 2);
      // y
      var shifTop = (mainPin.offsetTop - shiftPos.y);
      shifTop = shifTop >= window.data.MAP_MIN_TOP ? shifTop : window.data.MAP_MIN_TOP;
      shifTop = shifTop <= window.data.MAP_MAX_HEIGHT ? shifTop : window.data.MAP_MAX_HEIGHT;

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

    // инициализируем
    initMap();

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

  }


  // Точка входа
  // Инициализация
  initMap();

})();
