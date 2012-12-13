angular.module('Options').factory('service', ["chrome.background", "$q", "$timeout",
function(background, $q, $timeout) {
  var resolve = function(deferred) {
    return function(/* arguments */) {
      var err = _.first(arguments);
      var args = _.rest(arguments);
      $timeout(function() {
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
    $timeout(_.partial(fn, deferred));
    return deferred.promise;
  };

  return {
    setConfig : _.compose(defer, function(config) {
      return _.compose(_.partial(background.configStore.set, config), resolve);
    }),
    getConfig : _.compose(defer, function() {
      return _.compose(background.configStore.get, resolve);
    }),
    clearConfig : _.compose(defer, function() {
      return _.compose(background.configStore.clear, resolve);
    }),
    testGitHub : _.compose(defer, function(github) {
      return _.compose(_.partial(background.testGitHub, github), resolve);
    })
  };
}]);
