var pageMessagingCommon = function (window) {
  // Module for bi-directional messaging between embedding page and extension.
  // This module defines the common vacabularies.

  // Invoking handlers if the message has the expected direction
  var dispatcher = function (type, event, invokeHandlers) {
    if (event.source != window)
      return;
    if (event.data.type && (event.data.type == type))
      invokeHandlers(event);
  };

  var makeDispatcher = function (type, invokeHandlers) {
    return function (event) {
      dispatcher(type, event, invokeHandlers);
    };
  };

  var FROM_PAGE = 'FROM_PAGE',
    FROM_EXTENSION = 'FROM_EXTENSION',
    PROXY_COMMAND = 'MessageToPage';

  var postMessage = function (type, request) {
    window.postMessage({ type: type, request: request }, '*');
  };

  return {
    FROM_PAGE: FROM_PAGE,
    FROM_EXTENSION: FROM_EXTENSION,
    PROXY_COMMAND: PROXY_COMMAND,
    makeDispatcher: makeDispatcher,
    postMessage: postMessage
  };

}(window);
