describe('events/massacre', function() {
  /*jshint expr:true */
  // @formatter:off
  'use strict';
  var bg;
  before(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('abbreviate', function() {
    var abbreviate;
    before(function() {
      abbreviate = bg._test.abbreviate;
      expect(abbreviate).to.be.ok;
    });
    it('should not abbreviate less than 1000', function() {
      expect(abbreviate(1000-1)).to.equal('999');
    });
    it('should abbreviate 10^3 to 1K', function() {
      expect(abbreviate(Math.pow(1000, 1))).to.equal('1K');
    });
    it('should abbreviate 10^6 to 1M', function() {
      expect(abbreviate(Math.pow(1000, 2))).to.equal('1M');
    });
    it('should abbreviate 10^9 to 1G', function() {
      expect(abbreviate(Math.pow(1000, 3))).to.equal('1G');
    });
    it('should not abbreviate more than or equal to 1T, oh my god!', function() {
      expect(abbreviate(Math.pow(1000, 4))).to.equal('OMG');
    });
    it('should abbreviate less than 100K appropriately', function() {
      expect(abbreviate(Math.pow(1000, 1) * 100 - 1)).to.equal('99K');
    });
    it('should abbreviate 100K to 0.1M', function() {
      expect(abbreviate(Math.pow(1000, 1) * 100)).to.equal('0.1M');
    });
    
  });
});
