angular.module('i18n', ['chrome'], ['$provide',
function($provide) {
  //
  'use strict';
  $provide.factory('translate', ['chrome.i18n',
  function(i18n) {
    return function(/* arguments */) {
      return i18n.getMessage.apply(i18n, arguments);
    };
  }]);
}]);
angular.module('i18n.directives', ['i18n'], ['$compileProvider',
function($compileProvider) {
  //
  'use strict';
  $compileProvider.directive('translate', ['translate',
  function(translate) {
    return {
      priority : 10, //Should be evaluated befor e. G. pluralize
      restrict : 'E',
      link : function(scope, element, attrs) {
        scope.$watch(function() {
          var txt = translate(attrs.key);
          if (txt) {
            element.text(txt);
          }
        });
      }
    };
  }]);
  $compileProvider.directive('translate', ['translate',
  function(translate) {
    return {
      priority : 10,
      restrict : 'A',
      link : function(scope, element, attrs) {
        scope.$watch(function() {
          var exp = element.attr(attrs.$attr.translate);
          var map = scope.$eval(exp);
          angular.forEach(map, function(v, k) {
            var txt = translate(v);
            if (txt) {
              element.attr(k, txt);
            }
          });
        });
      }
    };
  }]);
}]);
