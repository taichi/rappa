angular.module('chrome', []).factory('chrome.background', function() {
  return chrome.extension.getBackgroundPage();
});
