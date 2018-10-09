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
    onFileLoad: function (evt) {
      this.showPhoto(evt.currentTarget.result);
    },

    // загрузка файла
    fileLoad: function () {
      var _fileReader = new FileReader();

      _fileReader.addEventListener('load', this.onFileLoad.bind(this));

      _fileReader.readAsDataURL(this._elInput.files[0]);

    },

    onInputChange: function () {

      if (this.fileLoadCheck()) {
        // файл выбран и расширение подходит
        this.fileLoad();
      }
    },

    // инициализация
    init: function () {
      this._elInput.addEventListener('change', this.onInputChange.bind(this));
    }

  };

  // конструктор для аватара
  function PhotoAvatar(elInput, elImage) {
    Photo.call(this, elInput, elImage);
  }
  PhotoAvatar.prototype = Object.create(Photo.prototype);

  PhotoAvatar.prototype.init = function () {
    // частично переопределим родительский метод
    Photo.prototype.init.call(this);

    this._image.src = 'img/muffin-grey.svg';

  };

  // конструктор для фото жилья
  function PhotoDwell(elInput, elImage) {
    Photo.call(this, elInput, elImage);
  }

  PhotoDwell.prototype = Object.create(Photo.prototype);

  PhotoDwell.prototype._photos = [];

  PhotoDwell.prototype.init = function () {
    // частично переопределим родительский метод
    Photo.prototype.init.call(this);

    this.clearPhotos();
    this.clearPhotosElements(true);

  };


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
    [].forEach.call(imgList, function (itr) {
      itr.remove();
    });

    if (def) {
      // для начальной оторисовки вернем на место placeholder
      var elDiv = document.createElement('div');
      elDiv.classList.add('ad-form__photo');
      this._image.appendChild(elDiv);
    }

  };

  PhotoDwell.prototype.sortPhotos = function (idFrom, idTo) {
    // если было перетаскивание (mouseup на др. элементе)
    if (idFrom !== idTo) {
      var indFrom = -1;
      var indTo = -1;

      this._photos.forEach(function (itr, index) {
        if (itr.id === idFrom) {
          indFrom = index;
        } else if (itr.id === idTo) {
          indTo = index;
        }
      });

      if (indFrom >= 0 && indTo >= 0) {
        var elArrForm = this._photos[indFrom];
        var elArrTo = this._photos[indTo];
        this._photos[indFrom] = elArrTo;
        this._photos[indTo] = elArrForm;
      }

    }

  };

  PhotoDwell.prototype.onDragStart = function (evt) {
    evt.target.style.opacity = '0.4';
    evt.dataTransfer.effectAllowed = 'move';

    evt.dataTransfer.setData('data', evt.target.id);

  };

  PhotoDwell.prototype.onDragOver = function (evt) {
    evt.preventDefault();

    evt.dataTransfer.dropEffect = 'move';
  };

  PhotoDwell.prototype.onDragEnter = function (evt) {
    evt.preventDefault();

    this.classList.add('over');

  };

  PhotoDwell.prototype.onDragLeave = function (evt) {
    evt.preventDefault();

    this.classList.remove('over');

  };

  PhotoDwell.prototype.onDrop = function (evt) {
    evt.preventDefault();

    evt.target.classList.remove('over');

    var idFrom = parseInt(evt.dataTransfer.getData('data'), 10);
    var idTo = parseInt(evt.target.id, 10);

    this.sortPhotos(idFrom, idTo);
    this.showPhotoArray();

  };

  PhotoDwell.prototype.onDragEnd = function (evt) {
    evt.preventDefault();

    this.style.opacity = '1';

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
      elImg.draggable = true;

      // события drag n drop
      elImg.addEventListener('dragstart', this.onDragStart);
      elImg.addEventListener('dragenter', this.onDragEnter);
      elImg.addEventListener('dragover', this.onDragOver);
      elImg.addEventListener('dragleave', this.onDragLeave);
      elImg.addEventListener('drop', this.onDrop.bind(this));
      elImg.addEventListener('dragend', this.onDragEnd);


      elDiv.appendChild(elImg);
      this._image.appendChild(elDiv);
    }

  };

  PhotoDwell.prototype.showPhoto = function (data) {
    // переопределим родительский
    if (this.addPhoto(data)) {
      this.showPhotoArray();
    }
  };

  // инициализация загрузчика аватара
  function initAvatarLoader() {
    var elAvatarInput = document.querySelector('.ad-form__field input[type=file]');
    var elAvatarImage = document.querySelector('.ad-form-header__preview img');
    // объект для работы с загрузкой аватара пользователя
    var photoAvatar = new PhotoAvatar(elAvatarInput, elAvatarImage);
    photoAvatar.init();
  }

  // инициализация загрузчика фото жилья
  function initDwellLoader() {
    // фото жилья
    var elDwellInput = document.querySelector('.ad-form__upload input[type=file]');
    var elDwellImage = document.querySelector('.ad-form__photo-container');
    // объект для работы с загрузкой фото жилья
    var photoDwell = new PhotoDwell(elDwellInput, elDwellImage);
    photoDwell.init();
  }

  function initLoader() {
    initAvatarLoader();
    initDwellLoader();
  }

  window.photo = {
    initLoader: initLoader
  };

})();

