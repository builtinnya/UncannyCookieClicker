var GameClient = function (Game) {

  return (function (WatchJS) {

    if (!Game) {
      throw 'Error: object Game is undefined.';
    }

    var watch = WatchJS.watch,
      unwatch = WatchJS.unwatch,
      callWatchers = WatchJS.callWatchers,
      goldenCookie_ = Game.goldenCookie,
      autoClickIntervalID_;

    function clickCookie_() {
      Game.ClickCookie();
    }

    function autoClickCookie_(interval) {
      if (autoClickIntervalID_) {
        clearInterval(autoClickIntervalID_);
      }
      autoClickIntervalID_ = setInterval(clickCookie_, interval);
    }

    function clickGoldenCookie_() {
      goldenCookie_.click();
    }

    function goldenCookieWatcher_() {
      if (goldenCookie_.life > 0) {
        clickGoldenCookie_();
      }
    }

    function autoClickGoldenCookie_() {
      watch(goldenCookie_, 'life', goldenCookieWatcher_);
    }

    return {
      clickCookie: clickCookie_,
      autoClickCookie: autoClickCookie_,
      clickGoldenCookie: clickGoldenCookie_,
      autoClickGoldenCookie: autoClickGoldenCookie_
    };

  })(WatchJS);

};

