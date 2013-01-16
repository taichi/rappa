(function() {
  var currentWindowOnload = window.onload;
  mocha.setup('bdd');
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    mocha.run();
  };
})();
