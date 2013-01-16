// workaround codes for mocha.
(function(global) {
  var cream = function(done) {
    return {
      ifError : function(err) {
        if (err) {
          done(err);
        }
      },
      // https://github.com/visionmedia/mocha/pull/278
      assert : function(block) {
        try {
          block();
          done();
        } catch(ex) {
          done(ex);
        }
      }
    };
  };
  global['cream'] = cream;
  if ( typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = cream;
  };
  if ( typeof define === 'function' && define.amd) {
    define('cream', function() {
      return cream;
    });
  }
})(this);
