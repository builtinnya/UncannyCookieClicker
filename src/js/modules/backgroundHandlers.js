var backgroundHandlers = function (storage, notifications) {

  return {
    handleGreeting: function (args, sender, sendResponse) {
      console.log('Accepted greeting from the embedding page.');
      return sendResponse({ cmd: 'Greeting' });
    },

    handleGreetingEnd: function (args, sender, sendResponse) {
      console.log('Greeting end.');
    },

    handleConfigClient: function (args, sender, sendResponse) {
      storage.get(null, function (items) {
        if (!items)
          return;

        var r = {};

        if (items.autoClickCookie) {
          var interval = items.autoClickCookieInterval || 1;
          r.autoClickCookie = [ interval ];
        }

        if (items.autoClickGoldenCookie)
          r.autoClickGoldenCookie = [];

        if (items.autoClickSeasonPopup)
          r.autoClickSeasonPopup = [];

        if (items.avoidRedCookie)
          r.avoidRedCookie = [];

        if (items.notifyGoldenCookie)
          r.notifyGoldenCookie = [];

        if (items.notifySeasonPopup)
          r.notifySeasonPopup = [];

        if (items.autoBuyUpgrades)
          r.autoBuyUpgrades = [];

        if (items.bypassDialogForUpgrades)
          r.bypassDialogForUpgrades = [];

        if (items.buyRepeatableUpgrades)
          r.buyRepeatableUpgrades = [];

        if (items.notifyUpgrades)
          r.notifyUpgrades = [];

        if (items.speedUpGame) {
          var factor = items.speedUpGameFactor || 1;
          r.speedUpGame = [ factor ];
        }

        if (items.autoBuyBuildings)
          r.autoBuyBuildings = [];

        sendResponse({ cmd: 'ConfigRequest', args: r });
      });

      return true;
    },

    handleGoldenCookieNotification: function (args, sender, sendResponse) {
      notifications.notify('A golden cookie has appeared!');
    },

    handleSeasonPopupNotification: function (args, sender, sendResponse) {
      notifications.notify('A Reindeer has appeared!');
    },

    handleUpgradesNotification: function (args, sender, sendResponse) {
      notifications.notify(args.message);
    }
  };

}(storage, notifications);
