describe('directives', function() {
  'use strict';
  beforeEach(module('Options'));

  describe('alert', function() {
    var translateMock;
    beforeEach(module(function($provide) {
      $provide.factory('translate', function() {
        translateMock = jasmine.createSpy('translate');
        return translateMock;
      });
    }));

    var $compile, $scope;
    beforeEach(inject(function($injector) {
      $compile = $injector.get('$compile');
      $scope = $injector.get('$rootScope');
    }));

    it('should work normally.', function() {
      var element = $compile('<div alert></div>')($scope);

      var returnValue = 'pppp';
      translateMock.andReturn(returnValue);

      var args = {
        type : 'info',
        message_key : 'yyy'
      };
      $scope.$broadcast('event:alert', args);
      $scope.$digest();
      expect(translateMock).toHaveBeenCalledWith(args.message_key);
      var kids = element.find('.alert-info');
      expect(kids.size()).toBe(1);

      $scope.$broadcast('event:alert', args);
      $scope.$digest();
      expect(element.find('.alert-info').size()).toBe(1);

      kids.trigger('close');
      expect(element.find('.alert').size()).toBe(0);
    });

    it('called without type', function() {
      var element = $compile('<div alert></div>')($scope);

      var returnValue = 'pppp';
      translateMock.andReturn(returnValue);

      var args = {
        message_key : 'yyy'
      };
      $scope.$broadcast('event:alert', args);
      $scope.$digest();
      expect(translateMock).toHaveBeenCalledWith(args.message_key);
      var kids = element.find('.alert');
      expect(kids.size()).toBe(1);
    });
  });
});
