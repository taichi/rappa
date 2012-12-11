optionsModule.factory('background', function($q) {
  var bg = chrome.extension.getBackgroundPage();
  var defaultDefer = function(deferred) {
    return function() {
      var err = _.first(arguments);
      if (err) {
        deffered.reject(err);
      } else {
        deferred.resolve(_.rest(arguments));
      }
    };
  };
  var makeFn = function(fn) {
    var deferred = $q.defer();
    _.delay(function() {
      fn(deferred);
    });
    return deferred.promise;
  };

  return {
    setConfig : _.compose(makeFn, function(config) {
      return function(deferred) {
        bg.configStore.setConfig(config, defaultDefer(deferred));
      };
    }),
    getConfig : _.compose(makeFn, function() {
      return function(deferred) {
        bg.configStore.getConfig(defaultDefer(deferred));
      };
    }),
    testGitHub : _.compose(makeFn, function(github) {
      return function(deferred) {
        bg.testGitHub(github, defaultDefer(deferred));
      };
    })
  };
});
