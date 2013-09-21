;(function (window, document, pageMessaging) {

  var oldOnLoad = window.onload || function () {};

  window.onload = function () {
    oldOnLoad();
    pageMessaging.pageInitialize();
    pageMessaging.sendToExtension({ cmd: 'Greeting' });
  };

})(window, document, pageMessaging);
