describe('main', function() {
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('configStore', function() {
    var cs;
    before(function() {
      cs = bg.configStore;
      assert.ok(cs);
    });

    it('#get', function(done) {
      var topping = cream(done);
      cs.get(function(err, config) {
        topping.ifError(err);
        topping.assert(function() {
          assert.ok(config.github);
        });
      });
    });
  });
});
