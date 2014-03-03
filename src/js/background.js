;(function (config, notifications, messaging, messagingClient) {

  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
      if (config.cookieClickerUrls.indexOf(tab.url) !== -1) {
        notifications.setCookieClickerTabId(tab.id);
        chrome.pageAction.show(tabId);
      }
    }
  );

  messaging.backgroundInitialize();

})(config, notifications, messaging, messagingClient);
