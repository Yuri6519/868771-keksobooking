'use strict';

// коды кнопок
// var KEY_RETURN = 13;
var KEY_ESCAPE = 27;

// форма
var FORM_ACTION = 'https://js.dump.academy/keksobooking';
var FORM_METHOD = 'post';
var FORM_ENCTYPE = 'multipart/form-data';

// шаблон адреса картинки аватара
var STR_AVATAR_ADDR = 'img/avatars/user{{xx}}.png';

// шаблон для строк фото (каждая строка имеет одинаковую стуктуру, различие только в цифрах hotel1, hotel2, hotel3, поэтому массив создаю на лету в произвольном порядке. Для  этого и нужен шаблон)
var STR_DWELLING_PHOTO = 'http://o0.github.io/assets/images/tokyo/hotel{{xx}}.jpg';

// шаблон строки для вывода комнат и гостей
var STR_ROOM_GUEST = '{{offer.rooms}} {{room}}} для {{offer.guests}} {{guest}}';

// шаблон времени заезда и выезда
var STR_CHECK_IN_OUT = 'Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}';

// обычная метка - pin
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

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

// pin ID
var PIN_ID = 'pinid';

// массив объявлений
var ads = [];

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


// ф- ия возвращает строку со случайно выбранным адресом аватара, если все адреса разобраны, возвращает пустую строку (по идее, надо генерить исключение, все номера разобраны).
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
function createPins() {
  var template = document.querySelector('#pin').content;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createPin(i, ads[i], template));
  }

  return fragment;

}

// создает и инициализирует атрибут у объекта
function setObjectAttribute(obj, attrName, atrValue) {
  var attr = document.createAttribute(attrName);
  attr.value = atrValue;
  obj.attributes.setNamedItem(attr);
}

// читает атрибут
function getAttributeValue(element, attrName) {
  var value;
  for (var i = 0; i < element.attributes.length; i++) {
    if (element.attributes[i].name === attrName) {
      value = element.attributes[i].value;
    }
  }
  return value;
}

// чистка от прежних объявлений
function removeOldAds() {
  var mapAds = document.querySelector('.map').querySelectorAll('.map__card');

  for (var i = 0; i < mapAds.length; i++) {
    mapAds[i].remove();
  }

}

// обработка клика на метке
function processPinClick(evt) {
  var button = evt.currentTarget;
  var pinId = getAttributeValue(button, PIN_ID);

  // удалим старую карточку
  removeOldAds();

  // сделаем предыдущую активную метку неактивной (если был клик до этого)
  setPinNonactive();

  // сделаем метку активной
  button.classList.add('map__pin--active');

  // карточка
  var advCard = getadvCard(ads[pinId]);

  // 5. Вставим перед в блок .map блоком .map__filters-container
  var map = document.querySelector('.map');
  map.insertBefore(advCard, map.querySelector('.map__filters-container'));

}

// ф-ия создает одну метку
function createPin(index, pinObject, template) {
  var pin = template.cloneNode(true);

  // Кнопка
  var button = pin.querySelector('.map__pin');
  button.style.left = (pinObject.location.x - Math.round(PIN_WIDTH / 2)) + 'px'; // с учетом размеров самого пина
  button.style.top = (pinObject.location.y - PIN_HEIGHT) + 'px'; // с учетом размеров самого пина

  // добавим ИД элемента для связки с событием
  setObjectAttribute(button, PIN_ID, index);

  // событие клика
  button.addEventListener('click', function (evt) {
    processPinClick(evt);
  });

  // Иконка
  var img = pin.querySelector('img');
  img.src = pinObject.author.avatar;
  img.alt = pinObject.offer.title;

  return pin;

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
    var elLi = document.createElement('li');
    elLi.classList.add('popup__feature');
    elLi.classList.add('popup__feature--' + featArr[i]);
    features.appendChild(elLi);
  }

  if (feature.length === 0) {
    feature.hidden = true;
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
    var elImg = document.createElement('img');
    elImg.classList.add('popup__photo');
    elImg.width = 45;
    elImg.height = 40;
    elImg.alt = 'Фотография жилья';
    elImg.src = photoArr[i];
    photos.appendChild(elImg);
  }

  if (photo.length === 0) {
    photo.hidden = true;
  }


}

function setPinNonactive() {
  // в каждый момент времени может быть активна только одна метка
  var activePin = document.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
}

function procesCardBtnCloseClick() {
  removeOldAds();
  setPinNonactive();
  document.removeEventListener('keydown', onDocKeyDown);
}

// событие по нажатию клавиши
function onDocKeyDown(evt) {
  if (evt.keyCode === KEY_ESCAPE) {
    procesCardBtnCloseClick();
  }
}

