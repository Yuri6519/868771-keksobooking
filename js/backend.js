// запросы к серверу

'use strict';

(function () {

  var url = 'https://js.dump.academy/keksobooking';

  // с помощью XMLHttpRequest
  function loadData(onLoad, onError) {
    processRequest(onLoad, onError, 'GET', url + '/data');
  }

  function saveData(data, onLoad, onError) {
    processRequest(onLoad, onError, 'POST', url, data);
  }

  // общий обработчик запросов к серверу
  function processRequest(onLoad, onError, method, reqUrl, data) {
    try {
      var req = new XMLHttpRequest();
      req.responseType = 'json';

      // общий листенер на успех - ошибку
      req.addEventListener('load', function () {
        switch (req.status) {
          case 200:
            onLoad(req.response);
            break;
          default: onError('Ошибка выполнения запроса к серверу. Статус: ' + req.status + ', текст: ' + req.statusText);
        }
      });

      // на соединение
      req.addEventListener('error', function () {
        onError('Ошибка соединения. Повторите запрос позже');
      });

      // на timeout
      req.addEventListener('timeout', function () {
        onError('Время запроса к серверу истекло. Запрос не успел выполнится за ' + req.timeout + 'мс');
      });

      req.timeout = 30000; // 30сек
      req.open(method, reqUrl);

      if (method === 'POST') {
        req.send(data);
      } else if (method === 'GET') {
        req.send();
      } else {
        throw new Error('неизвестный метод: ' + method);
      }

    } catch (err) {
      onError('Глобальная ошибка при работе с сервером: ' + err);
    }
  }

  window.backend = {
    loadData: loadData,
    saveData: saveData

  };


})();
