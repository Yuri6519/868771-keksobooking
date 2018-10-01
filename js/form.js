// форма

'use strict';

(function () {
  // форма
  var FORM_ACTION = 'https://js.dump.academy/keksobooking';
  var FORM_METHOD = 'post';
  var FORM_ENCTYPE = 'multipart/form-data';

  // элемент формы
  var adForm = document.querySelector('.ad-form');

  // массив соответствий кол-ва комнат кол-ву жильцов (жестко соответствует значениям поля value эл-в room_number и capacity)
  var marRoomCapArray = [
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

  var dwellingMinPrice = [
    {key: 0, value: 10000},
    {key: 1, value: 1000},
    {key: 2, value: 5000},
    {key: 3, value: 0}
  ];

  // возвращает мин цену жилья в зависимости от типа жилья
  function getMinDwellPrice(dwellName) {
    var res = -1;
    for (var i = 0; i <= window.card.dwellingTypes.length; i++) {
      if (window.card.dwellingTypes[i] === dwellName) {
        for (var ind = 0; ind < dwellingMinPrice.length; ind++) {
          if (dwellingMinPrice[ind].key === i) {
            res = dwellingMinPrice[i].value;
            break;
          }
        }
      }
    }

    // нужна проверка на >= 0 и если нет - raise exception
    return res;
  }

  // ф-ия блокирует/разблокирует форму добавления объявления
  function toggleAdFormAbility(isEnabled) {
    if (isEnabled) {
      adForm.classList.remove('ad-form--disabled');
    } else {
      adForm.classList.add('ad-form--disabled');
    }

    // fieldset
    var adFormFieldSets = adForm.querySelectorAll('fieldset');
    for (var i = 0; i < adFormFieldSets.length; i++) {
      adFormFieldSets[i].disabled = !isEnabled;
    }
  }

  function getAddressStr(addrX, addrY) {
    adForm.querySelector('#address').value = addrX + ', ' + addrY;
  }

  // обработка события на выбор типа жилья
  function processDwellTypeChange(selectDwelType) {
    var options = selectDwelType.querySelectorAll('option');
    if (options.length > 0 & selectDwelType.selectedIndex >= 0) {
      var option = options[selectDwelType.selectedIndex];
      var adPrice = adForm.querySelector('#price');
      adPrice.min = getMinDwellPrice(option.value);
      adPrice.placeholder = adPrice.min;
    }
  }

  // установка опций выбора количества гостей
  function setCapacity(key) {
    var vals = [];

    for (var i = 0; i < marRoomCapArray.length; i++) {
      if (marRoomCapArray[i].key === key) {
        vals = marRoomCapArray[i].value;
        break;
      }
    }

    if (vals.length > 0) {
      // установка кол-ва гостей
      var localCapOptions = adForm.querySelector('#capacity').querySelectorAll('option');

      // уберем все элементы
      for (i = 0; i < localCapOptions.length; i++) {
        localCapOptions[i].hidden = true;
        localCapOptions[i].selected = false;
      }

      // ничего не выбрано
      adForm.querySelector('#capacity').selectedIndex = -1;

      // добавим только нужные
      for (i = 0; i < vals.length; i++) {
        for (var ind = 0; ind < localCapOptions.length; ind++) {
          if (parseInt(localCapOptions[ind].value, 10) === vals[i]) {

            localCapOptions[ind].hidden = false;
            localCapOptions[ind].selected = true; // объект сам переключает seleted у элемента (т.е. выбран будет только один)

          }
        }
      }

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
    adForm.querySelector('#title').value = '';

    // тип и цена (по умолчанию выберем Квартира = 1000)
    adForm.querySelector('#price').value = '';
    adForm.querySelector('#type').selectedIndex = 1;
    processDwellTypeChange(adForm.querySelector('#type'));

    // кол-во комнат и кол-во мест
    // по умолчанию установим максимально (3 комнаты для 1, 2, 3 гостей)
    adForm.querySelector('#room_number').selectedIndex = 2;
    adForm.querySelector('#capacity').selectedIndex = -1;
    processRoomChange(adForm.querySelector('#room_number'));

    // время заезда - выезда
    adForm.querySelector('#timein').selectedIndex = 0;
    adForm.querySelector('#timeout').selectedIndex = 0;

    // адрес - очистим от сарых значений (установка в отдельной ф-ии)
    adForm.querySelector('#address').value = '';

    // описание
    adForm.querySelector('#description').value = '';

    // особенности
    var features = document.querySelector('.features').querySelectorAll('input');
    for (var i = 0; i < features.length; i++) {
      if (features[i].type === 'checkbox') {
        features[i].checked = false;
      }
    }

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
    var adTitle = adForm.querySelector('#title');
    adTitle.required = true;
    adTitle.minLength = '30';
    adTitle.maxLength = '100';

    // 2. Цена за ночь:
    // обязательное поле;
    // числовое поле;
    // максимальное значение — 1000000;
    var adPrice = adForm.querySelector('#price');
    adPrice.required = true;
    adPrice.type = 'number';
    adPrice.max = 1000000;

    // 3. Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
    var adDwellType = adForm.querySelector('#type');
    adDwellType.addEventListener('change', function (evt) {
      processDwellTypeChange(evt.currentTarget);
    });

    // 4. Адрес. Ручное редактирование поля запрещено.
    var adAddress = adForm.querySelector('#address');
    adAddress.readOnly = true;

    // 5. Поля «Время заезда» и «Время выезда» синхронизированы
    // поле timeIn
    var adCheckIn = adForm.querySelector('#timein');
    adCheckIn.addEventListener('change', function (evt) {
      processCheckInOutTime(evt.currentTarget);
    });

    // поле timeOut
    var adCheckOut = adForm.querySelector('#timeout');
    adCheckOut.addEventListener('change', function (evt) {
      processCheckInOutTime(evt.currentTarget);
    });

    // 6. Поле «Количество комнат» синхронизировано с полем «Количество мест»
    var adRoomNumber = adForm.querySelector('#room_number');
    adRoomNumber.addEventListener('change', function (evt) {
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
