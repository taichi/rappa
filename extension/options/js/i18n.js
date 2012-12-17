angular.module('i18n', ['chrome'], ['$provide',
function($provide) {
  $provide.factory('translate', ['chrome.i18n',
  function(i18n) {
    return function(/* arguments */) {
      return i18n.getMessage.apply(i18n, arguments);
    };
  }]);
}]);
angular.module('i18n.directives', ['i18n'], ['$compileProvider',
function($compileProvider) {
  $compileProvider.directive('translate', ['$compile', 'translate',
  function($compile, translate) {
    return {
      priority : 10, //Should be evaluated befor e. G. pluralize
      restrict : 'E',
      link : function(scope, element, attrs) {
        var txt = translate(attrs.key);
        element.replaceWith( txt ? txt : element.text());
      }
    };
  }]);
  $compileProvider.directive('translate', ['$parse', 'translate',
  function($parse, translate) {
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
