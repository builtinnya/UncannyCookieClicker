importScripts(
  "js/lib/underscore.js",
  "js/modules/config.js",
  "js/modules/storage.js",
  "js/modules/notifications.js",
  "js/modules/backgroundHandlers.js",
  "js/modules/util/messaging.js",
  "js/modules/util/pageMessagingCommon.js",
  "js/modules/util/pageMessagingClient.js"
)

;(function (config, notifications, messaging) {

  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
      if (config.cookieClickerUrls.indexOf(tab.url) !== -1) {
        notifications.setCookieClickerTabId(tab.id);
      }
    }
  );

  messaging.backgroundInitialize();

})(config, notifications, messaging);
