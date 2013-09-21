var messagingClient = function () {
  // Convenient module for using the messaging system (see messaging.js).

  return {
    sendBroadcast: function (request, callback) {
      callback = callback || function () {};
      chrome.runtime.sendMessage(request, callback);
    },

    sendToContentScript: function (tabId, request, callback) {
      callback = callback || function () {};
      chrome.tabs.sendMessage(tabId, request, callback);
    }
  };

}();
