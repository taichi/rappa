optionsModule.controller('OptionsController', function($rootScope, $scope, $q, service) {
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

  var unAuth = function(github) {
    if (github.tested == false) {
      $rootScope.$broadcast('event:alert', {
        message : 'GitHub Account is not authenticated'
      });
    }
  };
  $scope.latest = _.compose(enabler, function() {
    return function() {
      return service.getConfig($scope).then(function(config) {
        return $scope.config = config;
      }).then(function(config) {
        unAuth(config.github);
      });
    };
  });
  $scope.latest();

  $scope.apply = _.compose(enabler, function(config) {
    return function() {
      return service.setConfig($scope, config).then(function() {
        $rootScope.$broadcast('event:alert', {
          type : 'info',
          message : 'configuration is stored.'
        });
      });
    };
  });

  $scope.test = _.compose(enabler, function(github) {
    return function() {
      return service.testGitHub($scope, github).then(function() {
        github.tested = true;
      }, function() {
        github.tested = false;
      }).then(_.partial(unAuth, github));
    };
  });
});
