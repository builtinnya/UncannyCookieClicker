;(function ($) {

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
      notifyGoldenCookie = $('#notify-golden-cookie'),
      autoBuyUpgrades = $('#auto-buy-upgrades'),
      notifyUpgrades = $('#notify-available-upgrades');

    $('#auto-buy-upgrades-label').tooltip({
      title: 'Auto-buy the cheapest available upgrade except repeatable one or one that needs confirmation.',
      placement: 'auto top'
    });

    storage.get(null, function (items) {
      if (!items)
        return;

      if (items.autoClickCookie)
        autoClickCookie.prop('checked', true);

      var interval = items.autoClickCookieInterval || 1;
      autoClickCookieInterval.val(interval);

      if (items.autoClickGoldenCookie)
        autoClickGoldenCookie.prop('checked', true);

      if (items.notifyGoldenCookie)
        notifyGoldenCookie.prop('checked', true);

      if (items.autoBuyUpgrades)
        autoBuyUpgrades.prop('checked', true);

      if (items.notifyUpgrades)
        notifyUpgrades.prop('checked', true);
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
  });

})($);
