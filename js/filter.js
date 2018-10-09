// работа с фильтром
'use strict';

(function () {

  // задержка на срабатывание фильтра - мсек
  var DELAY_INTERVAL = 500;

  // форма
  var filterForm = document.querySelector('.map__filters');

  // тип жилья
  var housingType = filterForm.querySelector('#housing-type');

  // цена
  var housingPrice = filterForm.querySelector('#housing-price');

  // комнаты
  var housingRooms = filterForm.querySelector('#housing-rooms');

  // гости
  var housingGuests = filterForm.querySelector('#housing-guests');

  // особенности
  var housingFeatures = filterForm.querySelector('#housing-features');

  // набор значений фильтра
  var filterSet = {
    housingTypeValue: housingType.value,
    housingPriceValue: housingPrice.value,
    housingRoomsValue: housingRooms.value,
    housingGuestsValue: housingGuests.value,
    housingFeaturesValues: []
  };

  // заполняет массив особенностей
  function fillFetures() {
    return [].map.call(housingFeatures.querySelectorAll('input'), function (itr) {
      return {
        value: itr.value,
        checked: itr.checked
      };
    }).filter(function (itr) {
      return itr.checked;
    }).map(function (itr) {
      return itr.value;
    });
  }

  // установка фильтра на тип жилья
  function setHousingTypeValue() {
    filterSet.housingTypeValue = housingType.value;
  }

  // установка фильтра на цену
  function setHousingPriceValue() {
    filterSet.housingPriceValue = housingPrice.value;
  }

  // установка фильтра на кол-во комнат
  function setHousingRoomsValue() {
    filterSet.housingRoomsValue = housingRooms.value;
  }

  // установка фильтра на кол-во гостей
  function setHousingGuestsValue() {
    filterSet.housingGuestsValue = housingGuests.value;
  }

  // установка фильтра на удобства
  function setHousingFeaturesValues() {
    filterSet.housingFeaturesValues = [];
    filterSet.housingFeaturesValues = fillFetures();
  }

  // действия после выбора фильтра (убираем "дребезг")
  function doAfter(cbFunc) {
    window.debounce.delay(function () {
      window.card.removeOldAds();
      cbFunc(filterSet);
    }, DELAY_INTERVAL);
  }

  // инициализация
  function initFilerForm(cbFunc) {
    // 1. События на фильтры
    housingType.addEventListener('change', function () {
      setHousingTypeValue();
      doAfter(cbFunc);
    });

    housingPrice.addEventListener('change', function () {
      setHousingPriceValue();
      doAfter(cbFunc);
    });

    housingRooms.addEventListener('change', function () {
      setHousingRoomsValue();
      doAfter(cbFunc);
    });

    housingGuests.addEventListener('change', function () {
      setHousingGuestsValue();
      doAfter(cbFunc);
    });

    // подпишем input-ы на событие клика
    var inpList = housingFeatures.querySelectorAll('input');
    inpList.forEach(function (itr) {
      itr.addEventListener('click', function () {
        setHousingFeaturesValues();
        doAfter(cbFunc);
      });
    });

  }

  // ф-ия блокирует/разблокирует форму
  function toggleFilterFormAbility(isEnabled) {
    var adFormFieldSets = filterForm.querySelectorAll('select');

    [].forEach.call(adFormFieldSets, function (itr) {
      itr.disabled = !isEnabled;
    });

    filterForm.querySelector('fieldset').disabled = !isEnabled;

    // при переводе формы в неактивное состояние очищаем фильтр
    if (!isEnabled) {
      clearAllFilters();
    }
  }

  // ф-ия очищает форму (убирает фильтры)
  function clearAllFilters() {
    housingType.value = window.utils.VAL_ANY;
    housingPrice.value = window.utils.VAL_ANY;
    housingRooms.value = window.utils.VAL_ANY;
    housingGuests.value = window.utils.VAL_ANY;

    housingFeatures.querySelectorAll('input').forEach(function (itr) {
      itr.checked = false;
    });

    filterSet.housingTypeValue = housingType.value;
    filterSet.housingPriceValue = housingPrice.value;
    filterSet.housingRoomsValue = housingRooms.value;
    filterSet.housingGuestsValue = housingGuests.value;
    filterSet.housingFeaturesValues = [];

  }

  window.filter = {
    initFilerForm: initFilerForm,
    toggleFilterFormAbility: toggleFilterFormAbility
  };


})();
