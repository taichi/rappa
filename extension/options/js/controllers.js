angular.module('Options').controller('OptionsController', ['$scope', 'service',
function($scope, service) {
  //
  'use strict';
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
      return service.clearConfig().then(defaults);
    };
  });

  var auth_messages = function(github) {
    $scope.$broadcast('event:alert', {
      type : github.tested ? 'info' : '',
      message_key : github.tested ? 'already_auth' : 'not_auth'
    });
  };
  $scope.latest = _.compose(enabler, function() {
    return function() {
      return service.getConfig().then(function(config) {
        $scope.config = config;
        auth_messages(config.github);
      });
    };
  });
  $scope.latest();

  $scope.apply = _.compose(enabler, function(config) {
    return function() {
      return service.setConfig(config).then(function() {
        $scope.$broadcast('event:alert', {
          type : 'info',
          message_key : 'conf_stored'
        });
      });
    };
  });

  $scope.test = _.compose(enabler, function(github) {
    return function() {
      return service.testGitHub(github).then(function() {
        github.tested = true;
      }, function() {
        github.tested = false;
      }).then(_.partial(auth_messages, github));
    };
  });

  $scope.getMetrix = _.compose(enabler, function() {
    return function() {
      return service.getMetrix().then(function(metrix) {
        $scope.power = metrix.power;
        $scope.urls = metrix.urls;
      });
    };
  });
  $scope.getMetrix();

  $scope.clearPower = _.compose(enabler, function() {
    return function() {
      return service.clearPower().then(function() {
        $scope.$broadcast('event:alert', {
          type : 'info',
          message_key : 'power_clear'
        });
      }).then($scope.getMetrix);
    };
  });

}]);
