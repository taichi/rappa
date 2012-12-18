( function(global) {
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
      }
    })();

    var massacre = global.massacre;

    var getTimes = function(request, sender, response) {
      global.configStore.get(function(err, config) {
        if (config.ninja === true) {
          massacre.getTimes(request.url, function(times) {
            response({
              times : times
            });
          });
        } else {
          response({
            times : -1
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
        if (config.ninja === true) {
          var url = request.url;
          massacre.getTimes(url, function(times) {
            if (times < 1) {
              massacre.addPower(Number(request.line), function(power) {
                massacre.addTimes(url, function(t) {
                  end(t, power);
                });
              });
            } else {
              massacre.addTimes(url, function(t) {
                massacre.getPower(function(power) {
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

    massacre.getPower(function(power) {
      updateBadge(power);
    });
  }(this));
