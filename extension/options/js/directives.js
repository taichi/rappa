angular.module('Options').directive('alert', ['$compile', '$timeout','translate',
function($compile, $timeout, translate) {
  //
  'use strict';
  return {
    restrict : 'A',
    link : function(scope, element, attr) {
      var template = '<div class="alert {{type}} hide"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>';
      var cache = {};
      scope.$on('event:alert', function(event, config) {
        if (_.isUndefined(cache[config.message_key])) {
          cache[config.message_key] = true;
          var child = scope.$new(true);
          child.type = _.isUndefined(config.type) ? ''/*alert-warn*/ : 'alert-' + config.type;
          child.message_key = config.message_key;
          child.message = translate(config.message_key);
          var newone = $compile(template)(child);
          element.append(newone);
          var close = _.bind(newone.trigger, newone, 'close');
          var fadeOut = _.bind(newone.fadeOut, newone, 2000, close);
          newone.fadeIn(1000, _.partial($timeout, fadeOut, 3000));
          newone.one('close', child, function(event) {
            newone.remove();
            event.data.$destroy();
            delete cache[event.data.message_key];
          });
        }
      });
    }
  };
}]);

