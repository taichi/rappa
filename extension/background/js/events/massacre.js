(function(global) {
  var updateBadge = (function() {
    var ba = chrome.browserAction;
    ba.setBadgeBackgroundColor({
      color : '#FF6633'
    });
    return function(value) {
      var str = String(value);
      ba.setBadgeText({
        text : str
      });
      ba.setTitle({
        title : str
      });
    };
  })();

  var massacre = global.massacre;

  var getTimes = function(request, sender, response) {
    global.configStore.get(function(err, config) {
      if (err || !!!config.ninja) {
        response({
          times : -1
        });
      } else {
        massacre.getTimes(request.url, function(times) {
          response({
            times : times
          });
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
    var errEnd = _.partial(response, {
      times : -1
    });
    global.configStore.get(function(err, config) {
      if (err) {
        errEnd();
      } else if (config.ninja === true) {
        var url = request.url;
        massacre.getTimes(url, function(err, times) {
          if (err) {
            errEnd();
          } else if (times < 1) {
            massacre.addPower(Number(request.line), function(err, power) {
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
