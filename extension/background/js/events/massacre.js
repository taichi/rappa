(function(global) {
  //
  'use strict';
  global._test = global._test || {};
  var abbreviate = global._test.abbreviate = function(n) {
    var s = String(n);
    if (n < 1000) {
      return s;
    }
    if (Math.pow(10, 14) - 1 < n) {
      return 'OMG';
    }
    var l = s.length;
    return (function() {
      switch(l % 3) {
        case 0:
          return '0.' + s.charAt(0);
        case 1:
          return s.charAt(0) + '.' + s.charAt(1);
        case 2:
          return s.substr(0, 2);
      }
    })() + ['', 'K', 'M', 'G', 'T'][Math.floor(l / 3)];
  };

  var updateBadge = (function() {
    var ba = chrome.browserAction;
    ba.setBadgeBackgroundColor({
      color : '#FF6633'
    });
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
      if (err || !!!config.ninja) {
        errorEnd(response);
      } else {
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
