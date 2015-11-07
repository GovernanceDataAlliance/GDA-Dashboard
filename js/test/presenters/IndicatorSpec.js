var Backbone = require('backbone');
var Presenter = require('../../src/presenters/indicators.js');

describe('Indicators Presenter', function() {
  describe('.forComparison', function() {
    var collections,
        result;

    beforeEach(function() {
      collections = [
        new Backbone.Collection([{score: 1},{score: 2},{score: 3}]),
        new Backbone.Collection([{score: 4},{score: 5},{score: 6}]),
        new Backbone.Collection([{score: 7},{score: 8},{score: 9}]),
      ];

      result = Presenter.forComparison(collections);
    });

    it('rotates multiple collections of Indicators for renderin', function() {
      var expected = [
        [{score: 1},{score: 4},{score: 7}],
        [{score: 2},{score: 5},{score: 8}],
        [{score: 3},{score: 6},{score: 9}]
      ];

      expect(result).toEqual(expected);
    });
  });
});
