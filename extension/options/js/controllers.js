optionsModule.controller('OptionsController', function($scope, $q, service) {
  $scope.buttons = {
    disabled : false
  };

  var defaults = function() {
    $scope.config = {
      github : {}
    };
  };
  defaults();

  var enabler = function(fn) {
    $scope.buttons.disabled = true;
    return fn().then(function() {
      $scope.buttons.disabled = false;
    });
  };

  $scope.clear = _.compose(enabler, function() {
    return function() {
      return service.clearConfig($scope).then(defaults);
    };
  });

  $scope.latest = _.compose(enabler, function() {
    return function() {
      return service.getConfig($scope).then(function(config) {
        $scope.config = config;
      });
    };
  });
  $scope.latest();

  $scope.apply = _.compose(enabler, function(config) {
    return _.partial(service.setConfig, $scope, config);
  });

  $scope.test = _.compose(enabler, function(github) {
    return function() {
      return service.testGitHub($scope, github).then(function() {
        github.tested = true;
      }, function() {
        github.tested = false;
      });
    };
  });
});
