;(function (config, messaging, messagingClient) {

  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
      if (tab.url == config.cookieClickerUrl)
        chrome.pageAction.show(tabId);
    }
  );

  messaging.backgroundInitialize();

})(config, messaging, messagingClient);
