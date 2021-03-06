// форма

'use strict';

(function () {
  // форма
  var FORM_ACTION = 'https://js.dump.academy/keksobooking';
  var FORM_METHOD = 'post';
  var FORM_ENCTYPE = 'multipart/form-data';

  // элемент формы
  var adForm = document.querySelector('.ad-form');

  // заголовок
  var adTitle = adForm.querySelector('#title');

  // адрес
  var adAddress = adForm.querySelector('#address');

  // цена
  var adPrice = adForm.querySelector('#price');

  // тип
  var adType = adForm.querySelector('#type');

  // кол-во комнат
  var adRoomNum = adForm.querySelector('#room_number');

  // вместимость
  var adCapacity = adForm.querySelector('#capacity');

  // время заезда
  var adCheckIn = adForm.querySelector('#timein');

  // время выезда
  var adCheckOut = adForm.querySelector('#timeout');

  // описание
  var adDescription = adForm.querySelector('#description');

  // особенности
  var adFeatures = document.querySelector('.features').querySelectorAll('input');

  // поля
  var adFormFieldSets = adForm.querySelectorAll('fieldset');

  // массив соответствий кол-ва комнат кол-ву жильцов (жестко соответствует значениям поля value эл-в room_number и capacity)
  var mappedNames = [
    {
      key: 1,
      value: [1]
    },
    {
      key: 2,
      value: [1, 2]
    },
    {
      key: 3,
      value: [1, 2, 3]
    },
    {
      key: 100,
      value: [0]
    }
  ];

  // возвращает мин цену жилья в зависимости от типа жилья
  function getMinDwellPrice(dwellName) {
    return window.card.dwellingTypes[dwellName].minPrice;
  }

  // ф-ия блокирует/разблокирует форму добавления объявления
  function toggleAdFormAbility(isEnabled) {
    if (isEnabled) {
      adForm.classList.remove('ad-form--disabled');
    } else {
      adForm.classList.add('ad-form--disabled');
    }

    [].forEach.call(adFormFieldSets, function (itr) {
      itr.disabled = !isEnabled;
    });
  }

  function getAddressStr(addrX, addrY) {
    adAddress.value = addrX + ', ' + addrY;
  }

  // обработка события на выбор типа жилья
  function processDwellTypeChange(selectDwelType) {
    var options = selectDwelType.querySelectorAll('option');
    if (options.length > 0 & selectDwelType.selectedIndex >= 0) {
      var option = options[selectDwelType.selectedIndex];
      adPrice.min = getMinDwellPrice(option.value);
      adPrice.placeholder = adPrice.min;
    }
  }

  function ckearCapacity() {
    adCapacity.selectedIndex = -1;
  }

  // установка опций выбора количества гостей
  function setCapacity(key) {
    var vals = mappedNames.filter(function (itr) {
      return itr.key === key;
    }).map(function (itr) {
      return itr.value;
    })[0];

    if (vals.length > 0) {
      // установка кол-ва гостей
      var localCapOptions = adCapacity.querySelectorAll('option');

      // уберем все элементы
      [].forEach.call(localCapOptions, function (itr) {
        itr.hidden = true;
        itr.selected = false;
      });

      // ничего не выбрано
      ckearCapacity();

      // добавим только нужные
      vals.forEach(function (itrVal) {
        [].filter.call(localCapOptions, function (itrOpt) {
          return parseInt(itrOpt.value, 10) === itrVal;
        }).forEach(function (itrCap) {
          itrCap.hidden = false;
          itrCap.selected = true; // объект сам переключает seleted у элемента (т.е. выбран будет только один)
        });
      });

    }
  }

  // обработка события на выбор кол-ва комнат
  function processRoomChange(roomElement) {
    var options = roomElement.querySelectorAll('option');
    if (options.length > 0 & roomElement.selectedIndex >= 0) {
      setCapacity(parseInt(roomElement[roomElement.selectedIndex].value, 10));
    }
  }

  // очистка поей
  function clearAllInputs() {
    // заголовок
    adTitle.value = '';

    // тип и цена (по умолчанию выберем Квартира = 1000)
    adPrice.value = '';
    adType.selectedIndex = 1;
    processDwellTypeChange(adType);

    // кол-во комнат и кол-во мест
    // по умолчанию установим максимально (3 комнаты для 1, 2, 3 гостей)
    adRoomNum.selectedIndex = 2;
    ckearCapacity();
    processRoomChange(adRoomNum);

    // время заезда - выезда
    adCheckIn.selectedIndex = 0;
    adCheckOut.selectedIndex = 0;

    // адрес - очистим от сарых значений (установка в отдельной ф-ии)
    adAddress.value = '';

    // описание
    adDescription.value = '';

    // особенности
    [].forEach.call(adFeatures, function (itr) {
      if (itr.type === 'checkbox') {
        itr.checked = false;
      }
    });
  }

  // установка элемента времени выезда/заезда
  function setCheckTime(index, id) {
    var localId = id === 'timein' ? '#timeout' : '#timein';
    var checkTimeOptions = adForm.querySelector(localId).querySelectorAll('option');
    checkTimeOptions[index].selected = true;
  }

  // обработка события на выбор времени заезда/выезда
  function processCheckInOutTime(checkInOut) {
    var id = checkInOut.id;
    var options = checkInOut.querySelectorAll('option');
    if (options.length > 0 & checkInOut.selectedIndex >= 0) {
      setCheckTime(checkInOut.selectedIndex, id);
    }
  }

  // ф-ия проверяет и установливает ограничения на поля ввода
  function setRulesForInputFields() {
    //  ТЗ: в шестом разделе мы выполним задание, в котором мы перепишем механизм отправки данных, но пока что, достаточно убедиться, что у соответствующих тегов form прописаны правильные атрибуты
    // можно убедиться "глазами", ради треннировки убедимся программно
    adForm.action = adForm.action === FORM_ACTION ? adForm.action : FORM_ACTION;
    adForm.method = adForm.method === FORM_METHOD ? adForm.method : FORM_METHOD;
    adForm.enctype = adForm.enctype === FORM_ENCTYPE ? adForm.enctype : FORM_ENCTYPE;

    // 1. Заголовок объявления
    // ТЗ:
    //  обязательное текстовое поле;
    //  минимальная длина — 30 символов;
    //  максимальная длина — 100 символов;
    adTitle.required = true;
    adTitle.minLength = '30';
    adTitle.maxLength = '100';

    // 2. Цена за ночь:
    // обязательное поле;
    // числовое поле;
    // максимальное значение — 1000000;
    adPrice.required = true;
    adPrice.type = 'number';
    adPrice.max = 1000000;

    // 3. Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
    adType.addEventListener('change', function (evt) {
      processDwellTypeChange(evt.currentTarget);
    });

    // 4. Адрес. Ручное редактирование поля запрещено.
    adAddress.readOnly = true;

    // 5. Поля «Время заезда» и «Время выезда» синхронизированы
    // поле timeIn
    adCheckIn.addEventListener('change', function (evt) {
      processCheckInOutTime(evt.currentTarget);
    });

    // поле timeOut
    adCheckOut.addEventListener('change', function (evt) {
      processCheckInOutTime(evt.currentTarget);
    });

    // 6. Поле «Количество комнат» синхронизировано с полем «Количество мест»
    adRoomNum.addEventListener('change', function (evt) {
      processRoomChange(evt.currentTarget);
    });

    // 7. Очистим все поля ввода и установим дефолтные значения
    clearAllInputs();

  }

  window.form = {
    adForm: adForm,

    toggleAdFormAbility: toggleAdFormAbility,
    getAddressStr: getAddressStr,
    setRulesForInputFields: setRulesForInputFields

  };

})();
