describe('storage', function() {
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  it('has 3 types', function() {
    assert.ok(bg.storage.local);
    assert.ok(bg.storage.sync);
    assert.ok(bg.storage.managed);
  });

  describe('local', function() {
    var local;
    beforeEach(function() {
      local = bg.storage.local('testXXX');
      assert.ok(local);
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
            assert.deepEqual(m, model);
          });
        });
      });

      it('#getBytesInuse works normally', function(done) {
        var topping = cream(done);
        local.getBytesInUse(function(err, bytes) {
          topping.ifError(err);
          topping.assert(function() {
            assert(0 < bytes);
          });
        });
      });

    });
  });
});
