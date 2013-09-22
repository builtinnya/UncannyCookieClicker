var pageMessagingClient = function (common) {
  // Module for bi-directional messaging between embedding page and extension.
  // This module defines messaging clients.

  return {
    sendToExtension: function (request) {
      common.postMessage(common.FROM_PAGE, request);
    },

    sendToPage: function (tabId, request) {
      var r = { cmd: common.PROXY_COMMAND, args: { request: request } };
      chrome.tabs.sendMessage(tabId, r);
    }
  };

}(pageMessagingCommon);
