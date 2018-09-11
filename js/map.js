'use strict';

// шаблон адреса картинки аватара
var STR_AVATAR_ADDR = 'img/avatars/user{{xx}}.png';

// шаблон для строк фото (каждая строка имеет одинаковую стуктуру, различие только в цифрах hotel1, hotel2, hotel3, поэтому массив создаю на лету в произвольном порядке. Для  этого и нужен шаблон)
var STR_DWELLING_PHOTO = 'http://o0.github.io/assets/images/tokyo/hotel{{xx}}.jpg';

// шаблон строки для вывода комнат и гостей
var STR_ROOM_GUEST = '{{offer.rooms}} {{room}}} для {{offer.guests}} {{guest}}';

// шаблон времени заезда и выезда
var STR_CHECK_IN_OUT = 'Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}';

// pin
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

// location
var LOCATION_MIN_X = 1 + Math.round(PIN_WIDTH / 2); // минимальная координаты плюс половина ширины метки (чтобы не уходила за край)
var LOCATION_MAX_X = 1199 - Math.round(PIN_WIDTH / 2); // максимальная длина карты минус половина ширины метки  (чтобы не уходила за край)
var LOCATION_MIN_Y = 130;
var LOCATION_MAX_Y = 630;

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

// шаблон координат метки
var PIN_LOCATION = 'left: {{location.x}}px; top: {{location.y}}px;';

// массив индексов аватаров
var avatarNums = [1, 2, 3, 4, 5, 6, 7, 8];

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

// массив типов жилья
var dwellingTypes = ['palace', 'flat', 'house', 'bungalo'];
var dwellingTypesRus = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

// массив значений времени заселения/выселения
var timeCheckArray = ['12:00', '13:00', '14:00'];

// массив строк особенностей жилья
var dwellingFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// ф- ия возвращает строку со случайно выбранным адресом аватара, если все адреса разобраны, возвращает пустую строку (по идее, надо генерить исключение, все номера разобраны)
function getAvatarImagePath() {
  return avatarNums.length > 0 ? STR_AVATAR_ADDR.replace('{{xx}}', '0' + avatarNums.splice(getRandomValueNum(0, avatarNums.length - 1), 1)[0]) : '';
}

// ф- ия возвращает строку с заголовком предложения, выбранную случайным образом. Если все адреса разобраны, возвращает пустую строку (по идее надо генерить исключение, если все номера разобраны)
function getOfferTitle() {
  return titleData.length > 0 ? titleData.splice(getRandomValueNum(0, titleData.length - 1), 1)[0] : '';
}

// ф- ия возвращает адрес (x, y)
function getOfferAddress(location) {
  return location.x + ', ' + location.y;
}

// ф-ия возвращает особенности жилья - массив строк случайной длины, сформированный случайным образом из массива особенностей без повторения данных, т.е. каждая строка - один раз, но в случайном порядке
function getOfferDwellingFeatures() {
  // результирующий массив
  var resultArray = [];

  // временный массив
  var cloneArray = dwellingFeatures.slice();

  // число особенностей - случайная величина от 1 до длины массива особенностей
  var featureNum = getRandomValueNum(1, cloneArray.length);

  for (var i = 1; i <= featureNum; i++) {
    // случайная величина индекса временного массива
    var arrIndex = getRandomValueNum(0, cloneArray.length - 1);

    // добавим в рез массив и одновременно удалим из временного
    resultArray[resultArray.length] = cloneArray.splice(arrIndex, 1)[0];
  }
  return resultArray;
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
    var arrIndex = getRandomValueNum(0, numArr.length - 1);

    // формируем строку
    resArr[resArr.length] = STR_DWELLING_PHOTO.replace('{{xx}}', numArr.splice(arrIndex, 1)[0]);
  }

  return resArr;
}

// ф-ия создает объект author
function createAuthorData() {
  return {avatar: getAvatarImagePath()};
}

// ф-ия создает объект offer
function createOfferData(location) {
  return {
    title: getOfferTitle(),
    address: getOfferAddress(location),
    price: getRandomValueNum(PRICE_MIN, PRICE_MAX),
    type: getRandomValue(dwellingTypes),
    rooms: getRandomValueNum(ROOM_MIN, ROOM_MAX),
    guests: getRandomValueNum(GUEST_MIN, GUEST_MAX),
    checkin: getRandomValue(timeCheckArray),
    checkout: getRandomValue(timeCheckArray),
    features: getOfferDwellingFeatures(),
    description: '',
    photos: getOffsetDwellingPhotos(DWEL_PHOTO_ADDR_NUM)
  };
}

