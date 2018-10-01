// работа с фильтром
'use strict';

(function () {

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

  // инициализация
  function initFilerForm(cbFunc) {
    housingType.addEventListener('change', function () {
      setHousingTypeValue();
      cbFunc(filterSet);
    });

    housingPrice.addEventListener('change', function () {
      setHousingPriceValue();
      cbFunc(filterSet);
    });

    housingRooms.addEventListener('change', function () {
      setHousingRoomsValue();
      cbFunc(filterSet);
    });

    housingGuests.addEventListener('change', function () {
      setHousingGuestsValue();
      cbFunc(filterSet);
    });

    // подпишем input-ы на событие клика
    var inpList = housingFeatures.querySelectorAll('input');
    inpList.forEach(function (itr) {
      itr.addEventListener('click', function () {
        setHousingFeaturesValues();
        cbFunc(filterSet);
      });
    });
  }

  window.filter = {
    initFilerForm: initFilerForm
  };


})();
