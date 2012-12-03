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
          treeName : tree
        }
      }
    };

    var updateStates = function(tree) {
      _.delay(function() {
        var request = getCurrentRepo();
        if (_.isUndefined(request)) {
          return;
        }
        request.type = 'states';
        request.tree = tree;
        chrome.extension.sendMessage(request);
      });
    };

    var applyNode = function(prop, tree, path, value) {
      var node = _.find(tree, function(s) {
        return s.path === path
      });
      if (node) {
        node[prop] = value;
      }
    };
    var setVisible = _.partial(applyNode, 'visible');
    var setState = _.partial(applyNode, 'state');

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
        var dom = Handlebars.templates.repo_tree({
          root : _.head(response),
          tree : _.tail(response)
        });
        var blank = ($(window).width() - $('.container').width()) / 2 - 16;
        $(dom).css({
          'width' : blank
        }).appendTo('body');
        var getSrc = function(name) {
          return chrome.extension.getURL("content/img/" + name + ".png");
        };
        _.delay(function() {
          _(['expand', 'collapse']).each(function(e) {
            $('.actions img.' + e).attr('src', getSrc(e));
          });
        });
        var applyAllRow = function(from, to, fn) {
          $('.row[data-path][data-level]').each(function() {
            var $this = $(this);
            var path = $this.data('path');
            $this.find('.state').each(function() {
              $(this).removeClass(from).addClass(to);
              setState(response, path, to);
            });
            fn($this, path);
          });
          updateStates(response);
        };
        $('.tree_action .expand').on('click', function(event) {
          applyAllRow('collapsed', 'expanded', function($this, p) {
            setVisible(response, p, true);
            $this.show();
          });
        });
        $('.tree_action .collapse').on('click', function(event) {
          applyAllRow('expanded', 'collapsed', function($this, p) {
            var level = $this.data('level');
            if (1 < level) {
              setVisible(response, p, false);
              $this.hide();
            }
          });
        });
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
            setState(response, path, 'expanded');
            $states.each(function() {
              var $r = getParentRow(this);
              var p = $r.data('path');
              if (level + 1 == $r.data('level') && -1 < p.indexOf(path)) {
                setVisible(response, p, true);
                $r.show();
              }
            });
          } else {
            $this.removeClass('expanded').addClass('collapsed');
            setState(response, path, 'collapsed');
            $states.each(function() {
              var $r = getParentRow(this);
              var p = $r.data('path');
              if (level < $r.data('level') && -1 < p.indexOf(path)) {
                $(this).removeClass('expanded').addClass('collapsed');
                setState(response, p, 'collapsed');
                setVisible(response, p, false);
                $r.hide();
              }
            });
          }
          updateStates(response);
        });
      });
    };
    requestTree();
  }(this));
