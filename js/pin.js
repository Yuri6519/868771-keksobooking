// работа с пинами

'use strict';

(function () {
  // pin ID
  var PIN_ID = 'pinid';

  // обычная метка - pin
  var PIN_WIDTH = 50;

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

  function setPinNonactive() {
    // в каждый момент времени может быть активна только одна метка
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  }

  // обработка клика на метке
  function processPinClick(evt) {
    var button = evt.currentTarget;
    var pinId = getAttributeValue(button, PIN_ID);

    // удалим старую карточку
    window.card.removeOldAds();

    // сделаем предыдущую активную метку неактивной (если был клик до этого)
    setPinNonactive();

    // сделаем метку активной
    button.classList.add('map__pin--active');

    // карточка
    var advCard = window.card.getadvCard(window.data.getFilteredAdsById(pinId));

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
    button.style.top = (pinObject.location.y) + 'px';

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

  // ф-ия возвращает фрагмент с метками
  function createPins(ads) {
    var template = document.querySelector('#pin').content;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(createPin(i, ads[i], template));
    }

    return fragment;

  }

  function removeAllPins() {
    var mapPins = document.querySelector('.map__pins').querySelectorAll('.map__pin');

    for (var i = 0; i < mapPins.length; i++) {
      if (!mapPins[i].classList.contains('map__pin--main')) {
        mapPins[i].remove();
      }
    }
  }


  window.pin = {

    createPins: createPins,
    removeAllPins: removeAllPins,
    setPinNonactive: setPinNonactive

  };

})();
