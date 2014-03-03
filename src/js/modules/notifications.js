var notifications = function (config) {
  // Wrapper for notification API.

  var cn = chrome.notifications,
      iconUrl = 'images/icon48.png',
      title = config.extensionName,
      cookieClickerTabId = null;

  if (cn) {
    cn.onClicked.addListener(function (_) {
      if (!cookieClickerTabId)
        return;

      chrome.tabs.get(cookieClickerTabId, function (tab) {
        // Bring the window to the front which contains the Cookie Clicker tab.
        chrome.windows.update(tab.windowId, {
          focused: true
        }, function (window) {
          // Highlight (select) the tab of Cookie Clicker.
          chrome.tabs.update(tab.id, {
            highlighted: true
          });
        });
      });
    });
  }

  return {
    setCookieClickerTabId: function (tabId) {
      cookieClickerTabId = tabId;
    },

    notify: function (message) {
      cn.create('', {
        type: 'basic',
        title: title,
        message: message,
        iconUrl: iconUrl
      }, function (id) {
        setTimeout(function () {
          cn.clear(id, function (wasCleared) {} );
        }, config.notificationDuration);
      });
    }
  };

}(config);
