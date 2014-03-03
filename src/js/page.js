;(function (window, gameClient, pageMessaging, pageMessagingClient) {

  var oldOnLoad = window.onload || function () {};

  window.onload = function () {
    if (!window.Game)
      throw 'Error: Game is undefined.';

    if (!window.Game.Init)
      throw 'Error: Game.Init is undefined: This extension may not support this version of Cookie Clicker.';

    var makeBuildingList = function (Game) {
      var buildingList = [];

      Game.ObjectsById.forEach(function (building) {
        buildingList.push({ name: building.name });
      });

      return buildingList;
    };

    var oldGameInit = window.Game.Init;

    // Cookie Clicker calls Game.Init after loading assets asynchronously.
    // So we replace Game.Init to make sure the client will be configured after
    // initialization of Game.
    window.Game.Init = function () {
      // Call the initializer for Cookie Clicker.
      oldGameInit();

      // Now the Game object is initialized.

      // Initialize the game client.
      gameClient.initialize();

      // Initialize the messaging module.
      pageMessaging.pageInitialize();
      // Send information of game objects to the extension.
      pageMessagingClient.sendToExtension({
        cmd: 'UpdateBuildingList',
        args: makeBuildingList(window.Game)
      });
      // Send a request for configuring game client to the extension.
      pageMessagingClient.sendToExtension({ cmd: 'ConfigClient' });
    };

    // Don't forget to trigger the initialization.
    oldOnLoad();
  };

})(window, gameClient, pageMessaging, pageMessagingClient);
