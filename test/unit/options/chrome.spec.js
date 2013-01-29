describe('chrome', function() {
  //
  'use strict';
  window.chrome = {};
  beforeEach(module('chrome'));

  it('#getBackgroundPage', inject(function($injector) {
    window.chrome.extension = {
      getBackgroundPage : function() {
        return 'CCC';
      }
    };
    var bg = $injector.get('chrome.background');
    expect(bg).equal('CCC');
  }));

  it('#i18n', inject(function($injector) {
    window.chrome.i18n = 'ZZZ';
    var i18n = $injector.get('chrome.i18n');
    expect(i18n).equal('ZZZ');
  }));
});
