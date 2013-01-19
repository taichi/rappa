describe('i18n', function() {
  'use strict';

  describe('translate', function() {
    beforeEach(module('i18n'));
    var chromeMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.i18n', function() {
        chromeMock = jasmine.createSpyObj('chrome.i18n', ['getMessage']);
        return chromeMock;
      });
    }));

    it('should work normally.', inject(function(translate) {
      var args = ['aaa', 'bbb'];
      translate(args);
      expect(chromeMock.getMessage).toHaveBeenCalledWith(args);
    }));
  });

  describe('directives', function() {
    beforeEach(module('i18n.directives'));
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

    describe('Element', function() {
      it('should work normally.', function() {
        var element = $compile('<translate key="aaa">zzzz</translate>')($scope);

        var returnValue = 'pppp';
        translateMock.andReturn(returnValue);

        $scope.$digest();
        expect(element.text()).toEqual(returnValue);
        expect(translateMock).toHaveBeenCalledWith('aaa');
      });

      it('fail to translate', function() {
        var element = $compile('<translate key="aaa">zzzz</translate>')($scope);

        $scope.$digest();
        expect(element.text()).toEqual('zzzz');
        expect(translateMock).toHaveBeenCalledWith('aaa');
      });
    });
    describe('attribue', function() {
      it('should work normally.', function() {
        var element = $compile('<input placeholder="zzzz" translate="{placeholder:\'aaa\'}">bbb</input>')($scope);
        
        var returnValue = 'pppp';
        translateMock.andReturn(returnValue);
        
        $scope.$digest();
        expect(element.attr('placeholder')).toEqual(returnValue);
        expect(translateMock).toHaveBeenCalledWith('aaa');
      });
      it('fail to translate', function(){
        var element = $compile('<input placeholder="zzzz" translate="{placeholder:\'aaa\'}">bbb</input>')($scope);
        
        $scope.$digest();
        expect(element.attr('placeholder')).toEqual('zzzz');
        expect(translateMock).toHaveBeenCalledWith('aaa');
      });
    });
  });
});
