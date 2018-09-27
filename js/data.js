// модуль для работы с данными

'use strict';

(function () {

  // массив объявлений
  var ads = [];

  // ограничения
  var MAP_MIN_LEFT = 0;
  var MAP_MAX_LENGTH = 1199;
  var MAP_MIN_TOP = 130;
  var MAP_MAX_HEIGHT = 630;

  // шаблон адреса картинки аватара
  var STR_AVATAR_ADDR = 'img/avatars/user{{xx}}.png';

  // шаблон для строк фото (каждая строка имеет одинаковую стуктуру, различие только в цифрах hotel1, hotel2, hotel3, поэтому массив создаю на лету в произвольном порядке. Для  этого и нужен шаблон)
  var STR_DWELLING_PHOTO = 'http://o0.github.io/assets/images/tokyo/hotel{{xx}}.jpg';

  // обычная метка - pin
  var PIN_WIDTH = 50;

  // location
  var LOCATION_MIN_X = 1 + Math.round(PIN_WIDTH / 2); // минимальная координаты плюс половина ширины метки (чтобы не уходила за край)
  var LOCATION_MAX_X = MAP_MAX_LENGTH - Math.round(PIN_WIDTH / 2); // максимальная длина карты минус половина ширины метки  (чтобы не уходила за край)
  var LOCATION_MIN_Y = MAP_MIN_TOP;
  var LOCATION_MAX_Y = MAP_MAX_HEIGHT;


  // price
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;

  // room
  var ROOM_MIN = 1;
  var ROOM_MAX = 5;

  // guests - случайное количество гостей, которое можно разместить (не задано, так что min и max задаю сам)
  var GUEST_MIN = 1;
  var GUEST_MAX = 10;

  // число строк с адресом фото жилья
  var DWEL_PHOTO_ADDR_NUM = 3;

  // массив индексов аватаров
  var avatarNums = [1, 2, 3, 4, 5, 6, 7, 8];
  var avatarNumsSave = avatarNums.slice(); // для хранения при новой инициализации, так как затирается avatarNums

  // массив строк - заголовков предложения
  var titleData = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'];

  var titleDataSave = titleData.slice(); // для хранения при новой инициализации, так как затирается titleData

  // массив типов жилья
  var dwellingTypes = ['palace', 'flat', 'house', 'bungalo'];
  var dwellingTypesRus = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
  var dwellingMinPrice = [
    {key: 0, value: 10000},
    {key: 1, value: 1000},
    {key: 2, value: 5000},
    {key: 3, value: 0}
  ];

  // массив значений времени заселения/выселения
  var timeCheckArray = ['12:00', '13:00', '14:00'];

  // массив строк особенностей жилья
  var dwellingFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  // ф- ия возвращает строку со случайно выбранным адресом аватара, если все адреса разобраны, возвращает пустую строку (по идее, надо генерить исключение, все номера разобраны).
  function getAvatarImagePath() {
    return avatarNums.length > 0 ? STR_AVATAR_ADDR.replace('{{xx}}', '0' + avatarNums.splice(window.utils.getRandomValueNum(0, avatarNums.length - 1), 1)[0]) : '';
  }

  // ф- ия возвращает строку с заголовком предложения, выбранную случайным образом. Если все адреса разобраны, возвращает пустую строку (по идее надо генерить исключение, если все номера разобраны)
  function getOfferTitle() {
    return titleData.length > 0 ? titleData.splice(window.utils.getRandomValueNum(0, titleData.length - 1), 1)[0] : '';
  }

  // ф- ия возвращает адрес (x, y)
  function getOfferAddress(location) {
    return location.x + ', ' + location.y;
  }

  // ф-ия создает массив строк для адреса фотографий жилья (кол-во - вход параметр)
  function getOffsetDwellingPhotos(number) {
    var resArr = [];
    var numArr = [];

    // вркеменный массив
    for (var i = 0; i < number; i++) {
      numArr[i] = i + 1;
    }

    // случайный элемент массива
    for (i = 1; i <= number; i++) {
      // случайная величина индекса временного массива
      var arrIndex = window.utils.getRandomValueNum(0, numArr.length - 1);

      // формируем строку
      resArr[resArr.length] = STR_DWELLING_PHOTO.replace('{{xx}}', numArr.splice(arrIndex, 1)[0]);
    }

    return resArr;
  }

  // ф-ия создает объект author
  function createAuthorData() {
    return {avatar: getAvatarImagePath()};
  }

  // ф-ия возвращает особенности жилья - массив строк случайной длины, сформированный случайным образом из массива особенностей без повторения данных, т.е. каждая строка - один раз, но в случайном порядке
  function getOfferDwellingFeatures() {
    // результирующий массив
    var resultArray = [];

    // временный массив
    var cloneArray = dwellingFeatures.slice();

    // число особенностей - случайная величина от 1 до длины массива особенностей
    var featureNum = window.utils.getRandomValueNum(1, cloneArray.length);

    for (var i = 1; i <= featureNum; i++) {
      // случайная величина индекса временного массива
      var arrIndex = window.utils.getRandomValueNum(0, cloneArray.length - 1);

      // добавим в рез массив и одновременно удалим из временного
      resultArray[resultArray.length] = cloneArray.splice(arrIndex, 1)[0];
    }
    return resultArray;
  }

  // ф-ия создает объект offer
  function createOfferData(location) {
    return {
      title: getOfferTitle(),
      address: getOfferAddress(location),
      price: window.utils.getRandomValueNum(PRICE_MIN, PRICE_MAX),
      type: window.utils.getRandomValue(dwellingTypes),
      rooms: window.utils.getRandomValueNum(ROOM_MIN, ROOM_MAX),
      guests: window.utils.getRandomValueNum(GUEST_MIN, GUEST_MAX),
      checkin: window.utils.getRandomValue(timeCheckArray),
      checkout: window.utils.getRandomValue(timeCheckArray),
      features: getOfferDwellingFeatures(),
      description: '',
      photos: getOffsetDwellingPhotos(DWEL_PHOTO_ADDR_NUM)
    };
  }

  // ф-ия создает объект location
  function createlocationData() {
    return {
      x: window.utils.getRandomValueNum(LOCATION_MIN_X, LOCATION_MAX_X),
      y: window.utils.getRandomValueNum(LOCATION_MIN_Y, LOCATION_MAX_Y)
    };
  }

  // ф-ия создает объект объявления
  function createAdvertisementObject() {
    var advertisement;
    var location = createlocationData();

    advertisement = {
      author: createAuthorData(),
      location: location,
      offer: createOfferData(location),
    };
    return advertisement;
  }

  // ф-ия заполняет массив объявлений
  function fillAdsArray(num) {
    ads = [];

    for (var i = 0; i < num; i++) {
      ads[i] = createAdvertisementObject();
    }

  }

  // ф-ия возвращает русское название типа жилья
  function getDwellingTypeRus(typeStr) {
    var res = '';

    for (var i = 0; i < dwellingTypes.length; i++) {
      if (dwellingTypes[i] === typeStr) {
        res = dwellingTypesRus[i];
        break;
      }
    }
    return res;
  }

  // возвращает мин цену жилья
  function getMinDwellPrice(dwellName) {
    var res = -1;
    for (var i = 0; i <= dwellingTypes.length; i++) {
      if (dwellingTypes[i] === dwellName) {
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


  // инициализирует массив объявлений
  function initAds(num) {

    // тестовый режим
    // инициализируем, то что затерли
    if (avatarNums.length === 0) {
      avatarNums = avatarNumsSave.slice();
    }

    if (titleData.length === 0) {
      titleData = titleDataSave.slice();
    }

    fillAdsArray(num);

  }

  // заполняем массив объявлений реальными данными
  function initRealAds(data) {
    ads = [];
    ads = data.slice();
  }

  // возвращает массив ads
  // нельзя использовать в объекте {ads: ads}, так как инициализируется пустым начальным значением ads[]
  function getAds() {
    return ads;
  }

  window.data = {
    PIN_WIDTH: PIN_WIDTH,
    MAP_MIN_LEFT: MAP_MIN_LEFT,
    MAP_MAX_LENGTH: MAP_MAX_LENGTH,
    MAP_MIN_TOP: MAP_MIN_TOP,
    MAP_MAX_HEIGHT: MAP_MAX_HEIGHT,

    initAds: initAds,
    getDwellingTypeRus: getDwellingTypeRus,
    getMinDwellPrice: getMinDwellPrice,
    getAds: getAds,
    initRealAds: initRealAds

  };


})();
