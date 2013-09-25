;(function (window, document, messaging, pageMessagingProxy) {

  var injectedScripts = [
    'js/lib/watch.js',
    'js/lib/underscore.js',
    'js/modules/util/pageMessagingCommon.js',
    'js/modules/util/pageMessagingClient.js',
    'js/modules/gameClient.js',
    'js/modules/pageHandlers.js',
    'js/modules/util/pageMessaging.js',
    'js/page.js'
  ];

  injectedScripts.forEach(function (script) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(script);
    s.async = false;
    s.onload = function () {
      this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
  });

  messaging.contentInitialize();
  pageMessagingProxy.contentInitialize();

})(window, document, messaging, pageMessagingProxy);
