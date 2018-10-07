// модуль для работы с фотографиями

'use strict';

(function () {

  // родительский конструктор
  function Photo() {}

  Photo.prototype = {
    // массив расширений для загрузки фото
    PHOTO_FILE_EXT: ['gif', 'jpg', 'jpeg', 'png'],

    _fileReader: undefined,

    // сеттер для поля _elInput
    setInputElement: function (input) {
      this._elInput = input;
    },

    // сеттер для поля _image
    setImageElement: function (image) {
      this._image = image;
    },

    // проверка расширения файла
    isFileExtMatch: function (fileName) {
      return this.PHOTO_FILE_EXT.some(function (itr) {
        return fileName.endsWith(itr);
      });
    },

    // проверка выбора файла
    fileLoadCheck: function () {
      return this._elInput.files[0] && this.isFileExtMatch(this._elInput.files[0].name.toLowerCase());
    },

    // показ фотографии
    showPhoto: function (data) {
      this._image.src = data;
    },

    // обработчик события загрузки файла
    onFileLoad: function () {},

    // загрузка файла
    fileLoad: function () {
      if (!this._fileReader) {
        this._fileReader = new FileReader();
      }

      this._fileReader.addEventListener('load', this.onFileLoad);

      this._fileReader.readAsDataURL(this._elInput.files[0]);

    }

  };




  // точка входа
  var elInput = document.querySelector('.ad-form__field input[type=file]');
  var elImage = document.querySelector('.ad-form-header__preview img');

  console.log(elInput);
  console.log(elImage);

  // объект для работы с загрузкой аватара пользователя
  var photoAvatar = new Photo();

  //
  function onFIleLoad(evt) {
    console.log('photoAvatar.onFileLoad - HERE');
    console.log(evt.currentTarget.result);

    // показ аватара
    photoAvatar.showPhoto(evt.currentTarget.result);


  }

  // обработчик события onChange при выборе аватарки пользователя
  function onUserFileInputChange(evt) {
    photoAvatar.setInputElement(evt.currentTarget);

    if (photoAvatar.fileLoadCheck()) {
      // файл выбран и расширение подходит
      photoAvatar.setImageElement(elImage);

        console.log('photoAvatar.fileLoadCheck - OK');


      photoAvatar.onFileLoad = onFIleLoad;

      photoAvatar.fileLoad();





    }




  }
  
  elInput.addEventListener('change', onUserFileInputChange);



  







})();

