// создание и отрисовка карточки

'use strict';

(function () {

  // шаблон строки для вывода комнат и гостей
  var STR_ROOM_GUEST = '{{offer.rooms}} {{room}}} для {{offer.guests}} {{guest}}';

  // шаблон времени заезда и выезда
  var STR_CHECK_IN_OUT = 'Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}';

  // лабел для цены жилья
  var PRICE_LABEL = '₽/ночь';

  // фото
  var PIN_ALT = 'Фотография жилья';

  var dwellingTypes = {
    'palace': {nameRus: 'Дворец', minPrice: 10000},
    'flat': {nameRus: 'Квартира', minPrice: 1000},
    'house': {nameRus: 'Дом', minPrice: 5000},
    'bungalo': {nameRus: 'Бунгало', minPrice: 0}
  };

  // чистка от прежних объявлений
  function removeOldAds() {
    var mapAds = document.querySelector('.map').querySelectorAll('.map__card');

    [].forEach.call(mapAds, function (itr) {
      itr.remove();
    });

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
    var guest = 'гостей';

    if (number === 1) {
      guest = 'гостя';
    }
    return guest;
  }

  // ф-ия возвращает русское название типа жилья
  function getDwellingTypeRus(typeStr) {
    return dwellingTypes[typeStr].nameRus;
  }

  function fillFeatures(features, featArr) {
    var feature = features.querySelectorAll('.popup__feature');

    [].forEach.call(feature, function (itr) {
      itr.remove();
    });

    var fragment = document.createDocumentFragment();

    // добавим из featArr
    featArr.forEach(function (itr) {
      var elLi = document.createElement('li');
      elLi.classList.add('popup__feature');
      elLi.classList.add('popup__feature--' + itr);
      fragment.appendChild(elLi);
    });

    features.appendChild(fragment);

    if (feature.length === 0) {
      feature.hidden = true;
    }

  }

  function fillPhoto(photos, photoArr) {
    var photo = photos.querySelectorAll('.popup__photo');

    // удалим существующие узлы
    [].forEach.call(photo, function (itr) {
      itr.remove();
    });

    var fragment = document.createDocumentFragment();

    // добавим из photoArr
    photoArr.forEach(function (itr) {
      var elImg = document.createElement('img');
      elImg.classList.add('popup__photo');
      elImg.width = 45;
      elImg.height = 40;
      elImg.alt = PIN_ALT;
      elImg.src = itr;
      fragment.appendChild(elImg);
    });

    photos.appendChild(fragment);

    if (photo.length === 0) {
      photo.hidden = true;
    }

  }

  // ф-ия запоняет отдельный элемент объявления
  function setData(selector, content, isSrc) {
    if (content) {
      if (isSrc) {
        selector.src = content;
      } else {
        selector.textContent = content;
      }
    } else {
      selector.hidden = true;
    }
  }

  // ф-ия создает и возвращает DOM-element объявления
  function get(adv) {
    var template = document.querySelector('#card').content;
    var card = template.cloneNode(true);
    var strCapacity = STR_ROOM_GUEST.replace('{{offer.rooms}}', adv.offer.rooms).replace('{{offer.guests}}', adv.offer.guests).replace('{{room}}}', getGoodRoomText(adv.offer.rooms)).replace('{{guest}}', getGoodGuestText(adv.offer.guests));
    var strCheckInOut = STR_CHECK_IN_OUT.replace('{{offer.checkin}}', adv.offer.checkin).replace('{{offer.checkout}}', adv.offer.checkout);

    setData(card.querySelector('.popup__title'), adv.offer.title);

    setData(card.querySelector('.popup__text--address'), adv.offer.address);

    setData(card.querySelector('.popup__text--price'), adv.offer.price + PRICE_LABEL);

    setData(card.querySelector('.popup__type'), getDwellingTypeRus(adv.offer.type));

    setData(card.querySelector('.popup__text--capacity'), strCapacity);

    setData(card.querySelector('.popup__text--time'), strCheckInOut);

    // доступные удобства
    var features = card.querySelector('.popup__features');
    fillFeatures(features, adv.offer.features);

    setData(card.querySelector('.popup__description'), adv.offer.description);

    // фото
    var photos = card.querySelector('.popup__photos');
    fillPhoto(photos, adv.offer.photos);

    // аватар
    setData(card.querySelector('.popup__avatar'), adv.author.avatar, true);

    // кнопка "Закрыть"
    // регистрация события закрытия объявления
    var btnAdClose = card.querySelector('.popup__close');

    btnAdClose.addEventListener('click', function () {
      procesBtnCloseClick();
    });

    document.addEventListener('keydown', onDocKeyDown);

    return card;
  }

  function procesBtnCloseClick() {
    removeOldAds();
    window.pin.setNonactive();
    document.removeEventListener('keydown', onDocKeyDown);
  }

  // событие по нажатию клавиши
  function onDocKeyDown(evt) {
    if (evt.keyCode === window.utils.KEY_ESCAPE) {
      procesBtnCloseClick();
    }
  }

  window.card = {
    removeOldAds: removeOldAds,
    get: get,
    dwellingTypes: dwellingTypes

  };

})();
