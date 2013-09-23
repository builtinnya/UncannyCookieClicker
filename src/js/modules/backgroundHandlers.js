var backgroundHandlers = function () {

  return {
    handleGreeting: function (args, sender, sendResponse) {
      console.log('Accepted greeting from the embedding page.');
      sendResponse({ cmd: 'Greeting' });
    },

    handleGreetingEnd: function (args, sender, sendResponse) {
      console.log('Greeting end.');
    },

    handleConfigClient: function (args, sender, sendResponse) {
      console.log('Configurating client...');
      sendResponse({
        cmd: 'ConfigRequest',
        args: [
            { cmd: 'notifyGoldenCookie' },
            { cmd: 'autoClickGoldenCookie' },
        ]
      });
    },

    handleGoldenCookieNotification: function (args, sender, sendResponse) {
      console.log('Golden cookie appeared!');
    }
  };

}();
