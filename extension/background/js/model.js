// TODO ストレージする的なアレ。
// IndexedDBかWebStorageどっちを使うか…
( function(global) {
    global.Massacre = function() {
      this.urls = {};
      this.power = 0;
      var self = this;

      var calcHash = function(url) {
        var u = purl(url).attr('path');
        return CryptoJS.SHA256(u);
      }
      this.getTimes = function(url) {
        var hash = calcHash(url);
        var times = self.urls[hash];
        if (_.isUndefined(times)) {
          times = 0;
        }
        return times;
      };

      this.addTimes = function(url) {
        var hash = calcHash(url);
        var times = self.urls[hash];
        if (_.isUndefined(times)) {
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
