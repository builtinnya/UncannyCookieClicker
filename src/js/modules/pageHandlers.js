var pageHandlers = function (gameClient) {

  var configGameClient = function (config) {
    Object.keys(config).forEach(function (cmdName) {
      var cmd = gameClient[cmdName],
        argList = config[cmdName] || [];
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
