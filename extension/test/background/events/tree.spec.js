describe('events/tree', function() {
  /*jshint expr:true */
  //
  'use strict';

  var send = chrome.extension.sendMessage;
  describe('tree', function() {
    var spec = function(done) {
      var topping = cream(done);
      send({
        type : 'tree',
        user : 'test032',
        repo : 'testrepo',
        hash : 'db05d07d324b93f8f683426134271546d9cf6346',
        treeName : 'master'
      }, function(tree) {
        topping.assert(function() {
          expect(tree).ok;
        });
      });
    };
    it('should work slowly', function(done) {
      this.timeout(3000);
      spec(done);
    });
    it('should work faster because of using cache.', function(done) {
      this.timeout(200);
      spec(done);
    });
  });
  describe('status', function() {
    it('should work normally', function(done) {
      var status = {
        type : 'status',
        user : 'test032',
        repo : 'testrepo',
        hash : 'db05d07d324b93f8f683426134271546d9cf6346',
        treeName : 'master',
        tree : [{
          name : 'aaa',
          href : 'hoge'
        }, {
          name : 'aaa/bbb'
        }]
      };
      var topping = cream(done);
      send(status, function(ok) {
        send({
          type : 'tree',
          user : 'test032',
          repo : 'testrepo',
          hash : 'db05d07d324b93f8f683426134271546d9cf6346',
          treeName : 'master'
        }, function(tree) {
          topping.assert(function() {
            expect(ok).equal('ok');
            expect(tree).eql(status.tree);
          });
        });
      });
    });
  });

});
