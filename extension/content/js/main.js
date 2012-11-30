( function(global) {
    var send = chrome.extension.sendMessage;
    var state = ['blur_heavy', 'blur_middle', 'blur_light'];

    var getCurrentRepo = function() {
      var url = $('meta[property="og:url"]').attr('content');
      var tree = $('.switcher.repo-tree').attr('data-ref');
      if (url && tree) {
        var ary = url.split('/');
        return {
          user : ary[3],
          repo : ary[4],
          branch : tree
        }
      }
    };
    
    var getCurrentHash = function() {
      var href = $('head link[rel="permalink"]').attr('href');
      if(href) {
        return href.split('/')[3];
      }
    };

    var makeRepoTree = function(repo, array) {
      return _.map(array, function(path) {
        var ary = path.split('/');
        var level = ary.length - 1;
        var href = ['https://github.com', repo.user, repo.repo, 'tree', path].join('/');
        return {
          path : path,
          level : level,
          href : href,
          name : _.last(ary),
          visible : level < 2,
          indent : level * 9
        }
      });
    };

    var requestTree = function() {
      var request = getCurrentRepo();
      var hash = getCurrentHash();
      if (request && hash) {
        request.type = 'tree';
        request.hash = hash;
        send(request, function(response) {
          if (response.length < 2) {
            return;
          }
          var ary = makeRepoTree(request, response);
          var dom = Handlebars.templates.repo_tree({
            root : _.head(ary),
            tree : _.tail(ary)
          });
          var blank = ($(window).width() - $('.container').width()) / 2 - 16;
          $(dom).css({
            'width' : blank
          }).appendTo('body');
          var getParentRow = function(self) {
            return $(self).parents('.row[data-path][data-level]');
          };
          $('.repo_container .state').on('click', function(event) {
            var $row = getParentRow(this);
            var $states = $row.parent().find('.row .state');
            var path = $row.data('path');
            var level = $row.data('level');
            var $this = $(this);
            if ($this.hasClass('collapsed')) {
              $this.removeClass('collapsed').addClass('expanded');
              $states.each(function() {
                var $r = getParentRow(this);
                if (level + 1 == $r.data('level') && -1 < $r.data('path').indexOf(path)) {
                  $r.show();
                }
              });
            } else {
              $this.removeClass('expanded').addClass('collapsed');
              $states.each(function() {
                var $r = getParentRow(this);
                if (level < $r.data('level') && -1 < $r.data('path').indexOf(path)) {
                  $(this).removeClass('expanded').addClass('collapsed');
                  $r.hide();
                }
              });
            }
          });
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
