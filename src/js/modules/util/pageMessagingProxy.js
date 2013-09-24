var pageMessagingProxy = function (window, common) {
  // Module for bi-directional messaging between embedding page and extension.
  // This module defines the messaging proxy.

  // Proxing messages from embedding page
  var proxy = function (event) {
    chrome.runtime.sendMessage(event.data.request, function (response) {
      common.postMessage(common.FROM_EXTENSION, response);
    });
  };

  // Proxing messages from extension
  var proxyHandler = function (request, sender, sendResponse) {
    if (!request || !request.cmd || !_.isString(request.cmd))
      return;
    if (request.args && request.cmd == common.PROXY_COMMAND)
      common.postMessage(common.FROM_EXTENSION, request.args);
  };

  return {
    // Call this in the content script.
    contentInitialize: function () {
      window.addEventListener(
        'message',
        common.makeDispatcher(common.FROM_PAGE, proxy),
        false
      );
      chrome.runtime.onMessage.addListener(proxyHandler);
    },
  };

}(window, pageMessagingCommon);
