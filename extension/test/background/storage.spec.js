describe('storage', function() {
  /*jshint expr:true */
  //
  'use strict';
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  it('has 3 types', function() {
    expect(bg.storage.local).ok;
    expect(bg.storage.sync).ok;
    expect(bg.storage.managed).ok;
  });

  describe('local', function() {
    var local;
    beforeEach(function() {
      local = bg.storage.local('testXXX');
      expect(local).ok;
    });
    afterEach(function(done) {
      var topping = cream(done);
      local.remove(function(err) {
        topping.ifError(err);
        done();
      });
    });

    context('#set with', function() {
      var model = {
        a : 1,
        b : 2
      };
      beforeEach(function(done) {
        var topping = cream(done);
        local.set(model, function(err) {
          topping.ifError(err);
          done();
        });
      });

      it('#get works normally', function(done) {
        var topping = cream(done);
        local.get(function(err, m) {
          topping.ifError(err);
          topping.assert(function() {
            expect(m).eql(model);
          });
        });
      });

      it('#getBytesInuse works normally', function(done) {
        var topping = cream(done);
        local.getBytesInUse(function(err, bytes) {
          topping.ifError(err);
          topping.assert(function() {
            expect(bytes).above(0);
          });
        });
      });

    });
  });
});
