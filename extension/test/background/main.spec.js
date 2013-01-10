describe('main', function() {
  var bg;
  beforeEach(function() {
    bg = chrome.extension.getBackgroundPage();
  });

  describe('configStore', function() {
    it('#get', function() {
      expect(bg.configStore).toBeDefined();
    });
  });
});