// ф-ия создает DOM-element объявления
function getadvCard(adv) {
  var template = document.querySelector('#card').content;
  var card = template.cloneNode(true);
  var strCapacity = STR_ROOM_GUEST.replace('{{offer.rooms}}', adv.offer.rooms).replace('{{offer.guests}}', adv.offer.guests).replace('{{room}}}', getGoodRoomText(adv.offer.rooms)).replace('{{guest}}', getGoodGuestText(adv.offer.guests));
  var strCheckInOut = STR_CHECK_IN_OUT.replace('{{offer.checkin}}', adv.offer.checkin).replace('{{offer.checkout}}', adv.offer.checkout);

  if (adv.offer.title) {
    card.querySelector('.popup__title').textContent = adv.offer.title;
  } else {
    card.querySelector('.popup__title').hidden = true;
  }

  if (adv.offer.address) {
    card.querySelector('.popup__text--address').textContent = adv.offer.address;
  } else {
    card.querySelector('.popup__text--address').hidden = true;
  }

  if (adv.offer.price) {
    card.querySelector('.popup__text--price').textContent = adv.offer.price + '₽/ночь';
  } else {
    card.querySelector('.popup__text--price').hidden = true;
  }

  if (adv.offer.type) {
    card.querySelector('.popup__type').textContent = getDwellingTypeRus(adv.offer.type);
  } else {
    card.querySelector('.popup__type').hidden = true;
  }

  if (strCapacity) {
    card.querySelector('.popup__text--capacity').textContent = strCapacity;
  } else {
    card.querySelector('.popup__text--capacity').hidden = true;
  }

  if (strCheckInOut) {
    card.querySelector('.popup__text--time').textContent = strCheckInOut;
  } else {
    card.querySelector('.popup__text--time').hidden = true;
  }

  // доступные удобства
  var features = card.querySelector('.popup__features');
  fillFeatures(features, adv.offer.features);

  if (adv.offer.description) {
    card.querySelector('.popup__description').textContent = adv.offer.description;
  } else {
    card.querySelector('.popup__description').hidden = true;
  }

  // фото
  var photos = card.querySelector('.popup__photos');
  fillPhoto(photos, adv.offer.photos);

  // аватар
  if (adv.author.avatar) {
    card.querySelector('.popup__avatar').src = adv.author.avatar;
  } else {
    card.querySelector('.popup__avatar').hidden = true;
  }

  // кнопка "Закрыть"
  // регистрация события закрытия объявления
  var btnAdClose = card.querySelector('.popup__close');

  btnAdClose.addEventListener('click', function () {
    procesCardBtnCloseClick();
  });

  document.addEventListener('keydown', onDocKeyDown);

  return card;
}

function removeAllPins() {
  var mapPins = document.querySelector('.map__pins').querySelectorAll('.map__pin');

  for (var i = 0; i < mapPins.length; i++) {
    if (!mapPins[i].classList.contains('map__pin--main')) {
      mapPins[i].remove();
    }
  }
}

// показ похожих объявлений
function showSimilarAds() {
  // инициализируем, то что затерли
  if (avatarNums.length === 0) {
    avatarNums = avatarNumsSave.slice();
  }

  if (titleData.length === 0) {
    titleData = titleDataSave.slice();
  }

  // массив объектов объявлений
  ads = fillAdsArray(8);

  // 2. Создадим DOM элементы меток
  var pinContainer = createPins(ads);

  // 3. Отрисуем сгенерированные DOM-элементы в блок .map__pins
  // 3.1. Чистка блока от старых пинов
  removeAllPins();

  // 3.2. Добавляем в блок
  document.querySelector('.map__pins').appendChild(pinContainer);

}

// тестовая инициализация карты
// function initMapTest() {
// 1. Уберем класс .map--faded
// var map = document.querySelector('.map');
// map.classList.remove('map--faded');

// showSimilarAds();

// // 4. Объявление
// var advCard = getadvCard(ads[0]);

// // 5. Вставим перед в блок .map блоком .map__filters-container
// map.insertBefore(advCard, map.querySelector('.map__filters-container'));

// }

// ф-ия блокирует/разблокирует карту
function toggleMapAbility(isNotFaded) {
  var map = document.querySelector('.map');
  if (isNotFaded) {
    map.classList.remove('map--faded');
  } else {
    map.classList.add('map--faded');
  }

}

// ф-ия блокирует/разблокирует форму добавления объявления
function toggleAdFormAbility(isEnabled) {
  // form
  var adForm = document.querySelector('.ad-form');
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
  toggleAdFormAbility(isActive);
  toggleFilterFormAbility(isActive);
  toggleMapAbility(isActive);
}

function getAddressStr(addrX, addrY) {
  document.querySelector('.ad-form').querySelector('#address').value = addrX + ', ' + addrY;
}

// установка значения адреса (острый конец метки)
function setAddress() {
  // evt использоваться будет далее (скорее всего) для определения координат курсора мыши
  // сейчас нет перетаскивания, считаем координаты неизменными
  // var mainPin = document.querySelector('.map__pin--main');

  // координаты хвоста относительно верхнего левого угла без учета движения мыши
  var tailX = mainPinLeft + Math.round(mainPinWidth / 2);
  var tailY = mainPinTop + mainPinFullHeight;

  getAddressStr(tailX, tailY);
}

