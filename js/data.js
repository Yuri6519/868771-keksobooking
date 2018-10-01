// модуль для работы с данными

'use strict';

(function () {

  // массив объявлений
  var ads = [];
  var filterAds = [];

  var VAL_ANY = 'any';

  // инициализация массива объявлений реальными данными
  function initRealAds(data) {
    ads = [];
    ads = data.slice();
  }

  var priceValueToRange = {
    'low': {min: 0, max: 10000},
    'middle': {min: 10000, max: 50000},
    'high': {min: 50000, max: Infinity}
  };

  function checkPrice(key, value) {
    return (value >= priceValueToRange[key].min) && (value < priceValueToRange[key].max);
  }

  function checkAdsForFilter(element, filter) {
    var res = true;
    if (filter) {
      res = ((filter.housingTypeValue === VAL_ANY) || (element.offer.type === filter.housingTypeValue))
            &&
            ((filter.housingPriceValue === VAL_ANY) || (checkPrice(filter.housingPriceValue, parseInt(element.offer.price, 10))))
            &&
            ((filter.housingRoomsValue === VAL_ANY) || element.offer.rooms === parseInt(filter.housingRoomsValue, 10))
            &&
            ((filter.housingGuestsValue === VAL_ANY) || element.offer.guests === parseInt(filter.housingGuestsValue, 10));


            // console.log(element.offer.rooms);
            // console.log(filter.housingRoomsValue);
            // console.log('');

    }

    return res;
  }

  // возвращает массив ads
  function getAds(filter) {

    console.log(filter);

    filterAds = [];

    filterAds = ads.filter(function (itr) {
      return checkAdsForFilter(itr, filter);
    }).slice(0, 5);

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
