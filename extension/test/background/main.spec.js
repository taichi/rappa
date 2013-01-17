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

  describe('github', function() {
    var tgh;
    before(function() {
      tgh = bg.testGitHub;
      assert.ok(tgh);
      assert.ok(fixture.github, 'fixture should be define');
    });

    it('should success auth', function(done) {
      var topping = cream(done);
      tgh(fixture.github, function(err, user) {
        topping.ifError(err);
        topping.assert(function() {
          assert.ok(user);
          assert.equal(user.type, 'User');
        });
      });
    });
    it('should fail auth', function(done){
      var topping = cream(done);
      tgh({}, function(err, user) {
        topping.assert(function() {
          assert.ok(err);
          assert.equal(err.error, 401);
          assert.equal(err.request.statusText, 'Unauthorized');
        });
      });
    });
  });
});