// Обработка mouseup на главной метке
function processMainPinMouseUp() {
  removeOldAds();
  toggleMainFormActivity(true);
  setAddress();
  showSimilarAds();
}

// событие щелчка на главной метке
function onMainPinMouseUp(evt) {
  processMainPinMouseUp();
  evt.currentTarget.removeEventListener('mouseup', onMainPinMouseUp);
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

// обработка события на выбор типа жилья
function processDwellTypeChange(selectDwelType) {
  var options = selectDwelType.querySelectorAll('option');
  if (options.length > 0 & selectDwelType.selectedIndex >= 0) {
    var option = options[selectDwelType.selectedIndex];
    var adPrice = document.querySelector('.ad-form').querySelector('#price');
    adPrice.min = getMinDwellPrice(option.value);
    adPrice.placeholder = adPrice.min;
  }
}

// установка элемента времени выезда/заезда
function setCheckTime(index, id) {
  var localId = id === 'timein' ? '#timeout' : '#timein';
  var checkTimeOptions = document.querySelector('.ad-form').querySelector(localId).querySelectorAll('option');
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
    var localCapOptions = document.querySelector('.ad-form').querySelector('#capacity').querySelectorAll('option');

    // уберем все элементы
    for (i = 0; i < localCapOptions.length; i++) {
      localCapOptions[i].hidden = true;
      localCapOptions[i].selected = false;
    }

    // ничего не выбрано
    document.querySelector('.ad-form').querySelector('#capacity').selectedIndex = -1;

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
  document.querySelector('.ad-form').querySelector('#title').value = '';

  // тип и цена (по умолчанию выберем Квартира = 1000)
  document.querySelector('.ad-form').querySelector('#price').value = '';
  document.querySelector('.ad-form').querySelector('#type').selectedIndex = 1;
  processDwellTypeChange(document.querySelector('.ad-form').querySelector('#type'));

  // кол-во комнат и кол-во мест
  // по умолчанию установим максимально (3 комнаты для 1, 2, 3 гостей)
  document.querySelector('.ad-form').querySelector('#room_number').selectedIndex = 2;
  document.querySelector('.ad-form').querySelector('#capacity').selectedIndex = -1;
  processRoomChange(document.querySelector('.ad-form').querySelector('#room_number'));

  // время заезда - выезда
  document.querySelector('.ad-form').querySelector('#timein').selectedIndex = 0;
  document.querySelector('.ad-form').querySelector('#timeout').selectedIndex = 0;

  // адрес - очистим от сарых значений (установка в отдельной ф-ии)
  document.querySelector('.ad-form').querySelector('#address').value = '';

  // описание
  document.querySelector('.ad-form').querySelector('#description').value = '';

  // особенности
  var features = document.querySelector('.features').querySelectorAll('input');
  for (var i = 0; i < features.length; i++) {
    if (features[i].type === 'checkbox') {
      features[i].checked = false;
    }
  }

  // очистка фото аватара - как именно чистить это поле?

  // очистка фото жилья - как именно чистить это поле?

}

function onButtonResetClick() {
  processResetButtonClick();
}

// обработка reset
function processResetButtonClick() {
  // уберем похожие объявления
  removeOldAds();

  // очистим пины
  removeAllPins();

  // уберем событие на кнопке reset, так как оно инициализируется в initMap
  document.querySelector('.ad-form__reset').removeEventListener('click', onButtonResetClick);

  // инициализируем
  initMap();

}

// ф-ия проверяет и установливает ограничения на поля ввода
function setRulesForInputFields() {
  // форма
  var adForm = document.querySelector('.ad-form');
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


// инициализация
function initMap() {
  // перевод формы в неактивное состояние
  // блок с картой .map содержит класс map--faded;
  // форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
  // все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset.
  // форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form
  toggleMainFormActivity(false);

  // проверка и установка ограничений на поля ввода
  setRulesForInputFields();

  // главная метка
  var mainPin = document.querySelector('.map__pin--main');

  // регистрация события mouseup на главной метке
  mainPin.addEventListener('mouseup', onMainPinMouseUp);

  // начальное значение поля address ТЗ:
  // насчёт определения координат метки в этом случае нет никаких инструкций, ведь в неактивном режиме страницы метка круглая, поэтому мы можем взять за исходное значение поля адреса середину метки.

  // верхний левый угол главной метки - left
  mainPinLeft = parseInt(mainPin.style.left, 10);
  // верхний левый угол главной метки - top
  mainPinTop = parseInt(mainPin.style.top, 10);
  // координата X середины главной метки
  mainPinMiddleX = mainPinLeft + Math.round(mainPinWidth / 2); // только целые?
  // координата Y середины главной метки
  mainPinMiddleY = mainPinTop + Math.round((mainPinHeight / 2)); // только целые?

  getAddressStr(mainPinMiddleX, mainPinMiddleY);

  // кнопка reset
  document.querySelector('.ad-form__reset').addEventListener('click', onButtonResetClick);

}


// Точка входа
// Вынес предыдущие вывод меток и активацию карты в отдельный метод для теста, если пригодится потом
// initMapTest();

// Инициализация
initMap();


