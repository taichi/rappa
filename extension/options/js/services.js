optionsModule.factory('background', function() {
  var bg = chrome.extension.getBackgroundPage();
  return {
    setConfig : function(config, callback) {
      bg.configStore.setConfig(config, callback);
    },
    getConfig : function(callback) {
      bg.configStore.getConfig(callback);
    }
  };
});
