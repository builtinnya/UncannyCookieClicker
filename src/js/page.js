;(function (window, document, pageMessaging, messagingClient) {

  var oldOnLoad = window.onload || function () {};

  window.onload = function () {
    oldOnLoad();
    pageMessaging.pageInitialize();
  };

})(window, document, pageMessaging, messagingClient);
