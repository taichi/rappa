optionsModule.factory('service', function(background, $q) {
  var resolve = function(scope, deferred) {
    return function(/* arguments */) {
      var err = _.first(arguments);
      var args = _.rest(arguments);
      scope.$apply(function() {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve.apply(deferred, args);
        }
      });
    };
  };
  var defer = function(fn) {
    var deferred = $q.defer();
    _.delay(fn, 0, deferred);
    return deferred.promise;
  };

  return {
    setConfig : _.compose(defer, function(scope, config) {
      return function(deferred) {
        background.configStore.set(config, resolve(scope, deferred));
      };
    }),
    getConfig : _.compose(defer, function(scope) {
      return function(deferred) {
        background.configStore.get(resolve(scope, deferred));
      };
    }),
    clearConfig : _.compose(defer, function(scope) {
      return function(deferred) {
        background.configStore.clear(resolve(scope, deferred));
      };
    }),
    testGitHub : _.compose(defer, function(scope, github) {
      return function(deferred) {
        background.testGitHub(github, resolve(scope, deferred));
      };
    })
  };
});
