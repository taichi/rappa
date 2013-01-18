describe('events/tree', function() {
  var spec = function(done) {
    var topping = cream(done);
    chrome.extension.sendMessage({
      type : 'tree',
      user : 'test032',
      repo : 'testrepo',
      hash : 'db05d07d324b93f8f683426134271546d9cf6346',
      treeName : 'master'
    }, function(tree) {
      topping.assert(function() {
        expect(tree).to.be.ok;
      });
    });
  };
  it('should work normally', spec);
  it('should use cache', function(done) {
    this.timeout(200);
    spec(done);
  });
});
