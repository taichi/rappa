describe('controllers', function() {

  beforeEach(module('Options'));

  var $q, $scope, $controller;
  beforeEach(inject(function($injector) {
    $q = $injector.get('$q');
    $scope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
  }));

  describe('initialize', function() {
    it('should initialize normally', function() {
      var svc = jasmine.createSpyObj('service', ['getConfig', 'getMetrix']);
      var getConfig_defer = $q.defer();
      svc.getConfig.andReturn(getConfig_defer.promise);
      var getMetrix_defer = $q.defer();
      svc.getMetrix.andReturn(getMetrix_defer.promise);
      var args = {
        $scope : $scope,
        service : svc
      };
      
      var ctrl = $controller('OptionsController', args);
      expect($scope.latest).toBeDefined();
      expect($scope.getMetrix).toBeDefined();
      
      expect(args.service.getConfig).toHaveBeenCalled();
      expect(args.service.getMetrix).toHaveBeenCalled();
      expect($scope.buttons.disabled).toBe(true);
      
      var config = {
        github : {}
      };
      getConfig_defer.resolve(config);
      $scope.$digest();
      expect($scope.buttons.disabled).toBe(false);
      expect($scope.config).toBe(config);
    });
  });

  describe('clear', function() {
    it('should work normally.', function() {
      var svc = jasmine.createSpyObj('service', ['getConfig', 'getMetrix', 'clearConfig']);
      var getConfig_defer = $q.defer();
      svc.getConfig.andReturn(getConfig_defer.promise);
      var getMetrix_defer = $q.defer();
      svc.getMetrix.andReturn(getMetrix_defer.promise);
      var clearConfig_defer = $q.defer();
      svc.clearConfig.andReturn(clearConfig_defer.promise);
      var args = {
        $scope : $scope,
        service : svc
      };
      var ctrl = $controller('OptionsController', args);
      expect($scope.clear).toBeDefined();
      $scope.clear();
      expect(args.service.clearConfig).toHaveBeenCalled();
    });
  });

});
