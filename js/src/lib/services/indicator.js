var _ = require('lodash');

var Indicators = require('../../collections/indicators.js');

var IndicatorService = {

  groupScoresById: function(indicators) {
    var groupedIndicators = [];
    var ids = _.uniq(indicators.pluck('short_name'))

    ids.forEach(function(id) {
      var matchingIndicators = indicators.where({'short_name': id});

      var data = _.map(matchingIndicators, function(indicator) {
        return { year: indicator.get('year'), score: indicator.get('score') };
      });

      var newIndicator = matchingIndicators[ matchingIndicators.length  - 1 ];
      newIndicator.set('data', data);

      groupedIndicators.push(newIndicator);
    });

    return new Indicators(groupedIndicators);
  }
};

module.exports = IndicatorService;
