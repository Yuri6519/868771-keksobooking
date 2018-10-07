// модуль для работы с фотографиями

'use strict';

(function () {

  // родительский конструктор
  function Photo(elInput, elImage) {
    this.setInputElement(elInput);
    this.setImageElement(elImage);
  }

  Photo.prototype = {
    // массив расширений для загрузки фото
    PHOTO_FILE_EXT: ['gif', 'jpg', 'jpeg', 'png'],

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
      var _fileReader = new FileReader();

      _fileReader.addEventListener('load', this.onFileLoad);

      _fileReader.readAsDataURL(this._elInput.files[0]);

    }

  };

  // конструктор для фото жилья
  function PhotoDwell(elInput, elImage) {
    Photo.call(this, elInput, elImage);
  }

  PhotoDwell.prototype = Object.create(Photo.prototype);

  PhotoDwell.prototype._photos = [];
  PhotoDwell.prototype._sortPhotos = [];

  // добавляет фото в массив
  PhotoDwell.prototype.addPhoto = function (data) {
    var res = false;
    var newFileName = this._elInput.files[0].name.toLowerCase();

    // только, если новая фотография
    res = !this._photos.some(function (itr) {
      return itr.fileName === newFileName;
    });

    if (res) {
      var len = this._photos.length;
      this._photos[len] = {
        id: len,
        fileName: newFileName,
        img: data
      };
    }

    return res;

  };

  PhotoDwell.prototype.clearPhotos = function () {
    this._photos = [];
  };

  PhotoDwell.prototype.clearPhotosElements = function (def) {
    var imgList = this._image.querySelectorAll('.ad-form__photo');

    for (var i = 0; i < imgList.length; i++) {
      imgList[i].remove();
    }

    if (def) {
      // для начальной оторисовки вернем на место placeholder
      var elDiv = document.createElement('div');
      elDiv.classList.add('ad-form__photo');
      this._image.appendChild(elDiv);
    }

  };

  PhotoDwell.prototype.onImgMouseDown = function (evt) {

    //evt.preventDefault();

    this._sortPhotos = [];
    this._sortPhotos[0] = evt.currentTarget.id;

    evt.target.addEventListener('mousemove', this.onImgMouseMove.bind(this));


  };

  PhotoDwell.prototype.sortPhotos = function () {
    // если было перетаскивание (mouseup на др. элементе)
    if (this._sortPhotos.length > 0 && this._sortPhotos[0] !== this._sortPhotos[1]) {
      var idFrom = parseInt(this._sortPhotos[0], 10);
      var idTo = parseInt(this._sortPhotos[1], 10);
      var indFrom = -1;
      var indTo = -1;

      for (var i = 0; i < this._photos.length; i++) {
        if (this._photos[i].id === idFrom) {
          indFrom = i;
        } else if (this._photos[i].id === idTo) {
          indTo = i;
        }
      }

      if (indFrom >= 0 && indTo >= 0) {
        var elArrForm = this._photos[indFrom];
        var elArrTo = this._photos[indTo];
        this._photos[indFrom] = elArrTo;
        this._photos[indTo] = elArrForm;
      }

    }

  };

  PhotoDwell.prototype.onImgMouseUp = function (evt) {

    evt.preventDefault();

    if (this._sortPhotos.length === 1) {
      this._sortPhotos[1] = evt.currentTarget.id;

      this.sortPhotos();

      this.showPhotoArray();

      evt.target.removeEventListener('mousemove', this.onImgMouseMove.bind(this));


    }

  };

  PhotoDwell.prototype.onImgMouseMove = function (evt) {
    evt.preventDefault();

    // evt.target.style.left = '-10px';
    // evt.target.style.top = '-20px';

    // console.log(evt.target.style.left);
     console.log(evt.target);

    

  };


  PhotoDwell.prototype.showPhotoArray = function () {
    this.clearPhotosElements();

    for (var i = 0; i < this._photos.length; i++) {
      var elDiv = document.createElement('div');
      elDiv.classList.add('ad-form__photo');

      var elImg = document.createElement('img');
      elImg.classList.add('popup__photo');
      elImg.width = 70;
      elImg.height = 70;
      elImg.alt = this._photos[i].fileName;
      elImg.src = this._photos[i].img;
      elImg.id = this._photos[i].id;

      elImg.addEventListener('mousedown', this.onImgMouseDown.bind(this));
      //elImg.addEventListener('mouseup', this.onImgMouseUp.bind(this));
      elImg.addEventListener('drop', this.onImgMouseUp.bind(this));

      elDiv.appendChild(elImg);
      this._image.appendChild(elDiv);
    }

    console.log(this._photos);


  };

  PhotoDwell.prototype.showPhoto = function (data) {
    // переопределим родительский
    if (this.addPhoto(data)) {
      this.showPhotoArray();
    }
  };





  // аватар пользователя
  var elAvatarInput = document.querySelector('.ad-form__field input[type=file]');
  var elAvatarImage = document.querySelector('.ad-form-header__preview img');
  // объект для работы с загрузкой аватара пользователя
  var photoAvatar = new Photo(elAvatarInput, elAvatarImage);

  // фото жилья
  var elDwellInput = document.querySelector('.ad-form__upload input[type=file]');
  var elDwellImage = document.querySelector('.ad-form__photo-container');
  // объект для работы с загрузкой фото жилья
  var photoDwell = new PhotoDwell(elDwellInput, elDwellImage);

  // инициализация загрузчика аватара
  function initAvatarLoader() {
    // обработчик события onChange при выборе аватарки пользователя
    function onUserFileInputChange() {

      function onFIleLoad(evnt) {
        // показ аватара
        photoAvatar.showPhoto(evnt.currentTarget.result);
      }

      if (photoAvatar.fileLoadCheck()) {
        // файл выбран и расширение подходит
        photoAvatar.onFileLoad = onFIleLoad;

        photoAvatar.fileLoad();

      }

    }

    elAvatarInput.addEventListener('change', onUserFileInputChange);

  }

  // инициализация загрузчика фото жилья
  function initDwellLoader() {

    // обработчик события onChange при выборе фото жилья
    function onDwellFileInputChange() {

      function onFIleLoad(evnt) {
        // показ фото
        photoDwell.showPhoto(evnt.currentTarget.result);
      }

      if (photoDwell.fileLoadCheck()) {
        // файл выбран и расширение подходит
        photoDwell.onFileLoad = onFIleLoad;

        photoDwell.fileLoad();

      }

    }

    elDwellInput.addEventListener('change', onDwellFileInputChange);

  }

  function cleanUp() {
    elAvatarImage.src = 'img/muffin-grey.svg';
    photoDwell.clearPhotos();
    photoDwell.clearPhotosElements(true);


  }

  function initLoader() {
    initAvatarLoader();
    initDwellLoader();
  }

  window.photo = {
    initLoader: initLoader,
    cleanUp: cleanUp
  };

})();

