describe('main', function() {
  /*global fixture:false */
  /*jshint expr:true */
  // @formatter:off
  'use strict';
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('configStore', function() {
    var cs;
    before(function() {
      cs = bg.configStore;
      expect(cs).to.be.ok;
    });

    it('#get works normally', function(done) {
      var topping = cream(done);
      cs.get(function(err, config) {
        topping.ifError(err);
        topping.assert(function() {
          expect(config.github).to.be.ok;
        });
      });
    });
  });

  describe.skip('github', function() {
    var tgh;
    before(function() {
      tgh = bg.testGitHub;
      expect(tgh).to.be.ok;
      expect(fixture.github).to.be.ok;
    });

    it('should success auth', function(done) {
      var topping = cream(done);
      tgh(fixture.github, function(err, user) {
        topping.ifError(err);
        topping.assert(function() {
          expect(user).to.be.ok;
          expect(user.type).to.equal('User');
        });
      });
    });
    it('should fail auth', function(done){
      var topping = cream(done);
      tgh({}, function(err, user) {
        topping.assert(function() {
          expect(err).to.be.ok;
          expect(err.error).to.equal(401);
          expect(err.request.statusText).to.equal('Unauthorized');
        });
      });
    });
  });
});
