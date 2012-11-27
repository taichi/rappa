( function(global) {
    var send = chrome.extension.sendMessage;
    var state = ['blur_heavy', 'blur_middle', 'blur_light'];

    var handleTimes = function(response) {
      var times = Number(response.times);
      console.log('TIMES ' + times);
      var content = $('#files .highlight:visible');
      $(state).each(function(i, s) {
        content.removeClass(s);
      });
      var s = 3;
      if (times < 4) {
        s = times;
      }
      content.addClass(state[s]);
    };

    var requestTimes = send.bind(null, {
      type : 'times',
      url : location.href
    }, handleTimes);

    $(document).observe({
      subtree : true,
      childList : true,
      attributes : false
    }, '#files .highlight', requestTimes);

    $(window).on('scroll', function() {
      var bottom = $(document).height() - $(window).height();
      if ($(this).scrollTop() >= bottom) {
        var n = $('.line_numbers :last-child').first().text();
        send({
          type : 'line',
          url : location.href,
          line : n
        }, handleTimes);
      }
    });

    requestTimes();
  }(this));
