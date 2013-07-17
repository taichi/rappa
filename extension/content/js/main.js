(function(global) {
  /*jshint jquery:true*/
  'use strict';

  var send = chrome.extension.sendMessage;
  var state = ['blur_heavy', 'blur_middle', 'blur_light'];

  var handleTimes = function(response) {
    var times = Number(response.times);
    var content = $('#files .highlight:visible');
    $(state).each(function(i, s) {
      content.removeClass(s);
    });
    var bottom = $(document).height() - $(window).height();
    if (20 < bottom) {
      var s = 3;
      if (-1 < times && times < 4) {
        s = times;
      }
      content.addClass(state[s]);
    }
  };

  var requestTimes = function() {
    send({
      type : 'times',
      url : location.href
    }, handleTimes);
  };

  $(document).observe({
    subtree : true,
    childList : true,
    attributes : false
  }, '#files .highlight', function() {
    reachToBottom = false;
    requestTimes();
  });

  var reachToBottom = false;
  $(window).on('scroll', function() {
    var bottom = $(document).height() - $(window).height();
    var scrollTop = $(this).scrollTop();
    if (reachToBottom === false && scrollTop >= bottom) {
      reachToBottom = true;
      var n = $('.blob-line-nums :last-child').first().text();
      send({
        type : 'line',
        url : location.href,
        line : n
      }, handleTimes);
    }
    if (reachToBottom === true && scrollTop < 10) {
      reachToBottom = false;
    }
  });

  requestTimes();
})(this);
