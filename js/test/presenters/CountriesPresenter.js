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

    describe('given a collection of models in the wrong order', function() {
      var input = [{iso3: 'ALB', name: 1}, {iso3: 'GBR', name: 2}],
          orderedIds = ['GBR', 'ALB'],
          output;

      beforeEach(function() {
        output = Presenter.forComparison(input, orderedIds);
      });

      it('returns the models matching the input IDs', function() {
        var expectedOutput = [2, 1, '-'];
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
