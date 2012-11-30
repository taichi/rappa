// TODO ストレージする的なアレ。
// IndexedDBかWebStorageどっちを使うか…
( function(global) {
    global.Massacre = function() {
      this.urls = {};
      this.power = 0;
      var self = this;

      this.getTimes = function(url) {
        var hash = CryptoJS.SHA256(url);
        var times = self.urls[hash];
        if (_.isUndefined(times) === false) {
          times = 0;
        }
        return times;
      };

      this.addTimes = function(url) {
        var hash = CryptoJS.SHA256(url);
        var times = self.urls[hash];
        if (_.isUndefined(times) === false) {
          times = 0;
        }
        self.urls[hash] = ++times;
      };

      this.addPower = function(lines) {
        self.power += lines;
      };

      this.getPower = function() {
        return self.power;
      };
    };
  }(this));
