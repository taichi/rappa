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

    var treeCache = ( function() {
        var self = {};
        var cache = {};
        var makeCacheKey = function(request) {
          return [request.user, request.repo, request.hash].join('/');
        };
        self.getCache = function(request) {
          return cache[makeCacheKey(request)];
        };
        self.setCache = function(request, value) {
          cache[makeCacheKey(request)] = value;
        };
        return self;
      }());

    var getTree = ( function() {
        var newTree = function(request, callback) {
          var github = new Github({
            auth : "basic" // TODO need auth?
          });
          var repo = github.getRepo(request.user, request.repo);
          repo.getTree(request.treeName + '?recursive=true', function(err, tree) {
            if (err) {
              throw err;
            }
            var makeHref = function(path) {
              return ['https://github.com', request.user, request.repo, 'tree', path].join('/');
            };
            var trees = _.reduce(tree, function(memo, e) {
              if (e.type === 'tree') {
                var path = request.treeName + '/' + e.path;
                var ary = path.split('/');
                var level = ary.length - 1;
                memo.push({
                  path : path,
                  level : level,
                  href : makeHref(path),
                  name : _.last(ary),
                  visible : level < 2,
                  indent : level * 9,
                  state : 'collapsed'
                });
              }
              return memo;
            }, [{
              name : request.treeName,
              href : makeHref(request.treeName)
            }]);
            _.sortBy(trees, 'path');
            callback(trees);
          });
        };
        return function(request, sender, response) {
          var cached = treeCache.getCache(request);
          if (_.isUndefined(cached)) {
            newTree(request, function(trees) {
              treeCache.setCache(trees);
              response(trees);
            });
            return true;
          }
          response(cached);
        };
      }());

    var updateStates = function(request, sender, response) {
      treeCache.setCache(request, request.tree);
      reponse('ok');
    };

    var events = {
      tree : getTree,
      states : updateStates,
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
