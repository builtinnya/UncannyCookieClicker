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
    availableUpgrades = [];

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

  var clickGoldenCookie = function () {
    Game.goldenCookie.click();
  };

  var goldenCookieWatcher = function (prop, action, newValue, oldValue) {
    if (oldValue === 0 && newValue > 0)
      clickGoldenCookie();
  };

  var goldenCookieNotifier = function (prop, action, newValue, oldValue) {
    if (oldValue === 0 && newValue > 0)
      pageMessagingClient.sendToExtension({
        cmd: 'GoldenCookieNotification',
      });
  };

  var stopAutoClickGoldenCookie = function () {
    unwatch(Game.goldenCookie, 'life', goldenCookieWatcher);
  };

  var autoClickGoldenCookie = function () {
    watch(Game.goldenCookie, 'life', goldenCookieWatcher);
  };

  var stopGoldenCookieNotification = function () {
    unwatch(Game.goldenCookie, 'life', goldenCookieNotifier);
  };

  var notifyGoldenCookie = function () {
    watch(Game.goldenCookie, 'life', goldenCookieNotifier);
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

  var autoBuyUpgradesWatcher = function (newValue) {
    newValue.forEach(function (upgrade) {
      if (upgrade.clickFunction ||
          upgrade.desc.startsWith('[Switch]') ||
          upgrade.desc.startsWith('[Repeatable]'))
        return;
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

  return {
    clickCookie: clickCookie,
    autoClickCookie: autoClickCookie,
    stopAutoClickCookie: stopAutoClickCookie,
    clickGoldenCookie: clickGoldenCookie,
    autoClickGoldenCookie: autoClickGoldenCookie,
    stopAutoClickGoldenCookie: stopAutoClickGoldenCookie,
    notifyGoldenCookie: notifyGoldenCookie,
    stopGoldenCookieNotification: stopGoldenCookieNotification,
    autoBuyUpgrades: autoBuyUpgrades,
    stopAutoBuyUpgrades: stopAutoBuyUpgrades,
    notifyUpgrades: notifyUpgrades,
    stopUpgradesNotification: stopUpgradesNotification
  };

}(WatchJS, window.Game, pageMessagingClient);
