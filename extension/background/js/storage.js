( function(global) {
    var wrap = function(storage) {
      return {
        get : function(callback) {
          storage.get(function(value) {
            callback(chrome.runtime.lastError, value);
          });
        },
        set : function(value, callback) {
          storage.set(value, function() {
            callback(chrome.runtime.lastError);
          });
        },
        clear : function(callback) {
          storage.clear(function() {
            callback(chrome.runtime.lastError);
          });
        }
      }
    };
    global.storage = {
      local : wrap(chrome.storage.local),
      sync : wrap(chrome.storage.sync),
      managed : wrap(chrome.storage.managed)
    };
  }(this));
