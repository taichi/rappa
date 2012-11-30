( function(global) {
    var updateBadge = ( function() {
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
      }());

    var massacre = new Massacre();

    var getTimes = function(request, sender, response) {
      response({
        times : massacre.getTimes(request.url)
      });
    };

    var setPower = function(request, sender, response) {
      var url = request.url;
      var times = massacre.getTimes(url);
      if (times < 1) {
        massacre.addPower(Number(request.line));
      }
      massacre.addTimes(url);
      updateBadge(massacre.getPower());
      getTimes(request, sender, response);
    };

    var getTree = function(request, sender, response) {
      var github = new Github({
        auth : "basic" // TODO need auth?
      });
      var repo = github.getRepo(request.user, request.repo);
      repo.getTree(request.branch + '?recursive=true', function(err, tree) {
        if (err) {
          throw err;
        }
        var trees = _.reduce(tree, function(memo, e) {
          if (e['type'] === 'tree') {
            memo.push(request.branch + '/' + e['path']);
          }
          return memo;
        }, [request.branch]);
        trees.sort();
        response(trees);
      });
      return true;
    };

    var events = {
      tree : getTree,
      line : setPower,
      times : getTimes
    };
    chrome.extension.onMessage.addListener(function(request, sender, response) {
      var fn = events[request.type];
      if (fn) {
        return fn(request, sender, response);
      }
      return false;
    });
    updateBadge(massacre.getPower());

  }(this));
