;(function (window, pageMessaging, pageMessagingClient) {

  var oldOnLoad = window.onload || function () {};

  var initialize = function () {
    pageMessaging.pageInitialize();
    pageMessagingClient.sendToExtension({ cmd: 'ConfigClient' });
  };

  window.onload = function () {
    // Old `window.onload` initializes `Game` object.
    oldOnLoad();
    // Now we can use `Game` object to play the game!
    initialize();
  };

})(window, pageMessaging, pageMessagingClient);
