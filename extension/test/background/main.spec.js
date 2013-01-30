describe('main', function() {
  /*global fixture:false */
  /*jshint expr:true */
  //
  'use strict';
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('configStore', function() {
    var cs;
    before(function() {
      cs = bg.configStore;
      expect(cs).ok;
    });

    it('#get works normally', function(done) {
      var topping = cream(done);
      cs.get(function(err, config) {
        topping.ifError(err);
        topping.assert(function() {
          expect(config.github).ok;
        });
      });
    });
  });

  describe.skip('github', function() {
    var tgh;
    before(function() {
      tgh = bg.testGitHub;
      expect(tgh).ok;
      expect(fixture.github).ok;
    });

    it('should success auth', function(done) {
      var topping = cream(done);
      tgh(fixture.github, function(err, user) {
        topping.ifError(err);
        topping.assert(function() {
          expect(user).ok;
          expect(user.type).equal('User');
        });
      });
    });
    it('should fail auth', function(done) {
      var topping = cream(done);
      tgh({}, function(err, user) {
        topping.assert(function() {
          expect(err).ok;
          expect(err.error).equal(401);
          expect(err.request.statusText).equal('Unauthorized');
        });
      });
    });
  });
});
