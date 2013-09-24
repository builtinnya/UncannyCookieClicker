var gameClient = function (document, WatchJS, Game, pageMessagingClient) {

  // `Game` is the main object for CookieClicker.
  if (!Game)
    throw 'Error: object `Game` is undefined.';

  var watch = WatchJS.watch,
    unwatch = WatchJS.unwatch,
    callWatchers = WatchJS.callWatchers,
    autoClickIntervalID;

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

  return {
    clickCookie: clickCookie,
    autoClickCookie: autoClickCookie,
    stopAutoClickCookie: stopAutoClickCookie,
    clickGoldenCookie: clickGoldenCookie,
    autoClickGoldenCookie: autoClickGoldenCookie,
    stopAutoClickGoldenCookie: stopAutoClickGoldenCookie,
    notifyGoldenCookie: notifyGoldenCookie,
    stopGoldenCookieNotification: stopGoldenCookieNotification
  };

}(document, WatchJS, window.Game, pageMessagingClient);
