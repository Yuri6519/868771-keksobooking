// функция устранения "дребезга"

'use strict';

(function () {

  function delay(func, delayInterval) {
    var lastTimer;

    return function () {
      var args = arguments;

      if (lastTimer) {
        window.clearTimeout(lastTimer);
      }

      lastTimer = window.setTimeout(function () {
        func.apply(null, args);
      }, delayInterval);
    };

  }

  window.debounce = {
    delay: delay
  };

})();
