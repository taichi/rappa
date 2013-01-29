angular.module('chrome', [], ['$provide',
function($provide) {
  //
  'use strict';
  $provide.factory('chrome.background', function() {
    return chrome.extension.getBackgroundPage();
  });
  $provide.factory('chrome.i18n', function() {
    return chrome.i18n;
  });
}]);
