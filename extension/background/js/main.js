(function(global) {
  global.configStore = (function() {
    var storage = global.storage.sync('config');
    return {
      get : function(cb) {
        storage.get(function(err, config) {
          config.github = config.github || {};
          cb(err, config);
        });
      },
      set : storage.set,
      clear : storage.remove
    };
  })();

  global.testGitHub = function(credential, callback) {
    var github = new Github({
      username : credential.account,
      password : credential.password,
      auth : "basic"
    });
    var user = github.getUser();
    user.show(false, callback);
  };

  global.events = {};
  chrome.extension.onMessage.addListener(function(request, sender, response) {
    var fn = global.events[request.type];
    if (fn) {
      return fn(request, sender, response);
    }
    return false;
  });
})(this);
