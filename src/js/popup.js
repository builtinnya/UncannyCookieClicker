;(function (document, $) {

  var background = chrome.extension.getBackgroundPage();
  if (!background)
    throw 'Error: no background page.';

  var storage = background.storage,
    pageMessagingClient = background.pageMessagingClient;

  var doTabs = function (f) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      tabs.forEach(f);
    });
  };

  $(function () {
    var autoClickCookie = $('#auto-click-cookie'),
      autoClickCookieInterval = $('#auto-click-cookie-interval'),
      autoClickGoldenCookie = $('#auto-click-golden-cookie'),
      autoPopWrinklers = $('#auto-pop-wrinklers'),
      autoClickSeasonPopup = $('#auto-click-season-popup'),
      avoidRedCookie = $('#avoid-red-cookie'),
      notifyGoldenCookie = $('#notify-golden-cookie'),
      notifySeasonPopup = $('#notify-season-popup'),
      autoBuyUpgrades = $('#auto-buy-upgrades'),
      bypassDialogForUpgrades = $('#bypass-dialog-for-upgrades'),
      buyRepeatableUpgrades = $('#buy-repeatable-upgrades'),
      notifyUpgrades = $('#notify-available-upgrades'),
      speedUpGame = $('#speed-up-game'),
      speedUpGameFactor = $('#speed-up-game-factor'),
      autoBuyBuildings = $('#auto-buy-buildings'),
      buildingList = $('#building-list'),
      toggleBuildingList = $('#toggle-building-list');

    $('#auto-buy-upgrades-label').tooltip({
      title: 'Automatically buy the cheapest available upgrade except ' +
             '[Switch] or one that needs confirmation.',
      placement: 'auto top'
    });

    $('#auto-buy-buildings-label').tooltip({
      title: 'Automatically buy the cheapest available building.',
      placement: 'auto top'
    });

    storage.get(null, function (items) {
      if (!items)
        return;

      if (items.autoClickCookie)
        autoClickCookie.prop('checked', true);

      var interval = items.autoClickCookieInterval || 1;
      autoClickCookieInterval.val(interval);

      if (items.autoPopWrinklers)
        autoPopWrinklers.prop('checked', true);

      if (items.autoClickGoldenCookie)
        autoClickGoldenCookie.prop('checked', true);

      if (items.autoClickSeasonPopup)
        autoClickSeasonPopup.prop('checked', true);

      if (items.avoidRedCookie)
        avoidRedCookie.prop('checked', true);

      if (items.notifyGoldenCookie)
        notifyGoldenCookie.prop('checked', true);

      if (items.notifySeasonPopup)
        notifySeasonPopup.prop('checked', true);

      if (items.autoBuyUpgrades)
        autoBuyUpgrades.prop('checked', true);

      if (items.bypassDialogForUpgrades)
        bypassDialogForUpgrades.prop('checked', true);

      if (items.buyRepeatableUpgrades)
        buyRepeatableUpgrades.prop('checked', true);

      if (items.notifyUpgrades)
        notifyUpgrades.prop('checked', true);

      if (items.speedUpGame)
        speedUpGame.prop('checked', true);

      var factor = items.speedUpGameFactor || 1;
      speedUpGameFactor.val(factor);

      if (items.autoBuyBuildings)
        autoBuyBuildings.prop('checked', true);

      if (items.buildingList) {
        items.buildingList.forEach(function (building, index) {
          buildingList.find('ul').append(
            $('<li/>').append(
              $('<label/>').append(
                $('<input type="checkbox"/>')
                  .prop('checked', building.autoBuy)
                  .click(function () {
                    items.buildingList[index].autoBuy = !building.autoBuy;
                    storage.set({ buildingList: items.buildingList });
                    doTabs(function (tab) {
                      pageMessagingClient.sendConfigRequest(tab.id, {
                        updateBuildingList: [ items.buildingList ]
                      });
                    });
                  })
              ).append(
                document.createTextNode(' ' + building.name)
              )
            )
          );
        });
      }
    });

    autoClickCookie.click(function () {
      var r = {};

      if (this.checked)
        r = {
          autoClickCookie: [ autoClickCookieInterval.val() ]
        };
      else
        r = {
          stopAutoClickCookie: []
        };

      storage.set({ autoClickCookie: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    autoClickCookieInterval.bind('keyup input change', function () {
      var interval = $(this).val();

      storage.set({ autoClickCookieInterval: $(this).val() });

      if (!autoClickCookie.prop('checked'))
        return;

      var r = { autoClickCookie: [ interval ] };

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    autoPopWrinklers.click(function () {
      var r = {};

      if (this.checked)
        r = { autoPopWrinklers: [] };
      else
        r = { stopAutoPopWrinklers: [] };

      storage.set({ autoPopWrinklers: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    autoClickGoldenCookie.click(function () {
      var r = {};

      if (this.checked)
        r = { autoClickGoldenCookie: [] };
      else
        r = { stopAutoClickGoldenCookie: [] };

      storage.set({ autoClickGoldenCookie: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    autoClickSeasonPopup.click(function () {
      var r = {};

      if (this.checked)
        r = { autoClickSeasonPopup: [] };
      else
        r = { stopAutoClickSeasonPopup: [] };

      storage.set({ autoClickSeasonPopup: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    avoidRedCookie.click(function () {
      var r = {};

      if (this.checked)
        r = { avoidRedCookie: [] };
      else
        r = { stopAvoidRedCookie: [] };

      storage.set({ avoidRedCookie: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    notifyGoldenCookie.click(function () {
      var r = {};

      if (this.checked)
        r = { notifyGoldenCookie: [] };
      else
        r = { stopGoldenCookieNotification: [] };

      storage.set({ notifyGoldenCookie: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    notifySeasonPopup.click(function () {
      var r = {};

      if (this.checked)
        r = { notifySeasonPopup: [] };
      else
        r = { stopSeasonPopupNotification: [] };

      storage.set({ notifySeasonPopup: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    autoBuyUpgrades.click(function () {
      var r = {};

      if (this.checked)
        r = { autoBuyUpgrades: [] };
      else
        r = { stopAutoBuyUpgrades: [] };

      storage.set({ autoBuyUpgrades: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    bypassDialogForUpgrades.click(function () {
      var r = {};

      if (this.checked)
        r = { bypassDialogForUpgrades: [] };
      else
        r = { stopBypassDialogForUpgrades: [] };

      storage.set({ bypassDialogForUpgrades: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    buyRepeatableUpgrades.click(function () {
      var r = {};

      if (this.checked)
        r = { buyRepeatableUpgrades: [] };
      else
        r = { stopBuyRepeatableUpgrades: [] };

      storage.set({ buyRepeatableUpgrades: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    notifyUpgrades.click(function () {
      var r = {};

      if (this.checked)
        r = { notifyUpgrades: [] };
      else
        r = { stopUpgradesNotification: [] };

      storage.set({ notifyUpgrades: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    speedUpGame.click(function () {
      var r = {};

      if (this.checked)
        r = {
          speedUpGame: [ speedUpGameFactor.val() ]
        };
      else
        r = {
          stopSpeedUpGame: []
        };

      storage.set({ speedUpGame: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    speedUpGameFactor.bind('keyup input change', function () {
      var factor = $(this).val();

      storage.set({ speedUpGameFactor: $(this).val() });

      if (!speedUpGame.prop('checked'))
        return;

      var r = { speedUpGame: [ factor ] };

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    autoBuyBuildings.click(function () {
      var r = {};

      if (this.checked)
        r = { autoBuyBuildings: [] };
      else
        r = { stopAutoBuyBuildings: [] };

      storage.set({ autoBuyBuildings: this.checked });

      doTabs(function (tab) {
        pageMessagingClient.sendConfigRequest(tab.id, r);
      });
    });

    toggleBuildingList.click(function () {
      if (buildingList.css('display') === 'none')
        toggleBuildingList.text('Less...');
      else
        toggleBuildingList.text('More...');

      buildingList.toggle();
    });
  });

})(document, $);
