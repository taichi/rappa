optionsModule.controller('OptionsController', function($scope, background) {
  $scope.buttons = {
    disabled : false
  };

  var enabler = function(fn) {
    $scope.buttons.disabled = true;
    return fn().then(function() {
      $scope.$apply(function() {
        $scope.buttons.disabled = false;
      });
    });
  };
  $scope.defaults = function() {
    $scope.config = {};
  };

  $scope.latest = _.compose(function(promise) {
    promise.then(function() {
      $scope.$apply(function() {
        $scope.config = config;
      });
    });
  }, _.partial(enabler, background.getConfig));
  $scope.latest();

  $scope.apply = _.compose(function(config) {
    return _.partial(background.setConfig, config);
  }, enabler);

  $scope.test = function(github) {
    if (github) {
      $scope.buttons.disabled = true;
      background.testGitHub(github, function(status) {
        $scope.$apply(function() {
          github.tested = status === 'success';
          $scope.buttons.disabled = false;
        });
      });
    }
  };
});
