var Presenter = require('../../src/presenters/countries.js');

describe('Countries Presenter', function() {
  describe('.forComparison', function() {
    describe('given a two-element array', function() {
      var input = [{name:1},{name:2}],
          output;

      beforeEach(function() {
        output = Presenter.forComparison(input);
      });

      it('pads the array to three elements', function() {
        var expectedOutput = [1,2,'-'];
        expect(output).toEqual(expectedOutput);
      });
    });

    describe('given a three-element array', function() {
      var input = [{name: 1}, {name: 2}, {name: 3}],
          output;

      beforeEach(function() {
        output = Presenter.forComparison(input);
      });

      it('returns the array untouched', function() {
        var expectedOutput = [1,2,3];
        expect(output).toEqual(expectedOutput);
      });
    });
  });
});
