describe('events/massacre', function() {
  /*jshint expr:true */
  //
  'use strict';
  var send = chrome.extension.sendMessage;
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });
  before(function(done) {
    bg.configStore.clear(done);
  });
  after(function(done) {
    bg.configStore.clear(done);
  });

  describe('abbreviate', function() {
    var abbreviate;
    before(function() {
      abbreviate = bg._test.abbreviate;
      expect(abbreviate).ok;
    });
    it('should not abbreviate less than 1000', function() {
      expect(abbreviate(1000 - 1)).equal('999');
    });
    it('should abbreviate 10^3 to 1K', function() {
      expect(abbreviate(1000)).equal('1.0K');
      expect(abbreviate(1500)).equal('1.5K');
    });
    it('should be 99k', function() {
      expect(abbreviate(99999)).equal('99K');
    });
    it('should abbreviate 10^6 to 1M', function() {
      expect(abbreviate(Math.pow(1000, 2))).equal('1.0M');
    });
    it('should abbreviate 10^9 to 1G', function() {
      expect(abbreviate(1000000000)).equal('1.0G');
      expect(abbreviate(1900000000)).equal('1.9G');
    });
    it('should be 99T', function() {
      expect(abbreviate(Math.pow(10, 14) - 1)).equal('99T');
    });
    it('should abbreviate less than 100K appropriately', function() {
      expect(abbreviate(Math.pow(1000, 1) * 100 - 1)).equal('99K');
    });
    it('should abbreviate 100K to 0.1M', function() {
      expect(abbreviate(Math.pow(1000, 1) * 100)).equal('0.1M');
    });
    it('should be 0.9M', function() {
      expect(abbreviate(900000)).equal('0.9M');
      expect(abbreviate(999999)).equal('0.9M');
    });
    it('should be OMG', function() {
      expect(abbreviate(Math.pow(10, 14))).equal('OMG');
      expect(abbreviate(Math.pow(10, 22))).equal('OMG');
    });
  });

  describe('line', function() {
    beforeEach(function(done) {
      bg.massacre.clear(done);
    });
    afterEach(function(done) {
      bg.massacre.clear(done);
    });

    context('ninja mode', function() {
      before(function(done) {
        bg.configStore.set({
          ninja : true
        }, done);
      });
      it('should work normally', function(done) {
        var topping = cream(done);
        send({
          type : 'line',
          url : 'http://example.com/test/repo/README.md',
          line : 101
        }, function(resp) {
          topping.assert(function() {
            expect(resp.times).equal(1);
          });
        });
      });
    });

    context('NO ninja mode', function() {
      before(function(done) {
        bg.configStore.set({
          ninja : false
        }, done);
      });
      it('should not keep lines', function(done) {
        var topping = cream(done);
        send({
          type : 'line'
        }, function(resp) {
          topping.assert(function() {
            expect(resp.times).equal(-1);
          });
        });
      });
    });
  });

  describe('times', function() {
    beforeEach(function(done) {
      bg.massacre.clear(done);
    });
    afterEach(function(done) {
      bg.massacre.clear(done);
    });

    context('ninja mode', function() {
      before(function(done) {
        bg.configStore.set({
          ninja : true
        }, done);
      });
      beforeEach(function(done) {
        send({
          type : 'line',
          url : 'http://example.com/test/repo/README.md',
          line : 101
        }, function() {
          done();
        });
      });
      it('should work normally', function(done) {
        var topping = cream(done);
        send({
          type : 'times',
          url : 'http://example.com/test/repo/README.md'
        }, function(resp) {
          topping.assert(function() {
            expect(resp.times).equal(1);
          });
        });
      });
    });
    context('NO ninja mode', function() {
      before(function(done) {
        bg.configStore.set({
          ninja : false
        }, done);
      });
      it('should not return times', function(done) {
        var topping = cream(done);
        send({
          type : 'times'
        }, function(resp) {
          topping.assert(function() {
            expect(resp.times).equal(-1);
          });
        });
      });
    });
  });
});
