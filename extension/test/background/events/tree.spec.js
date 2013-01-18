describe('events/tree', function() {
  it('should work normally', function(done) {
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
  });
}); 