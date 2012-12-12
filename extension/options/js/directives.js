optionsModule.directive('alert', function($compile) {
  return {
    restrict : 'A',
    terminal : true,
    compile : function(element, attr) {
      var template = '<div class="alert fade in {{type}}"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>';
      return function(scope, elem) {
        var toClass = function(type) {
          return _.isUndefined(type) ? ''/*alert-warn*/ : 'alert-' + type;
        };
        scope.$on('event:alert', function(event, config) {
          var child = scope.$new(true);
          child.type = toClass(config.type);
          child.message = config.message;
          var newone = $compile(template)(child);
          elem.append(newone);
          newone.one('close', child, function(event) {
            event.data.$destroy();
          });
        });
      };
    }
  };
});
