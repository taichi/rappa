(function() {
  var currentWindowOnload = window.onload;
  mocha.setup({
    ui : 'bdd',
    // http://src.chromium.org/viewvc/chrome/trunk/src/chrome/renderer/resources/extensions/json_schema.js?annotate=124898#l175
    // https://code.google.com/p/chromium/issues/detail?id=170872
    globals : 'schemaTypes'
  });
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    mocha.run();
  };
})();
