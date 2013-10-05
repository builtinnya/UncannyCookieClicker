;(function (window, pageMessaging, pageMessagingClient) {

  var oldOnLoad = window.onload || function () {};

  window.onload = function () {
    if (!window.Game)
      throw 'Error: Game is undefined.';

    if (!window.Game.Init)
      throw 'Error: Game.Init is undefined: This extension may not support this version of Cookie Clicker.';

    var oldGameInit = window.Game.Init;

    // Cookie Clicker calls Game.Init after loading assets asynchronously.
    // So we replace Game.Init to make sure the client will be configured after
    // initialization of Game.
    window.Game.Init = function () {
      // Call the initializer for Cookie Clicker.
      oldGameInit();

      // Then initialize the messaging module and the game client.
      pageMessaging.pageInitialize();
      pageMessagingClient.sendToExtension({ cmd: 'ConfigClient' });
    };

    // Don't forget to trigger the initialization.
    oldOnLoad();
  };

})(window, pageMessaging, pageMessagingClient);
