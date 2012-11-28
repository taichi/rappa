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
      repo.getTree('master?recursive=true', function(err, tree) {
        if (err) {
          throw err;
        }
        var trees = _.reduce(tree, function(memo, e){
          if(e["type"] === "tree") {
            memo.push(e["path"]);
          }
        }, []);
        trees.sort();
        response(trees);
      });
    };

    var events = {
      tree : getTree,
      line : setPower,
      times : getTimes
    };
    chrome.extension.onMessage.addListener(function(request, sender, response) {
      var fn = events[request.type];
      if (fn) {
        fn(request, sender, response);
      }
    });
    updateBadge(massacre.getPower());

  }(this));
