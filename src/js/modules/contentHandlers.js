var contentHandlers = function (window) {

  return {
    handleMessageToPage: function (args, sender, sendResponse) {
      if (!args || !args.request)
        return;
      var data = { type: 'FROM_EXTENSION', request: args.request };
      window.postMessage(data, '*');
    }
  };

}(window);
