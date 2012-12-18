( function(global) {
    var addLastError = function(callback, value) {
      callback.call(global, chrome.runtime.lastError, value);
    };
    var wrap = function(storage, schemaName) {
      return {
        get : function(callback) {
          storage.get(schemaName, function(value) {
            var model = value[schemaName] || {};
            addLastError(callback, model);
          });
        },
        getBytesInUse : function(callback) {
          storage.getBytesInUse(schemaName, function(bytesInUse) {
            addLastError(callback, bytesInUse);
          });
        },
        set : function(model, callback) {
          var value = {};
          value[schemaName] = model;
          storage.set(value, _.partial(addLastError, callback));
        },
        remove : function(callback) {
          storage.remove(schemaName, _.partial(addLastError, callback));
        },
        clear : function(callback) {
          storage.clear(_.partial(addLastError, callback));
        }
      }
    };
    global.storage = {
      local : _.partial(wrap, chrome.storage.local),
      sync : _.partial(wrap, chrome.storage.sync),
      managed : _.partial(wrap, chrome.storage.managed)
    };
  }(this));
