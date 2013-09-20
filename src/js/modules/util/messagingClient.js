var messagingClient = function (window) {
  // Convenient module for using the messaging system (see messaging.js).

  return {
    sendBroadcast: function (request, callback) {
      callback = callback || function () {};
      chrome.runtime.sendMessage(request, callback);
    },

    sendToContentScript: function (tabId, request, callback) {
      callback = callback || function () {};
      chrome.tabs.sendMessage(tabId, request, callback);
    },

    sendFromPage: function (request) {
      var data = { type: 'FROM_PAGE', request: request };
      window.postMessage(data, '*');
    },

    sendToPage: function (tabId, request) {
      var r = { cmd: 'MessageToPage', args: { request: request } };
      chrome.tabs.sendMessage(tabId, r, function () {});
    }
  };

}(window);
