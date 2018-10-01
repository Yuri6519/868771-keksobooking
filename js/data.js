// модуль для работы с данными

'use strict';

(function () {

  // массив объявлений
  var ads = [];

  // инициализация массива объявлений реальными данными
  function initRealAds(data) {
    ads = [];
    ads = data.slice();
  }

  // возвращает массив ads
  function getAds() {
    return ads;
  }

  window.data = {
    getAds: getAds,
    initRealAds: initRealAds

  };


})();
