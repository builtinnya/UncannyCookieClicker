var notifications = function (config) {
  // Wrapper for notification API.

  var cn = chrome.notifications,
    iconUrl = 'images/icon48.png',
    title = config.extensionName;

  return {
    notify: function (message) {
      cn.create('', {
        type: 'basic',
        title: title,
        message: message,
        iconUrl: iconUrl
      }, function (id) {
        setTimeout(function () {
          cn.clear(id, function (wasCleared) {} );
        }, config.notificationDuration);
      });
    }
  };

}(config);
