var Backbone = require('backbone');
var Presenter = require('../../src/presenters/indicators.js');

var indicatorJSON = require('../responses/indicators_presenter.json').forComparison;
var Indicators = require('../../src/collections/indicators.js');

describe('Indicators Presenter', function() {
  describe('.forComparison', function() {
    var collections,
        result;

    beforeEach(function() {
      collections = [
        new Indicators(indicatorJSON[0]),
        new Indicators(indicatorJSON[1])
      ];

      result = Presenter.forComparison(collections);
    });

    it('rotates multiple collections of Indicators for renderin', function() {
      var expected = [
        ["irm_action_plan_percent_star",19,23,'-'],
        ["irm_action_plan_count_star",4,7,'-'],
        ["ogp_regular_consult_forum",1,'-','-'],
        ["environmental_democracy_index",2.14,'-','-'],
        ["rti_rating",100,69,'-'],
        ["resource_governance_index",88,'-','-']
      ];

      expect(result).toEqual(expected);
    });
  });
});
