describe('model', function() {
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('massacre', function() {
    var massacre;
    beforeEach(function() {
      massacre = bg.massacre;
      assert.ok(massacre);
    });
    afterEach(function(done) {
      var topping = cream(done);
      massacre.clear(function(err) {
        topping.ifError(err);
        done();
      });
    });
    it('#addTimes', function(done) {
      var topping = cream(done);
      massacre.addTimes('http://example.com', function(err, times) {
        topping.ifError(err);
        topping.assert(function() {
          assert.equal(times, 1);
        });
      });
    });

    it('#addPower', function(done) {
      var topping = cream(done);
      massacre.addPower(71, function(err, power) {
        topping.ifError(err);
        topping.assert(function() {
          assert.equal(power, 71);
        });
      });
    });

    it('#getMetrix', function(done) {
      var topping = cream(done);
      massacre.addTimes('http://example.org', function() {
        massacre.addPower(11, function(err) {
          topping.ifError(err);
          massacre.getMetrix(function(err, metrix) {
            topping.assert(function() {
              assert.deepEqual(metrix, {
                power : 11,
                urls : 1
              });
            });
          });
        });
      });
    });
  });

});
