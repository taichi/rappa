(function(global) {
  //
  'use strict';
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-37265569-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  })();

  // cf. https://developers.google.com/analytics/devguides/collection/gajs/methods/
  // I/F of Google Analytics.
  global._gaq = _gaq;
})(this);
