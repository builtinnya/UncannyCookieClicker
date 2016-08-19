var gameClient = function (WatchJS, Game, pageMessagingClient) {

  // See: http://stackoverflow.com/questions/646628/javascript-startswith
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }

  // `Game` is the main object for CookieClicker.
  if (!Game)
    throw 'Error: object `Game` is undefined.';

  var watch = WatchJS.watch,
    unwatch = WatchJS.unwatch,
    callWatchers = WatchJS.callWatchers,
    autoClickIntervalID,
    availableUpgradesWatcherIntervalID,
    availableUpgradesWatchers = [],
    availableUpgrades = [],
    upgradesBypassDialog = false,
    upgradesRepeatable = false,
    redCookieAvoidance = false,
    speedUpGameIntervalID,
    availableBuildingsWatcherIntervalID,
    availableBuildingsWatchers = [],
    availableBuildings = [],
    buildingList = [],
    switcherNames = {},
    repeaterNames = {};

  // Initialize the game client.
  var initialize = function () {

    // Initialize switcher and repeatable upgrade names.

    switcherNames['Season switcher'] = true;

    // Season triggers are a repeatable upgrade.
    if (Game.seasonTriggers)
      Game.seasonTriggers.forEach(function (upgradeName) {
        repeaterNames[upgradeName] = true;
      });
  };

  var clickCookie = function () {
    Game.ClickCookie();
  };

  var stopAutoClickCookie = function () {
    if (autoClickIntervalID)
      clearInterval(autoClickIntervalID);
  };

  var autoClickCookie = function (interval) {
    stopAutoClickCookie();
    if (!interval || interval < 1)
      interval = 1;
    autoClickIntervalID = setInterval(clickCookie, interval);
  };

  var popAllWrinklers = function () {
    Game.CollectWrinklers();
  };

  var clickGoldenCookie = function (goldenCookie) {
    if (goldenCookie.wrath > 0 && redCookieAvoidance)
      return;

    if (goldenCookie.life <= 0)
      return;

    if (goldenCookie.l.style.opacity == 0) {
      // wait for goldenCookie first update
      setTimeout(function(){
        clickGoldenCookie(goldenCookie); 
      }, 500);
    } else {
      goldenCookie.pop();
      return;
    }

  };

  var clickSeasonPopup = function () {
    Game.seasonPopup.click();
  };

  var stopAvoidRedCookie = function () {
    redCookieAvoidance = false;
  };

  var avoidRedCookie = function () {
    redCookieAvoidance = true;
  };

  var wrinklersWatcher = function (prop, action, newValue, oldValue) {
    if (newValue === 2)
      popAllWrinklers();
  };

  var goldenCookieWatcher = function (prop, action, newValue, oldValue) {
    if (Game.shimmers.length >= 1)
      Game.shimmers.forEach( function (goldenCookie) {
        if (goldenCookie.type == "golden")
          clickGoldenCookie(goldenCookie);
      })
  };

  var seasonPopupWatcher = function (prop, action, newValue, oldValue) {
    if (oldValue === 0 && newValue > 0)
      clickSeasonPopup();
  };

  var goldenCookieNotifier = function (prop, action, newValue, oldValue) {
    if (Game.shimmers.length >= 1)
      Game.shimmers.forEach( function (goldenCookie) {
        if (goldenCookie.type == "golden") {
          pageMessagingClient.sendToExtension({
            cmd: 'GoldenCookieNotification',
          });
        }
      })
  };

  var seasonPopupNotifier = function (prop, action, newValue, oldValue) {
    if (oldValue === 0 && newValue > 0)
      pageMessagingClient.sendToExtension({
        cmd: 'SeasonPopupNotification',
      });
  };

  var stopAutoPopWrinklers = function () {
    Game.wrinklers.forEach(function (wrinkler) {
      unwatch(wrinkler, 'phase', wrinklersWatcher);
    });
  };

  var autoPopWrinklers = function () {
    popAllWrinklers();

    Game.wrinklers.forEach(function (wrinkler) {
      watch(wrinkler, 'phase', wrinklersWatcher);
    });
  };

  var stopAutoClickGoldenCookie = function () {
    unwatch(Game, "shimmersN", goldenCookieWatcher);
  };

  var stopAutoClickSeasonPopup = function () {
    unwatch(Game.seasonPopup, 'life', seasonPopupWatcher);
  };

  var autoClickGoldenCookie = function () {
    watch(Game, "shimmersN", goldenCookieWatcher);
  };

  var autoClickSeasonPopup = function () {
    watch(Game.seasonPopup, 'life', seasonPopupWatcher);
  };

  var stopGoldenCookieNotification = function () {
    unwatch(Game, "shimmersN", goldenCookieNotifier);
  };

  var stopSeasonPopupNotification = function () {
    unwatch(Game.seasonPopup, 'life', seasonPopupNotifier);
  };

  var notifyGoldenCookie = function () {
    watch(Game, "shimmersN", goldenCookieNotifier);
  };

  var notifySeasonPopup = function () {
    watch(Game.seasonPopup, 'life', seasonPopupNotifier);
  };

  var unwatchAvailableUpgrades = function () {
    if (availableUpgradesWatcherIntervalID)
      clearInterval(availableUpgradesWatcherIntervalID);
  };

  var watchAvailableUpgrades = function () {
    unwatchAvailableUpgrades();
    if (availableUpgradesWatchers.length === 0)
      return;
    availableUpgradesWatcherIntervalID = setInterval(function () {
      var newValue = [],
        diffValue = [];
      Game.UpgradesInStore.every(function (upgrade) {
        if (upgrade.basePrice > Game.cookies)
          return false;
        newValue.push(upgrade);
        if (availableUpgrades.indexOf(upgrade) === -1)
          diffValue.push(upgrade);
        return true;
      });
      // if (diffValue.length > 0) {
      availableUpgradesWatchers.forEach(function (watcher) {
        watcher(newValue, diffValue, availableUpgrades);
      });
      availableUpgrades = newValue;
      // }
    }, 50);
  };

  var removeAvailableUpgradesWatcher = function (watcher) {
    var i = availableUpgradesWatchers.indexOf(watcher);
    if (i !== -1)
      availableUpgradesWatchers.splice(i, 1);
  };

  var isSwitcherUpgrade = function (upgrade) {
    if (upgrade.pool === 'toggle')
      return true;
    if (Object.prototype.hasOwnProperty.call(switcherNames, upgrade.name))
      return true;
    return false;
  };

  var isRepeatableUpgrade = function (upgrade) {
    if (upgrade.desc.startsWith('[Repeatable]'))
      return true;
    if (Object.prototype.hasOwnProperty.call(repeaterNames, upgrade.name))
      return true;
    return false;
  };

  var autoBuyUpgradesWatcher = function (newValue) {
    newValue.forEach(function (upgrade) {
      if (isSwitcherUpgrade(upgrade))
        return;
      if (!upgradesRepeatable && isRepeatableUpgrade(upgrade))
        return;
      if (upgrade.clickFunction) {
        if (!upgradesBypassDialog)
          return;
        var clickFunction = upgrade.clickFunction;
        upgrade.clickFunction = undefined;
        upgrade.buy();
        upgrade.clickFunction = clickFunction;
      } else
        upgrade.buy();
    });
  };

  var stopAutoBuyUpgrades = function () {
    unwatchAvailableUpgrades();
    removeAvailableUpgradesWatcher(autoBuyUpgradesWatcher);
    watchAvailableUpgrades();
  };

  var autoBuyUpgrades = function () {
    unwatchAvailableUpgrades();
    removeAvailableUpgradesWatcher(autoBuyUpgradesWatcher);
    availableUpgradesWatchers.push(autoBuyUpgradesWatcher);
    watchAvailableUpgrades();
  };

  var stopBypassDialogForUpgrades = function () {
    upgradesBypassDialog = false;
  };

  var bypassDialogForUpgrades = function () {
    upgradesBypassDialog = true;
  };

  var stopBuyRepeatableUpgrades = function () {
    upgradesRepeatable = false;
  };

  var buyRepeatableUpgrades = function () {
    upgradesRepeatable = true;
  };

  var notifyUpgradesWatcher = function (newValue, diffValue, oldValue) {
    if (diffValue.length < 1)
      return;

    var message = '',
      length = diffValue.length;

    if (length > 1)
      message += 'New upgrades are now available:\n';
    else
      message += 'A new upgrade is now available:\n';

    for (var i = 0; i < length; ++i) {
      message += diffValue[i].name;
      if (i < length - 1)
        message += ',\n';
    }
    message += '.';

    pageMessagingClient.sendToExtension({
      cmd: 'UpgradesNotification',
      args: { message: message }
    });
  };

  var stopUpgradesNotification = function () {
    unwatchAvailableUpgrades();
    removeAvailableUpgradesWatcher(notifyUpgradesWatcher);
    watchAvailableUpgrades();
  };

  var notifyUpgrades = function () {
    unwatchAvailableUpgrades();
    removeAvailableUpgradesWatcher(notifyUpgradesWatcher);
    availableUpgradesWatchers.unshift(notifyUpgradesWatcher);
    watchAvailableUpgrades();
  };

  var stopSpeedUpGame = function () {
    if (speedUpGameIntervalID)
      clearInterval(speedUpGameIntervalID);
  };

  var speedUpGame = function (factor) {
    stopSpeedUpGame();
    if (!factor || factor < 1)
      factor = 1;
    speedUpGameIntervalID = setInterval(function () {
      Game.accumulatedDelay += (factor - 1) * 1000 / Game.fps;
    }, 1000 / Game.fps);
  };

  var unwatchAvailableBuildings = function () {
    if (availableBuildingsWatcherIntervalID)
      clearInterval(availableBuildingsWatcherIntervalID);
  };

  var sortBuildingsByPrice = function (buildings) {
    var list = [];

    buildings.forEach(function (b) {
      list.push(b);
    });

    list.sort(function (b1, b2) {
      if (b1.price > b2.price)
        return 1;
      else if (b1.price < b2.price)
        return -1;
      else
        return 0;
    });

    return list;
  };

  var watchAvailableBuildings = function () {
    unwatchAvailableBuildings();
    if (availableBuildingsWatchers.length === 0)
      return;
    availableBuildingsWatcherIntervalID = setInterval(function () {
      var newValue = [],
        diffValue = [];
      Game.ObjectsById.forEach(function (building) {
        if (building.price > Game.cookies)
          return;
        newValue.push(building);
        if (availableBuildings.indexOf(building) === -1)
          diffValue.push(building);
      });
      // if (diffValue.length > 0) {
      availableBuildingsWatchers.forEach(function (watcher) {
        watcher(newValue, diffValue, availableBuildings);
      });
      availableBuildings = newValue;
      // }
    }, 50);
  };

  var removeAvailableBuildingsWatcher = function (watcher) {
    var i = availableBuildingsWatchers.indexOf(watcher);
    if (i !== -1)
      availableBuildingsWatchers.splice(i, 1);
  };

  var autoBuyBuildingsWatcher = function (newValue) {
    sortBuildingsByPrice(newValue).every(function (building) {
      if (building.price > Game.cookies)
        return false;
      if (!buildingList[building.id] ||
          buildingList[building.id].autoBuy === undefined ||
          buildingList[building.id].autoBuy)
        building.buy();
      return true;
    });
  };

  var stopAutoBuyBuildings = function () {
    unwatchAvailableBuildings();
    removeAvailableBuildingsWatcher(autoBuyBuildingsWatcher);
    watchAvailableBuildings();
  };

  var autoBuyBuildings = function () {
    unwatchAvailableBuildings();
    removeAvailableBuildingsWatcher(autoBuyBuildingsWatcher);
    availableBuildingsWatchers.push(autoBuyBuildingsWatcher);
    watchAvailableBuildings();
  };

  var updateBuildingList = function (newBuildingList) {
    buildingList = newBuildingList;
  };

  return {
    initialize: initialize,

    clickCookie: clickCookie,
    autoClickCookie: autoClickCookie,
    stopAutoClickCookie: stopAutoClickCookie,

    autoPopWrinklers: autoPopWrinklers,
    stopAutoPopWrinklers: stopAutoPopWrinklers,

    clickGoldenCookie: clickGoldenCookie,
    autoClickGoldenCookie: autoClickGoldenCookie,
    stopAutoClickGoldenCookie: stopAutoClickGoldenCookie,

    clickSeasonPopup: clickSeasonPopup,
    autoClickSeasonPopup: autoClickSeasonPopup,
    stopAutoClickSeasonPopup: stopAutoClickSeasonPopup,

    avoidRedCookie: avoidRedCookie,
    stopAvoidRedCookie: stopAvoidRedCookie,

    notifyGoldenCookie: notifyGoldenCookie,
    stopGoldenCookieNotification: stopGoldenCookieNotification,

    notifySeasonPopup: notifySeasonPopup,
    stopSeasonPopupNotification: stopSeasonPopupNotification,

    autoBuyUpgrades: autoBuyUpgrades,
    stopAutoBuyUpgrades: stopAutoBuyUpgrades,

    bypassDialogForUpgrades: bypassDialogForUpgrades,
    stopBypassDialogForUpgrades: stopBypassDialogForUpgrades,

    buyRepeatableUpgrades: buyRepeatableUpgrades,
    stopBuyRepeatableUpgrades: stopBuyRepeatableUpgrades,

    notifyUpgrades: notifyUpgrades,
    stopUpgradesNotification: stopUpgradesNotification,

    speedUpGame: speedUpGame,
    stopSpeedUpGame: stopSpeedUpGame,

    autoBuyBuildings: autoBuyBuildings,
    stopAutoBuyBuildings: stopAutoBuyBuildings,
    updateBuildingList: updateBuildingList
  };

}(WatchJS, window.Game, pageMessagingClient);
