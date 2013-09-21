var pageHandlers = function () {

  return {
    handleGreeting: function (args, sendResponse) {
      console.log('Hello, Extension!');
      sendResponse({ cmd: 'GreetingEnd' });
    }
  };

}();
