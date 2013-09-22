var pageHandlers = function (client) {

  return {
    handleGreeting: function (args, sendResponse) {
      console.log('Hello, Extension!');
      sendResponse({ cmd: 'GreetingEnd' });
    },

    handleConfigRequest: function (args, sendResponse) {
    }
  };

}(gameClient);
