optionsModule.controller('OptionsController', function($scope, background) {
  $scope.defaults = function() {
    $scope.config = {};
  };
  $scope.latest = function() {
    background.getConfig(function(config) {
      $scope.config = config;
      $scope.$digest();
    });
  };
  $scope.latest();
  $scope.apply = function(config) {
    background.setConfig(config);
  };

  $scope.test = function(github) {
    if (github) {
      background.testGitHub(github, function(status) {
        console.log(status);
        if (status === 'success') {
          github.tested = true;
          $scope.$digest();
        }
      });
    }
  };
});
