describe('services', function() {
  beforeEach(module('Options'));

  describe('configStore', function() {
    var bgMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.background', function() {
        bgMock = jasmine.createSpyObj('configStore', ['set', 'get', 'clear']);
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
      expect(service).toBeDefined();
    });

    describe('#setConfig', function() {
      it('should work normally', function() {
        var callback = jasmine.createSpy('callback');
        var config = {
          aaa : 1,
          bbb : 2
        };
        service.setConfig(config).then(callback);
        $timeout.flush();

        expect(bgMock.set).toHaveBeenCalled();
        expect(bgMock.set.mostRecentCall.args[0]).toEqual(config);
        expect(bgMock.set.mostRecentCall.args[1]).toBeDefined();

        bgMock.set.mostRecentCall.args[1](undefined, 33);
        $timeout.flush();

        expect(callback).toHaveBeenCalledWith(33);
      });

      it('should work error happen', function() {
        var callback = jasmine.createSpy('callback');
        var errback = jasmine.createSpy('errback');
        service.setConfig(33).then(callback, errback);
        $timeout.flush();

        expect(bgMock.set).toHaveBeenCalled();
        expect(bgMock.set.mostRecentCall.args[1]).toBeDefined();

        bgMock.set.mostRecentCall.args[1]('ERROR', 44);
        $timeout.flush();

        expect(callback).not.toHaveBeenCalled();
        expect(errback).toHaveBeenCalledWith('ERROR');
      });
    });

    it('#getConfig', function() {
      var callback = jasmine.createSpy('callback');
      service.getConfig().then(callback);
      $timeout.flush();

      expect(bgMock.get).toHaveBeenCalled();
      expect(bgMock.get.mostRecentCall.args[0]).toBeDefined();

      bgMock.get.mostRecentCall.args[0](undefined, 33);
      $timeout.flush();

      expect(callback).toHaveBeenCalledWith(33);
    });

    it('#clearConfig', function() {
      var callback = jasmine.createSpy('callback');
      service.clearConfig().then(callback);
      $timeout.flush();

      expect(bgMock.clear).toHaveBeenCalled();
      expect(bgMock.clear.mostRecentCall.args[0]).toBeDefined();

      bgMock.clear.mostRecentCall.args[0](undefined);
      $timeout.flush();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('testGitHub', function() {
    var bgMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.background', function() {
        bgMock = jasmine.createSpy('testGitHub');
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
      var callback = jasmine.createSpy('callback');
      var github = {
        username : 'un',
        password : 'ps'
      };
      service.testGitHub(github).then(callback);
      $timeout.flush();

      expect(bgMock).toHaveBeenCalled();
      expect(bgMock.mostRecentCall.args[0]).toEqual(github);
      expect(bgMock.mostRecentCall.args[1]).toBeDefined();

      bgMock.mostRecentCall.args[1](undefined);
      $timeout.flush();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('massacre', function() {
    var bgMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.background', function() {
        bgMock = jasmine.createSpyObj('massacre', ['getMetrix', 'clear']);
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
      var callback = jasmine.createSpy('callback');
      service.getMetrix().then(callback);
      $timeout.flush();

      expect(bgMock.getMetrix).toHaveBeenCalled();
      expect(bgMock.getMetrix.mostRecentCall.args[0]).toBeDefined();

      bgMock.getMetrix.mostRecentCall.args[0](undefined, 33);
      $timeout.flush();

      expect(callback).toHaveBeenCalledWith(33);
    });

    it('#clearPower', function() {
      var callback = jasmine.createSpy('callback');
      service.clearPower().then(callback);
      $timeout.flush();

      expect(bgMock.clear).toHaveBeenCalled();
      expect(bgMock.clear.mostRecentCall.args[0]).toBeDefined();

      bgMock.clear.mostRecentCall.args[0](undefined, 33);
      $timeout.flush();

      expect(callback).toHaveBeenCalledWith(33);
    });
  });
});
