var pageMessaging = function (window, _, common, pageHandlers) {
  // Module for bi-directional messaging between embedding page and extension.
  // This module defines embedding page's message dispatcher.

  // Invoking the embedding page's handler corresponding to the given command
  var invokePageHandlers = function (event) {
    var handlers = pageHandlers,
      request = event.data.request,
      sendResponse = function (response) {
        common.postMessage(common.FROM_PAGE, response);
      };

    if (!request || !request.cmd || !_.isString(request.cmd))
      throw 'Error: Bad request.';

    var handlerName = 'handle' + request.cmd;
    var handler = handlers[handlerName];
    if (!_.isFunction(handler))
      // Target window doesn't know how to handle this request.
      return;

    return handler(request.args, sendResponse);
  };

  return {
    pageInitialize: function () {
      window.addEventListener(
        'message',
        common.makeDispatcher(common.FROM_EXTENSION, invokePageHandlers),
        false
      );
    }
  };

}(window, _, pageMessagingCommon, pageHandlers);
