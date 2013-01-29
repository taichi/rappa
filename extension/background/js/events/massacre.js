(function(global) {
  'use strict';
  var updateBadge = (function() {
    var ba = chrome.browserAction;
    ba.setBadgeBackgroundColor({
      color : '#FF6633'
    });
    global._test = global._test || {};
    var abbreviate  = global._test.abbreviate = (function() {
      var DIGITS = _.range(1, 5).map(function (i) { return Math.pow(1000, i); });
      var PREFIXES = ['K', 'M', 'G', 'T'];
      var truncate = (function () {
        var PAT = /\d{1,1}\.\d|\d{1,2}/;
        return function (num) {
          return String(num).match(PAT);
        };
      }());
      return function (num) {
        if (num < 1000) {
          return String(num);
        }
        for (var i = 0, length = DIGITS.length; i < length; i++) {
          if (num < DIGITS[i+1]) {
            var sig = num / DIGITS[i];
            if (sig < 100) {
              return truncate(sig) + PREFIXES[i];
            } else {
              return truncate(num / DIGITS[i+1]) + PREFIXES[i+1];
            }
          }
        }
        return 'OMG';
      };
    }());
    return function(value) {
      var str = String(value);
      ba.setBadgeText({
        text : abbreviate(value)
      });
      ba.setTitle({
        title : str
      });
    };
  })();

  var massacre = global.massacre;

  var errorEnd = function(response) {
    response({
      times : -1
    });
  };
  var getTimes = function(request, sender, response) {
    global.configStore.get(function(err, config) {
      if (err || !!!config.ninja) {
        errorEnd(response);
      } else {
        massacre.getTimes(request.url, function(err, times) {
          if (err) {
            errorEnd(response);
          } else {
            response({
              times : times
            });
          }
        });
      }
    });
    return true;
  };

  var setPower = function(request, sender, response) {
    var end = function(times, power) {
      updateBadge(power);
      response({
        times : times
      });
    };
    global.configStore.get(function(err, config) {
      if (err) {
        errorEnd(response);
      } else if (config.ninja === true) {
        var url = request.url;
        massacre.getTimes(url, function(err, times) {
          if (err) {
            errorEnd(response);
          } else if (times < 1) {
            massacre.addPower(Number(request.line), function(err, power) {
              if (err) {
                errorEnd(response);
              }
              massacre.addTimes(url, function(err, t) {
                end(t, power);
              });
            });
          } else {
            massacre.addTimes(url, function(err, t) {
              massacre.getPower(function(err, power) {
                end(t, power);
              });
            });
          }
        });
      }
    });
    return true;
  };

  global.events.line = setPower;
  global.events.times = getTimes;

  (function() {
    var ub = function(err, value) {
      updateBadge(value);
    };
    chrome.storage.onChanged.addListener(function(changes, area) {
      if (area === 'local' && changes.massacre) {
        massacre.getPower(ub);
      }
    });
    massacre.getPower(ub);
  })();
})(this);
