( function(global) {
    var ba = chrome.browserAction;
    ba.setBadgeBackgroundColor({
      color : '#FF6633'
    });
    var updateBadge = function(value) {
      var str = String(value);
      ba.setBadgeText({
        text : str
      });
      ba.setTitle({
        title : str
      });
    };
    var massacre = new Massacre();

    var returnTimes = function(request, sender, response) {
      response({
        times : massacre.getTimes(request.url)
      });
    };

    var setMassacre = function(request, sender, response) {
      var url = request.url;
      var times = massacre.getTimes(url);
      if (times < 1) {
        massacre.addPower(Number(request.line));
      }
      massacre.addTimes(url);
      updateBadge(massacre.getPower());
      returnTimes(request, sender, response);
    };

    var events = {
      line : setMassacre,
      times : returnTimes
    };
    chrome.extension.onMessage.addListener(function(request, sender, response) {
      var fn = events[request.type];
      if (fn) {
        fn(request, sender, response);
      }
    });
    updateBadge(massacre.getPower());

  }(this));
