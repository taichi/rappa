describe('services', function() {
  /*jshint expr:true*/
  //
  'use strict';
  beforeEach(module('Options'));

  describe('configStore', function() {
    var bgMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.background', function() {
        bgMock = {
          set : sinon.spy(),
          get : sinon.spy(),
          clear : sinon.spy()
        };
        return {
          configStore : bgMock
        };
      });
    }));

    var $timeout, service;
    beforeEach(inject(function($injector) {
      $timeout = $injector.get('$timeout');
      service = $injector.get('service');
    }));

    it('should define service', function() {
      expect(service).ok;
    });

    describe('#setConfig', function() {
      it('should work normally', function() {
        var callback = sinon.spy();
        var config = {
          aaa : 1,
          bbb : 2
        };
        service.setConfig(config).then(callback);
        $timeout.flush();

        expect(bgMock.set).called;
        var calledWith = bgMock.set.getCall(0);
        expect(calledWith.args[0]).eql(config);
        expect(calledWith.args[1]).ok;

        calledWith.args[1](undefined, 33);
        $timeout.flush();

        expect(callback).calledWith(33);
      });

      it('should work error happen', function() {
        var callback = sinon.spy();
        var errback = sinon.spy();
        service.setConfig(33).then(callback, errback);
        $timeout.flush();

        expect(bgMock.set).called;
        var fn = bgMock.set.getCall(0).args[1];
        expect(fn).ok;

        fn('ERROR', 44);
        $timeout.flush();

        expect(callback).not.called;
        expect(errback).calledWith('ERROR');
      });
    });

    it('#getConfig', function() {
      var callback = sinon.spy();
      service.getConfig().then(callback);
      $timeout.flush();

      expect(bgMock.get).called;
      var fn = bgMock.get.getCall(0).args[0];
      expect(fn).ok;

      fn(undefined, 33);
      $timeout.flush();

      expect(callback).calledWith(33);
    });

    it('#clearConfig', function() {
      var callback = sinon.spy();
      service.clearConfig().then(callback);
      $timeout.flush();

      expect(bgMock.clear).called;
      var fn = bgMock.clear.getCall(0).args[0];
      expect(fn).ok;

      fn(undefined);
      $timeout.flush();

      expect(callback).called;
    });
  });

  describe('testGitHub', function() {
    var bgMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.background', function() {
        bgMock = sinon.spy();
        return {
          testGitHub : bgMock
        };
      });
    }));

    var $timeout, service;
    beforeEach(inject(function($injector) {
      $timeout = $injector.get('$timeout');
      service = $injector.get('service');
    }));

    it('should work normally', function() {
      var callback = sinon.spy();
      var github = {
        username : 'un',
        password : 'ps'
      };
      service.testGitHub(github).then(callback);
      $timeout.flush();

      expect(bgMock).called;
      var calledWith = bgMock.getCall(0);
      expect(calledWith.args[0]).equal(github);
      expect(calledWith.args[1]).ok;

      calledWith.args[1](undefined);
      $timeout.flush();

      expect(callback).called;
    });
  });

  describe('massacre', function() {
    var bgMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.background', function() {
        bgMock = {
          getMetrix : sinon.spy(),
          clear : sinon.spy()
        };
        return {
          massacre : bgMock
        };
      });
    }));

    var $timeout, service;
    beforeEach(inject(function($injector) {
      $timeout = $injector.get('$timeout');
      service = $injector.get('service');
    }));

    it('#getMetrix', function() {
      var callback = sinon.spy();
      service.getMetrix().then(callback);
      $timeout.flush();

      expect(bgMock.getMetrix).called;
      var fn = bgMock.getMetrix.getCall(0).args[0];
      expect(fn).ok;

      fn(undefined, 33);
      $timeout.flush();

      expect(callback).calledWith(33);
    });

    it('#clearPower', function() {
      var callback = sinon.spy();
      service.clearPower().then(callback);
      $timeout.flush();

      expect(bgMock.clear).called;
      var fn = bgMock.clear.getCall(0).args[0];
      expect(fn).ok;

      fn(undefined, 33);
      $timeout.flush();

      expect(callback).calledWith(33);
    });
  });
});
