( function(global) {
    var send = chrome.extension.sendMessage;
    var state = ['blur_heavy', 'blur_middle', 'blur_light'];

    var getCurrentRepo = function() {
      var url = $('meta[property="og:url"]').attr('content');
      if (url) {
        var ary = url.split('/');
        return {
          user : ary[3],
          repo : ary[4]
        }
      }
    };
    var requestTree = function() {
      var repo = getCurrentRepo();
      if (repo) {
        repo.type = 'tree';
        send(repo, function(response) {
          console.log(response);
        });
      }
    };
    requestTree();

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
        var n = $('.line_numbers :last-child').first().text();
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
  }(this));
