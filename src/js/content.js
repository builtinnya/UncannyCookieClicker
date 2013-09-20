;(function (window, document, messaging, pageMessaging) {

  var injectedScripts = [
    'js/lib/watch.js',
    'js/lib/underscore.js',
    'js/modules/GameClient.js',
    'js/modules/util/messagingClient.js',
    'js/modules/pageHandlers.js',
    'js/modules/util/pageMessaging.js',
    'js/page.js'
  ];

  injectedScripts.forEach(function (script) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(script);
    s.onload = function () {
      this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
  });

  messaging.contentInitialize();
  pageMessaging.contentInitialize();

})(window, document, messaging, pageMessaging);
