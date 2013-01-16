describe('storage', function() {
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  it('types', function() {
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
    afterEach(function() {
      local.remove();
    });
    it('#set and #get', function(done) {
      var topping = cream(done);
      var model = {
        a : 1,
        b : 2
      };
      local.set(model, function(err) {
        local.get(function(err, m) {
          topping.ifError(err);
          topping.assert(function() {
            assert.deepEqual(m, model);
          });
        });
      });
    });
  });
});
