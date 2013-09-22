var gameClient = function (WatchJS, Game) {
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
    autoClickIntervalID = setInterval(clickCookie, interval);
  };

  var clickGoldenCookie = function () {
    Game.goldenCookie.click();
  };

  var goldenCookieWatcher = function () {
    if (Game.goldenCookie.life > 0)
      clickGoldenCookie();
  };

  var stopAutoClickGoldenCookie = function () {
    unwatch(Game.goldenCookie, 'life', goldenCookieWatcher);
  };

  var autoClickGoldenCookie = function () {
    watch(Game.goldenCookie, 'life', goldenCookieWatcher);
  };

  return {
    clickCookie: clickCookie,
    autoClickCookie: autoClickCookie,
    stopAutoClickCookie: stopAutoClickCookie,
    clickGoldenCookie: clickGoldenCookie,
    autoClickGoldenCookie: autoClickGoldenCookie,
    stopAutoClickGoldenCookie: stopAutoClickGoldenCookie
  };

}(WatchJS, window.Game);
