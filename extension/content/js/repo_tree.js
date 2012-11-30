( function(global) {
    var getCurrentRepo = function() {
      var url = $('meta[property="og:url"]').attr('content');
      var href = $('head link[rel="permalink"]').attr('href');
      var tree = $('.switcher.repo-tree').attr('data-ref');
      if (url && href && tree) {
        var ary = url.split('/');
        return {
          user : ary[3],
          repo : ary[4],
          hash : href.split('/')[3],
          branch : tree
        }
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
      if (_.isUndefined(request)) {
        return;
      }
      request.type = 'tree';
      chrome.extension.sendMessage(request, function(response) {
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
    };
    requestTree();
  }(this));
