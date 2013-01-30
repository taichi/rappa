(function(global) {
  /*global Github:false */
  //
  'use strict';
  var treeCache = ( function() {
      var cache = {};
      var makeCacheKey = function(request) {
        return [request.user, request.repo, request.hash].join('/');
      };
      var makeCacheEntry = function(value) {
        return {
          time : Date.now(),
          value : value
        };
      };
      var cache_limit = 1000 * 60 * 60 * 2;
      var patrol_delay = 1000 * 60 * 20;
      (function expireCache() {
        var now = Date.now();
        _(_.keys(cache)).each(function(v) {
          var diff = now - cache[v].time;
          if (cache_limit < diff) {
            delete cache[v];
          }
        });
        _.delay(expireCache, patrol_delay);
      })();
      return {
        getCache : function(request) {
          var entry = cache[makeCacheKey(request)];
          if (entry) {
            entry.time = Date.now();
            return entry.value;
          }
        },
        setCache : function(request, value) {
          cache[makeCacheKey(request)] = makeCacheEntry(value);
        }
      };
    }());

  var getTree = ( function() {
      var newTree = function(request, callback) {
        global.configStore.get(function(err, config) {
          var gh = config.github || {};
          var github = new Github({
            username : gh.account,
            password : gh.password,
            auth : 'basic'
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
        });
      };
      return function(request, sender, response) {
        var cached = treeCache.getCache(request);
        if (_.isUndefined(cached)) {
          newTree(request, function(trees) {
            treeCache.setCache(request, trees);
            response(trees);
          });
          return true;
        }
        response(cached);
      };
    }());

  var updateStatus = function(request, sender, response) {
    treeCache.setCache(request, request.tree);
    response('ok');
  };

  global.events.tree = getTree;
  global.events.status = updateStatus;
})(this);
