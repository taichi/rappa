describe('controllers', function() {
  /*jshint expr:true*/
  'use strict';
  beforeEach(module('Options'));

  var $q, $scope, $controller;
  beforeEach(inject(function($injector) {
    $q = $injector.get('$q');
    $scope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
  }));

  var setUpController = function(args, names) {
    var defers = {};
    var svc = _.reduce(_.union(['getConfig', 'getMetrix'], names), function(memo, val) {
      var s = sinon.stub();
      memo[val] = s;
      var d = $q.defer();
      defers[val+'_defer'] = d;
      s.returns(d.promise);
      return memo;
    }, {});
    args.$scope = $scope;
    args.service = svc;
    $controller('OptionsController', args);
    return defers;
  };

  describe('initialize', function() {
    it('should initialize normally', function() {
      var alert = sinon.spy();
      $scope.$on('event:alert', alert);

      var args = {};
      var defers = setUpController(args);

      expect($scope.latest).ok;
      expect($scope.getMetrix).ok;
      
      expect(args.service.getConfig).called;
      expect(args.service.getMetrix).called;
      expect($scope.buttons.disabled).true;

      var config = {
        github : {}
      };
      defers.getConfig_defer.resolve(config);
      $scope.$digest();
      expect($scope.buttons.disabled).false;
      expect($scope.config).equal(config);
      expect(alert).called;
      var calledWith = alert.getCall(0).args[1];
      expect(calledWith).eql({
        type : '',
        message_key : 'not_auth'
      });

      defers.getMetrix_defer.resolve({
        power : 100,
        urls : 101
      });
      $scope.$digest();
      expect($scope.power).equal(100);
      expect($scope.urls).equal(101);
    });
  });

  it('#clear', function() {
    var args = {};
    var defers = setUpController(args, 'clearConfig');
    expect($scope.clear).ok;
    $scope.clear();
    expect(args.service.clearConfig).called;
  });

  it('#apply', function() {
    var alert = sinon.spy();
    $scope.$on('event:alert', alert);
    var args = {};
    var defers = setUpController(args, 'setConfig');

    expect($scope.apply).ok;
    var param = {
      a : 1,
      b : 2
    };
    $scope.apply(param);
    expect(args.service.setConfig).calledWith(param);
    defers.setConfig_defer.resolve();
    $scope.$digest();

    expect(alert).called;
    var calledWith = alert.getCall(0).args[1];
    expect(calledWith).eql({
      type : 'info',
      message_key : 'conf_stored'
    });
  });

  describe('#test', function() {
    var args, alert, defers;
    beforeEach(function() {
      args = {};
      alert = sinon.spy();
      $scope.$on('event:alert', alert);

      defers = setUpController(args, 'testGitHub');
    });

    it('succeed auth.', function() {
      expect($scope.test).ok;

      var param = {};
      $scope.test(param);
      expect(args.service.testGitHub).calledWith(param);
      defers.testGitHub_defer.resolve();
      $scope.$digest();
      expect(param.tested).true;

      expect(alert).called;
      var calledWith = alert.getCall(0).args[1];
      expect(calledWith).eql({
        type : 'info',
        message_key : 'already_auth'
      });
    });

    it('failed auth.', function() {
      var param = {};
      $scope.test(param);
      expect(args.service.testGitHub).calledWith(param);
      defers.testGitHub_defer.reject('ERROR');
      $scope.$digest();
      expect(param.tested).false;

      expect(alert).called;
      var calledWith = alert.getCall(0).args[1];
      expect(calledWith).eql({
        type : '',
        message_key : 'not_auth'
      });
    });
  });

  it('#clearPower', function() {
    var args = {};
    var alert = sinon.spy();
    $scope.$on('event:alert', alert);

    var defers = setUpController(args, 'clearPower');

    expect($scope.clearPower).ok;

    $scope.clearPower();
    expect(args.service.clearPower).called;

    defers.clearPower_defer.resolve();
    $scope.$digest();

    expect(alert).called;
    var calledWith = alert.getCall(0).args[1];
    expect(calledWith).eql({
      type : 'info',
      message_key : 'power_clear'
    });
  });
});
