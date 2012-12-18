( function(global) {
    var wrapArgs = function(args) {
      var ary = [].slice.call(args);
      var init = _.initial(ary);
      var callback = _.last(ary);
      init.push(function(/* arguments */) {
        callback.apply(false, _.union([chrome.runtime.lastError], [].slice.call(arguments)));
      });
      return init;
    };
    var wrap = function(storage) {
      return {
        get : function(/* arguments */) {
          storage.get.apply(storage, wrapArgs(arguments));
        },
        getBytesInUse : function(/* arguments */) {
          storage.getBytesInUse.apply(storage, wrapArgs(arguments));
        },
        set : function(/* arguments */a, b) {
          storage.set.apply(storage, wrapArgs(arguments));
        },
        remove : function(/* arguments */) {
          storage.remove.apply(storage, wrapArgs(arguments));
        },
        clear : function(/* arguments */) {
          storage.clear.apply(storage, wrapArgs(arguments));
        }
      }
    };
    global.storage = {
      local : wrap(chrome.storage.local),
      sync : wrap(chrome.storage.sync),
      managed : wrap(chrome.storage.managed)
    };
  }(this));
