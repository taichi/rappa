describe('controllers', function() {
  beforeEach(module('Options'));

  var $q, $scope, $controller;
  beforeEach(inject(function($injector) {
    $q = $injector.get('$q');
    $scope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
  }));

  var setUpController = function(args, names, mockFn) {
    var svc = jasmine.createSpyObj('service', _.union(['getConfig', 'getMetrix'], names));
    var defers = {};
    defers.getConfig_defer = $q.defer();
    svc.getConfig.andReturn(defers.getConfig_defer.promise);
    defers.getMetrix_defer = $q.defer();
    svc.getMetrix.andReturn(defers.getMetrix_defer.promise);
    if (mockFn) {
      mockFn(svc, defers);
    }
    args.$scope = $scope;
    args.service = svc;
    $controller('OptionsController', args);
    return defers;
  };

  describe('initialize', function() {
    it('should initialize normally', function() {
      var alert = jasmine.createSpy('alert');
      $scope.$on('event:alert', alert);

      var args = {};
      var defers = setUpController(args);

      expect($scope.latest).toBeDefined();
      expect($scope.getMetrix).toBeDefined();

      expect(args.service.getConfig).toHaveBeenCalled();
      expect(args.service.getMetrix).toHaveBeenCalled();
      expect($scope.buttons.disabled).toBe(true);

      var config = {
        github : {}
      };
      defers.getConfig_defer.resolve(config);
      $scope.$digest();
      expect($scope.buttons.disabled).toBe(false);
      expect($scope.config).toBe(config);
      expect(alert).toHaveBeenCalled();
      var calledWith = alert.mostRecentCall.args[1];
      expect(calledWith).toEqual({
        type : '',
        message_key : 'not_auth'
      });

      defers.getMetrix_defer.resolve({
        power : 100,
        urls : 101
      });
      $scope.$digest();
      expect($scope.power).toBe(100);
      expect($scope.urls).toBe(101);
    });
  });

  it('#clear', function() {
    var args = {};
    var defers = setUpController(args, 'clearConfig', function(svc) {
      var defer = $q.defer();
      svc.clearConfig.andReturn(defer.promise);
    });
    expect($scope.clear).toBeDefined();
    $scope.clear();
    expect(args.service.clearConfig).toHaveBeenCalled();
  });

  it('#apply', function() {
    var alert = jasmine.createSpy('alert');
    $scope.$on('event:alert', alert);
    var args = {};
    var defers = setUpController(args, 'setConfig', function(svc, defers) {
      defers.setConfig_defer = $q.defer();
      svc.setConfig.andReturn(defers.setConfig_defer.promise);
    });

    expect($scope.apply).toBeDefined();
    var param = {
      a : 1,
      b : 2
    };
    $scope.apply(param);
    expect(args.service.setConfig).toHaveBeenCalledWith(param);
    defers.setConfig_defer.resolve();
    $scope.$digest();

    expect(alert).toHaveBeenCalled();
    var calledWith = alert.mostRecentCall.args[1];
    expect(calledWith).toEqual({
      type : 'info',
      message_key : 'conf_stored'
    });
  });

  describe('#test', function() {
    var args, alert, defers;
    beforeEach(function() {
      args = {};
      alert = jasmine.createSpy('alert');
      $scope.$on('event:alert', alert);

      defers = setUpController(args, 'testGitHub', function(svc, defers) {
        defers.testGitHub_defer = $q.defer();
        svc.testGitHub.andReturn(defers.testGitHub_defer.promise);
      });
    });

    it('succeed auth.', function() {
      expect($scope.test).toBeDefined();

      var param = {};
      $scope.test(param);
      expect(args.service.testGitHub).toHaveBeenCalledWith(param);
      defers.testGitHub_defer.resolve();
      $scope.$digest();
      expect(param.tested).toBe(true);

      expect(alert).toHaveBeenCalled();
      var calledWith = alert.mostRecentCall.args[1];
      expect(calledWith).toEqual({
        type : 'info',
        message_key : 'already_auth'
      });
    });

    it('failed auth.', function() {
      var param = {};
      $scope.test(param);
      expect(args.service.testGitHub).toHaveBeenCalledWith(param);
      defers.testGitHub_defer.reject('ERROR');
      $scope.$digest();
      expect(param.tested).toBe(false);

      expect(alert).toHaveBeenCalled();
      var calledWith = alert.mostRecentCall.args[1];
      expect(calledWith).toEqual({
        type : '',
        message_key : 'not_auth'
      });
    });
  });

  it('#clearPower', function() {
    var args = {};
    var alert = jasmine.createSpy('alert');
    $scope.$on('event:alert', alert);

    defers = setUpController(args, 'clearPower', function(svc, defers) {
      defers.clearPower_defer = $q.defer();
      svc.clearPower.andReturn(defers.clearPower_defer.promise);
    });

    expect($scope.clearPower).toBeDefined();

    $scope.clearPower();
    expect(args.service.clearPower).toHaveBeenCalled();

    defers.clearPower_defer.resolve();
    $scope.$digest();

    expect(alert).toHaveBeenCalled();
    var calledWith = alert.mostRecentCall.args[1];
    expect(calledWith).toEqual({
      type : 'info',
      message_key : 'power_clear'
    });
  });
});
