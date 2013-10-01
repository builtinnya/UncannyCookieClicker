var storage = function (config) {
  // Thin wrapper for managing user settings.

  var s = chrome.storage.sync,
    defaultKeyVals = config.defaultSettings;

  return {
    get: function (keys, callback) {
      s.get(keys, function (items) {
        if (!items)
          return callback(items);
        Object.keys(defaultKeyVals).forEach(function (key) {
          if (items[key] === undefined)
            items[key] = defaultKeyVals[key];
        });
        return callback(items);
      });
    },

    set: function (items, callback) {
      s.set(items, callback);
    },

    remove: function (keys, callback) {
      s.remove(keys, callback);
    },

    clear: function (callback) {
      s.clear(callback);
    }
  };

}(config);
