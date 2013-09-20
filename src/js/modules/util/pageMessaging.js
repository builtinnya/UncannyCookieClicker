var pageMessaging = function (window, _, pageHandlers) {

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

  var proxy = function (event) {
    chrome.runtime.sendMessage(event.data.request, function (response) {
      var data = { type: 'FROM_EXTENSION', request: response };
      window.postMessage(data, '*');
    });
  };

  var invokePageHandlers = function (event) {
    var handlers = pageHandlers,
      request = event.data.request;

    if (!request || !request.cmd || !_.isString(request.cmd))
      throw 'Error: Bad request.';

    var handlerName = 'handle' + request.cmd;
    var handler = handlers[handlerName];
    if (!_.isFunction(handler))
      // Target window doesn't know how to handle this request.
      return;

    return handler(request.args);
  };

  return {
    contentInitialize: function () {
      window.addEventListener(
        'message',
        makeDispatcher('FROM_PAGE', proxy),
        false
      );
    },

    pageInitialize: function () {
      window.addEventListener(
        'message',
        makeDispatcher('FROM_EXTENSION', invokePageHandlers),
        false
      );
    }
  };

}(window, _, pageHandlers);