// ф-ия создает объект location
function createlocationData() {
  return {
    x: getRandomValueNum(LOCATION_MIN_X, LOCATION_MAX_X),
    y: getRandomValueNum(LOCATION_MIN_Y, LOCATION_MAX_Y)
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
  var adsArray = [];
  for (var i = 0; i < num; i++) {
    adsArray[i] = createAdvertisementObject();
  }
  return adsArray;
}

// ф-ия возвращает случайное значение из переданного массива
function getRandomValue(dataArray) {
  return dataArray[Math.round(Math.random() * (dataArray.length - 1))];
}

// ф-ия возвращает случайное значение из диапазона значений
function getRandomValueNum(minValue, maxValue) {
  return Math.round(Math.random().toFixed(1) * (maxValue - minValue) + minValue);
}

// ф-ия возвращает фрагмент с метками
function createPins(ads) {
  var template = document.getElementById('pin').content;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createPin(ads[i], template));
  }

  return fragment;

}

// ф-ия создает одну метку
function createPin(pinObject, template) {
  var pin = template.cloneNode(true);

  // Кнопка
  var button = pin.querySelector('.map__pin');
  button.style = PIN_LOCATION.replace('{{location.x}}', pinObject.location.x - Math.round(PIN_WIDTH / 2)).replace('{{location.y}}', pinObject.location.y - PIN_HEIGHT); // с учетом размеров самого пина

  // Иконка
  var img = pin.querySelector('img');
  img.src = pinObject.author.avatar;
  img.alt = pinObject.offer.title;

  return pin;

}

// ф-ия возвращает русское название типа жтлья
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

// ф-ия придает читабельный вид для количества комнат
function getGoodRoomText(number) {
  var room = 'комнат';

  if (number === 1) {
    room = 'комната';
  } else if (number > 1 & number <= 4) {
    room = 'комнаты';
  }
  return room;
}

// ф-ия придает читабельный вид для количества гостей
function getGoodGuestText(number) {
  var room = 'гостей';

  if (number === 1) {
    room = 'гостя';
  }
  return room;
}

function fillFeatures(features, featArr) {
  var feature = features.querySelectorAll('.popup__feature');

  // удалим существующие узлы
  for (var i = 0; i < feature.length; i++) {
    features.removeChild(feature[i]);
  }

  // добавим из featArr
  for (i = 0; i < featArr.length; i++) {
    var elementHTML = '<li class="popup__feature popup__feature--{{feature}}"></li>'.replace('{{feature}}', featArr[i]);
    features.insertAdjacentHTML('beforeend', elementHTML);
  }

}

function fillPhoto(photos, photoArr) {
  var photo = photos.querySelectorAll('.popup__photo');

  // удалим существующие узлы
  for (var i = 0; i < photo.length; i++) {
    photos.removeChild(photo[i]);
  }

  // добавим из photoArr
  for (i = 0; i < photoArr.length; i++) {
    var elementHTML = '<img src="{{src}}" class="popup__photo" width="45" height="40" alt="Фотография жилья">'.replace('{{src}}', photoArr[i]);
    photos.insertAdjacentHTML('beforeend', elementHTML);
  }

}

// ф-ия создает DOM-element объявления
function getadvCard(adv) {
  var template = document.getElementById('card').content;
  var card = template.cloneNode(true);
  var strCapacity = STR_ROOM_GUEST.replace('{{offer.rooms}}', adv.offer.rooms).replace('{{offer.guests}}', adv.offer.guests).replace('{{room}}}', getGoodRoomText(adv.offer.rooms)).replace('{{guest}}', getGoodGuestText(adv.offer.guests));
  var strCheckInOut = STR_CHECK_IN_OUT.replace('{{offer.checkin}}', adv.offer.checkin).replace('{{offer.checkout}}', adv.offer.checkout);

  card.querySelector('.popup__title').textContent = adv.offer.title;
  card.querySelector('.popup__text--address').textContent = adv.offer.address;
  card.querySelector('.popup__text--price').textContent = adv.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = getDwellingTypeRus(adv.offer.type);
  card.querySelector('.popup__text--capacity').textContent = strCapacity;
  card.querySelector('.popup__text--time').textContent = strCheckInOut;

  // доступные удобства
  var features = card.querySelector('.popup__features');
  fillFeatures(features, adv.offer.features);

  card.querySelector('.popup__description').textContent = adv.offer.description;

  // фото
  var photos = card.querySelector('.popup__photos');
  fillPhoto(photos, adv.offer.photos);

  // аватар
  card.querySelector('.popup__avatar').src = adv.author.avatar;

  return card;
}

// Точка входа
// массив объектов объявлений
var ads = fillAdsArray(8);

// 1. Уберем класс .map--faded
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// 2. Создадим DOM элементы меток
var pinContainer = createPins(ads);

// 3. Отрисуем сгенерированные DOM-элементы в блок .map__pins
// 3.1. Чистка блока от старых пинов
var mapPins = document.querySelector('.map__pins').querySelectorAll('.map__pin');

for (var i = 0; i < mapPins.length; i++) {
  if (!mapPins[i].classList.contains('map__pin--main')) {
    mapPins[i].remove();
  }
}

// 3.2. Добавляем в блок
document.querySelector('.map__pins').appendChild(pinContainer);

// 4. Объявление
var advCard = getadvCard(ads[0]);

// 5. Вставим перед в блок .map блоком .map__filters-container
map.insertBefore(advCard, map.querySelector('.map__filters-container'));
