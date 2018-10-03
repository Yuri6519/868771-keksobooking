// создание и отрисовка карточки

'use strict';

(function () {

  // шаблон строки для вывода комнат и гостей
  var STR_ROOM_GUEST = '{{offer.rooms}} {{room}}} для {{offer.guests}} {{guest}}';

  // шаблон времени заезда и выезда
  var STR_CHECK_IN_OUT = 'Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}';

  var dwellingTypes = ['palace', 'flat', 'house', 'bungalo'];
  var dwellingTypesRus = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

  // чистка от прежних объявлений
  function removeOldAds() {
    var mapAds = document.querySelector('.map').querySelectorAll('.map__card');

    for (var i = 0; i < mapAds.length; i++) {
      mapAds[i].remove();
    }

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

  function procesCardBtnCloseClick() {
    removeOldAds();
    window.pin.setPinNonactive();
    document.removeEventListener('keydown', onDocKeyDown);
  }

  // событие по нажатию клавиши
  function onDocKeyDown(evt) {
    if (evt.keyCode === window.utils.KEY_ESCAPE) {
      procesCardBtnCloseClick();
    }
  }


  window.card = {
    removeOldAds: removeOldAds,
    getadvCard: getadvCard,
    dwellingTypes: dwellingTypes

  };

})();
