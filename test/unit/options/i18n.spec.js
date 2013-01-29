describe('i18n', function() {
  /*jshint expr:true*/
  //
  'use strict';

  describe('translate', function() {
    beforeEach(module('i18n'));
    var chromeMock;
    beforeEach(module(function($provide) {
      $provide.factory('chrome.i18n', function() {
        chromeMock = {
          getMessage : sinon.spy()
        };
        return chromeMock;
      });
    }));

    it('should work normally.', inject(function(translate) {
      var args = ['aaa', 'bbb'];
      translate(args);
      expect(chromeMock.getMessage).calledWith(args);
    }));
  });

  describe('directives', function() {
    beforeEach(module('i18n.directives'));
    var translateMock;
    beforeEach(module(function($provide) {
      $provide.factory('translate', function() {
        translateMock = sinon.stub();
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
        translateMock.returns(returnValue);

        $scope.$digest();
        expect(element.text()).equal(returnValue);
        expect(translateMock).calledWith('aaa');
      });

      it('fail to translate', function() {
        var element = $compile('<translate key="aaa">zzzz</translate>')($scope);

        $scope.$digest();
        expect(element.text()).equal('zzzz');
        expect(translateMock).calledWith('aaa');
      });
    });
    describe('attribue', function() {
      it('should work normally.', function() {
        var element = $compile('<input placeholder="zzzz" translate="{placeholder:\'aaa\'}">bbb</input>')($scope);

        var returnValue = 'pppp';
        translateMock.returns(returnValue);

        $scope.$digest();
        expect(element.attr('placeholder')).equal(returnValue);
        expect(translateMock).calledWith('aaa');
      });
      it('fail to translate', function() {
        var element = $compile('<input placeholder="zzzz" translate="{placeholder:\'aaa\'}">bbb</input>')($scope);

        $scope.$digest();
        expect(element.attr('placeholder')).equal('zzzz');
        expect(translateMock).calledWith('aaa');
      });
    });
  });
});
