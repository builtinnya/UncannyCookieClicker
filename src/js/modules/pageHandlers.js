var pageHandlers = function (gameClient) {

  var configGameClient = function (configs) {
    configs.forEach(function (config) {
      var cmd = gameClient[config.cmd],
        argList = config.argList || [];
      if (cmd)
        cmd.apply(this, argList);
    });
  };

  return {
    handleGreeting: function (args, sendResponse) {
      console.log('Hello, Extension!');
      sendResponse({ cmd: 'GreetingEnd' });
    },

    handleConfigRequest: function (args, sendResponse) {
      if (!args)
        return;
      configGameClient(args);
    }
  };

}(gameClient);
