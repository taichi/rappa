(function(global) {
  /*global purl:false, CryptoJS:false*/
  //
  'use strict';
  var storage = global.storage.local('massacre');
  var loadModel = function(callback) {
    storage.get(function(err, model) {
      model.urls = model.urls || {};
      model.power = model.power || 0;
      callback(err, model);
    });
  };

  var saveModel = _.bind(storage.set, storage);

  var calcHash = function(url) {
    var u = purl(url).attr('path');
    return CryptoJS.SHA256(u);
  };

  var getTimes = function(url, callback) {
    loadModel(function(err, model) {
      if (err) {
        callback(err);
        return;
      }
      var hash = calcHash(url);
      var times = model.urls[hash];
      if (_.isUndefined(times)) {
        times = 0;
      }
      callback(false, hash, model, times);
    });
  };

  global.massacre = {
    getTimes : function(url, callback) {
      getTimes(url, function(err, hash, model, times) {
        callback(err, times);
      });
    },
    addTimes : function(url, callback) {
      getTimes(url, function(err, hash, model, times) {
        if (err) {
          callback(err);
          return;
        }
        model.urls[hash] = ++times;
        saveModel(model, function(err) {
          callback(err, times);
        });
      });
    },
    addPower : function(power, callback) {
      loadModel(function(err, model) {
        if (err) {
          callback(err);
          return;
        }
        model.power += power;
        saveModel(model, function(err) {
          callback(err, model.power);
        });
      });
    },
    getPower : function(callback) {
      loadModel(function(err, model) {
        callback(err, model.power);
      });
    },
    getMetrix : function(callback) {
      loadModel(function(err, model) {
        callback(err, {
          power : model.power,
          urls : _.keys(model.urls).length
        });
      });
    },
    clear : storage.remove
  };
})(this);
