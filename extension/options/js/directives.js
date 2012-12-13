angular.module('Options').directive('alert', ['$compile', '$timeout',
function($compile, $timeout) {
  return {
    restrict : 'A',
    link : function(scope, element, attr) {
      var template = '<div class="alert {{type}} hide"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>';
      var cache = {};
      scope.$on('event:alert', function(event, config) {
        if (_.isUndefined(cache[config.message])) {
          cache[config.message] = true;
          var child = scope.$new(true);
          child.type = _.isUndefined(config.type) ? ''/*alert-warn*/ : 'alert-' + config.type;
          child.message = config.message;
          var newone = $compile(template)(child);
          element.append(newone);
          var close = _.bind(newone.trigger, newone, 'close');
          var fadeOut = _.bind(newone.fadeOut, newone, 2000, close);
          newone.fadeIn(1000, _.partial($timeout, fadeOut, 3000));
          newone.one('close', child, function(event) {
            event.data.$destroy();
            delete cache[event.data.message];
          });
        }
      });
    }
  };
}]);
