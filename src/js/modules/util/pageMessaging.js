var pageMessaging = function (window, _, pageHandlers) {
  // Module for bi-directional messaging between embedding page and extension.
  // Requests and handler dispatching are the same as messaging.js.
  //

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

  // Proxing messages from embedding page
  var proxy = function (event) {
    chrome.runtime.sendMessage(event.data.request, function (response) {
      postMessage(FROM_EXTENSION, response);
    });
  };

  // Proxing messages from extension
  var proxyHandler = function (request, sender, sendResponse) {
    if (!request || !request.cmd || !_.isString(request.cmd))
      return;
    if (request.args && request.cmd == PROXY_COMMAND)
      postMessage(FROM_EXTENSION, args.request);
  };

  // Invoking the embedding page's handler corresponding to the given command
  var invokePageHandlers = function (event) {
    var handlers = pageHandlers,
      request = event.data.request,
      sendResponse = function (response) {
        postMessage(FROM_PAGE, response);
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
    contentInitialize: function () {
      window.addEventListener(
        'message',
        makeDispatcher(FROM_PAGE, proxy),
        false
      );
      chrome.runtime.onMessage.addListener(proxyHandler);
    },

    pageInitialize: function () {
      window.addEventListener(
        'message',
        makeDispatcher(FROM_EXTENSION, invokePageHandlers),
        false
      );
    },

    sendToExtension: function (request) {
      postMessage(FROM_PAGE, request);
    },

    sendToPage: function (tabId, request) {
      var r = { cmd: PROXY_COMMAND, args: { request: request } };
      chrome.tabs.sendMessage(tabId, r);
    }

  };

}(window, _, pageHandlers);
