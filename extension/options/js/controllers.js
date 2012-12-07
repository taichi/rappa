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
});
