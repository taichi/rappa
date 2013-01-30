describe('model', function() {
  /*global fixture:false */
  /*jshint expr:true */
  //
  'use strict';
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('massacre', function() {
    var massacre;
    beforeEach(function() {
      massacre = bg.massacre;
      expect(massacre).ok;
    });
    afterEach(function(done) {
      var topping = cream(done);
      massacre.clear(function(err) {
        topping.ifError(err);
        done();
      });
    });
    it('#addTimes works normally', function(done) {
      var topping = cream(done);
      massacre.addTimes('http://example.com', function(err, times) {
        topping.ifError(err);
        topping.assert(function() {
          expect(times).equal(1);
        });
      });
    });

    it('#addPower works normally', function(done) {
      var topping = cream(done);
      massacre.addPower(71, function(err, power) {
        topping.ifError(err);
        topping.assert(function() {
          expect(power).equal(71);
        });
      });
    });

    it('#getMetrix works normally', function(done) {
      var topping = cream(done);
      massacre.addTimes('http://example.org', function() {
        massacre.addPower(11, function(err) {
          topping.ifError(err);
          expect(err).equal(undefined);
          massacre.getMetrix(function(err, metrix) {
            topping.assert(function() {
              expect(metrix).eql({
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
