var pageMessagingClient = function (common) {
  // Module for bi-directional messaging between embedding page and extension.
  // This module defines messaging clients.

  var sendToPage = function (tabId, request) {
    var r = { cmd: common.PROXY_COMMAND, args: request };
    chrome.tabs.sendMessage(tabId, r);
  };

  return {
    sendToExtension: function (request) {
      common.postMessage(common.FROM_PAGE, request);
    },

    sendToPage: sendToPage,

    sendConfigRequest: function (tabId, config) {
      var r = { cmd: 'ConfigRequest', args: config };
      sendToPage(tabId, r);
    }
  };

}(pageMessagingCommon);
