var backgroundHandlers = function (storage, notifications) {

  return {
    handleGreeting: function (args, sender, sendResponse) {
      console.log('Accepted greeting from the embedding page.');
      return sendResponse({ cmd: 'Greeting' });
    },

    handleGreetingEnd: function (args, sender, sendResponse) {
      console.log('Greeting end.');
    },

    handleUpdateBuildingList: function (args, sender, sendResponse) {
      storage.get(null, function (items) {
        var buildingList = args;
        if (!items.buildingList) {
          buildingList.forEach(function (_, index) {
            buildingList[index].autoBuy = true;
          });
        } else {
          buildingList.forEach(function (_, index) {
            var oldValue = items.buildingList[index];
            if (oldValue === undefined || oldValue.autoBuy === undefined)
              buildingList[index].autoBuy = true;
            else
              buildingList[index].autoBuy = oldValue.autoBuy;
          });
        }
        storage.set({ buildingList: buildingList });
      });
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

        if (items.autoPopWrinklers)
          r.autoPopWrinklers = [];

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

        if (items.buildingList)
          r.updateBuildingList = [ items.buildingList ];

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
