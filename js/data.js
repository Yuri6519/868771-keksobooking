// модуль для работы с данными

'use strict';

(function () {
  // максимальное число сеток для отрисовки
  var MAX_COUNT_ADS = 5;

  // начальный (загруженный с сервера) массив объявлений
  var ads = [];

  // отфильтрованный массив объявлений
  var filterAds = [];

  // инициализация массива объявлений реальными данными
  function initRealAds(data) {
    ads = [];
    ads = data.slice();
  }

  // соответствие цены и диапазона
  var priceValueToRange = {
    'low': {min: 0, max: 10000},
    'middle': {min: 10000, max: 50000},
    'high': {min: 50000, max: Infinity}
  };

  // сравнение цены
  function checkPrice(key, value) {
    return (value >= priceValueToRange[key].min) && (value < priceValueToRange[key].max);
  }

  // проверка на особенности
  function checkFeayures(ftcFilter, ftcAds) {
    return !(ftcFilter.map(function (itr) {
      return ftcAds.indexOf(itr);
    }).some(function (itr) {
      return itr < 0;
    }));
  }

  function checkAdsForFilter(element, filter) {
    var res = true;
    if (filter) {
      res = ((filter.housingTypeValue === window.utils.VAL_ANY) || (element.offer.type === filter.housingTypeValue))
            &&
            ((filter.housingPriceValue === window.utils.VAL_ANY) || (checkPrice(filter.housingPriceValue, parseInt(element.offer.price, 10))))
            &&
            ((filter.housingRoomsValue === window.utils.VAL_ANY) || (element.offer.rooms === parseInt(filter.housingRoomsValue, 10)))
            &&
            ((filter.housingGuestsValue === window.utils.VAL_ANY) || (element.offer.guests === parseInt(filter.housingGuestsValue, 10)))
            &&
            ((filter.housingFeaturesValues.length === 0) || (checkFeayures(filter.housingFeaturesValues, element.offer.features)));
    }

    return res;
  }

  // возвращает массив ads
  function getAds(filter) {

    filterAds = [];

    filterAds = ads.filter(function (itr) {
      return checkAdsForFilter(itr, filter);
    }).slice(0, MAX_COUNT_ADS);

    return filterAds;
  }

  // возвращает элемент отсортированного массива
  function getFilteredAdsById(id) {
    return filterAds[id];
  }

  window.data = {
    getAds: getAds,
    initRealAds: initRealAds,
    getFilteredAdsById: getFilteredAdsById

  };

})();
