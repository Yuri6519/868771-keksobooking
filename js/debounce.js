// функция устранения "дребезга"

'use strict';

(function () {
  var lastTimer;

  function delay(func, delayInterval) {

    if (lastTimer) {
      window.clearTimeout(lastTimer);
    }

    lastTimer = window.setTimeout(func, delayInterval);
  }

  window.debounce = {
    delay: delay
  };

})();
