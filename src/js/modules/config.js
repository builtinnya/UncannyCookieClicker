var config = function () {

  return {
    extensionName: 'Uncanny Cookie Clicker',
    cookieClickerUrls: [
      'http://orteil.dashnet.org/cookieclicker/',
      'http://orteil.dashnet.org/cookieclicker/beta/'
    ],
    defaultSettings: {
      autoClickCookie: false,
      autoClickCookieInterval: 1,
      autoClickGoldenCookie: false,
      avoidRedCookie: true,
      notifyGoldenCookie: false,
      autoBuyUpgrades: false,
      bypassDialogForUpgrades: false,
      buyRepeatableUpgrades: false,
      notifyUpgrades: false
    },
    notificationDuration: 5000
  };

}();
