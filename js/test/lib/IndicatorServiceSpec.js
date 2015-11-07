var _ = require('lodash');

var IndicatorService = require('../../src/lib/services/indicator.js'),
    Indicators = require('../../src/collections/indicators.js');

var rawIndicators = require('../responses/indicators.json').successSmall.rows;

describe('Indicator Service', function() {
  describe('.groupById', function() {
    describe('given a list of indicator values', function() {
      var results;

      beforeEach(function() {
        var collection = new Indicators(rawIndicators);
        results = IndicatorService.groupById(collection).toJSON();
      });

      it('groups them by indicator', function() {
        expect(results.length).toBe(2);
      });

      it('nests data in each indicator', function() {
        var first = _.findWhere(results, {short_name: "irm_action_plan_count_star"});
        expect(first.data).toBeDefined();
        expect(first.data.length).toBe(1);
        expect(first.data).toEqual([{
          year: 2014,
          score: 7
        }]);

        var second = _.findWhere(results, {short_name: "ogp_regular_consult_forum"});
        expect(second.data).toBeDefined();
        expect(second.data.length).toBe(2);
        expect(second.data).toEqual([{
          year: 2015,
          score: 0
        }, {
          year: 2014,
          score: 0
        }]);
      });
    });
  });
});
