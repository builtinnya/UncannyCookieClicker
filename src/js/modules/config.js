var config = function () {

  return {
    extensionName: 'Uncanny Cookie Clicker',
    cookieClickerUrls: [
      'http://orteil.dashnet.org/cookieclicker/',
      'http://orteil.dashnet.org/cookieclicker/beta/',
      'https://orteil.dashnet.org/cookieclicker/',
      'https://orteil.dashnet.org/cookieclicker/beta/'      
    ],
    defaultSettings: {
      autoClickCookie: false,
      autoClickCookieInterval: 1,
      autoPopWrinklers: false,
      autoClickGoldenCookie: false,
      autoClickSeasonPopup: false,
      avoidRedCookie: true,
      notifyGoldenCookie: false,
      notifySeasonPopup: false,
      autoBuyUpgrades: false,
      bypassDialogForUpgrades: false,
      buyRepeatableUpgrades: false,
      notifyUpgrades: false,
      speedUpGame: false,
      speedUpGameFactor: 1,
      autoBuyBuildings: false
    },
    notificationDuration: 5000
  };

}();
