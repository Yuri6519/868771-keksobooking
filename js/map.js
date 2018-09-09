'use strict';

// Шаблон адреса картинки аватара
var STR_AVATAR_ADDR = 'img/avatars/user{{xx}}.png';

// массив индексов аватаров
var avatarNums = [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false]];

// массив строк - заголовков предложения
var titleData = [
  ['Большая уютная квартира', false],
  ['Маленькая неуютная квартира', false],
  ['Огромный прекрасный дворец', false],
  ['Маленький ужасный дворец', false],
  ['Красивый гостевой домик', false],
  ['Некрасивый негостеприимный домик', false],
  ['Уютное бунгало далеко от моря', false],
  ['Неуютное бунгало по колено в воде', false]];

// ф- ия возвращает строку с адресом аватара, если все адреса разобраны, возвращает пустую строку (по  идее надо генерить исключение, все номера разобраны)
function getAvatarImagePath() {
  var avatarImgStr = '';

  for (var i = 0; i < avatarNums.length; i++) {
    var arrElement = avatarNums[i];

    if (!arrElement[1]) {
      avatarImgStr = STR_AVATAR_ADDR.replace('{{xx}}', '0' + arrElement[0]);
      arrElement[1] = true;
      break;
    }
  }
  return avatarImgStr;
}

// ф- ия возвращает строку с заголовком предложения, если все адреса разобраны, возвращает пустую строку (по  идее надо генерить исключение, все номера разобраны)
function getOfferTitle() {
  var offerTitleStr = '';

  for (var i = 0; i < titleData.length; i++) {
    var arrElement = titleData[i];

    if (!arrElement[1]) {
      offerTitleStr = arrElement[0];
      arrElement[1] = true;
      break;
    }
  }
  return offerTitleStr;
}
  
  



// ф-ия создает объект author
function createAuthorData() {
  return {avatar: getAvatarImagePath()};
}

// ф-ия создает объект offer
function createOfferData() {
  return {
    title: getOfferTitle()
  };
}

// ф-ия создает объект location
function createlocationData() {

}

// ф-ия создает объект объявления
function createAdvertisementObject() {
  var advertisement;

  advertisement = {
    author: createAuthorData(),
    offer: createOfferData(),
    location: createlocationData(),
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








// Точка входа
//console.log(getRandomValue([1, 2, 3, 4, 5, 6]));
//console.log(getRandomValue(['a', 'd', 'йцук', 'ааауу', 'asxd', 'cdcdc', 'ффыва']));

//console.log('r=' + getAvatarImagePath());

var ads = fillAdsArray(8);

console.log(ads);



