( function(global) {
    var storage = global.storage.local('massacre');
    var loadModel = function(callback) {
      storage.get(function(err, model) {
        if (err) {
          throw err;
        }
        model.urls = model['urls'] || {};
        model.power = model['power'] || 0;
        callback(model);
      });
    };

    var saveModel = function(model, callback) {
      storage.set(model, function(err) {
        if (err) {
          throw err;
        }
        callback();
      });
    };

    var calcHash = function(url) {
      var u = purl(url).attr('path');
      return CryptoJS.SHA256(u);
    };

    var getTimes = function(url, callback) {
      loadModel(function(model) {
        var hash = calcHash(url);
        var times = model.urls[hash];
        if (_.isUndefined(times)) {
          times = 0;
        }
        callback(hash, model, times);
      });
    };
    
    var getMetrix = function(callback) {
      loadModel(function(model) {
        var metrix = {};
        metrix.power = model.power;
        metrix.urls = _.keys(model.urls).length;
        callback(false, metrix);
      });
    };

    global.massacre = {
      getTimes : function(url, callback) {
        getTimes(url, function(hash, model, times) {
          callback(times);
        });
      },
      addTimes : function(url, callback) {
        getTimes(url, function(hash, model, times) {
          model.urls[hash] = ++times;
          saveModel(model, function() {
            callback(times);
          });
        });
      },
      addPower : function(power, callback) {
        loadModel(function(model) {
          model.power += power;
          saveModel(model, function() {
            callback(model.power);
          });
        });
      },
      getPower : function(callback) {
        loadModel(function(model) {
          callback(model.power);
        });
      },
      getMetrix : getMetrix,
      clear : storage.remove
    };
  }(this));
