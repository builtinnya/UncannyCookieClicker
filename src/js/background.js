;(function (config, messaging, messagingClient) {

  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
      if (config.cookieClickerUrls.indexOf(tab.url) !== -1)
        chrome.pageAction.show(tabId);
    }
  );

  messaging.backgroundInitialize();

})(config, messaging, messagingClient);
