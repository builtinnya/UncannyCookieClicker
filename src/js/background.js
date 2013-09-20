;(function (config, messaging, messagingClient) {

  var cookieClickerTabId;

  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
      if (tab.url == config.cookieClickerUrl) {
        cookieClickerTabId = tabId;
        chrome.pageAction.show(tabId);
      }
    }
  );

  messaging.backgroundInitialize();

})(config, messaging, messagingClient);
