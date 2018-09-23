// модуль содержит общие константы и методы

'use strict';

(function () {
  // коды кнопок
  var KEY_RETURN = 13;
  var KEY_ESCAPE = 27;

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

  // ф-ия возвращает случайное значение из переданного массива
  function getRandomValue(dataArray) {
    return dataArray[Math.round(Math.random() * (dataArray.length - 1))];
  }

  // ф-ия возвращает случайное значение из диапазона значений
  function getRandomValueNum(minValue, maxValue) {
    return Math.round(Math.random().toFixed(1) * (maxValue - minValue) + minValue);
  }


  window.utils = {
    KEY_RETURN: KEY_RETURN,
    KEY_ESCAPE: KEY_ESCAPE,

    setObjectAttribute: setObjectAttribute,
    getAttributeValue: getAttributeValue,
    getRandomValue: getRandomValue,
    getRandomValueNum: getRandomValueNum


  };

  

})();
