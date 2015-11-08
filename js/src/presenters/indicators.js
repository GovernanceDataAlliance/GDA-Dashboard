var _ = require('lodash');

var IndicatorsPresenter = {
  forComparison: function(collections) {
    var keys = _.uniq(_.flatten(
      collections.map(function(indicators) {
        return indicators.pluck('short_name');
      })
    ));

    var scoresForComparison = [];
    _.each(keys, function(key) {
      var indicators = collections.map(function(collection) { return collection.findWhere({short_name: key}); });
      var indicatorDefinition = _.compact(indicators)[0],
          row = [indicatorDefinition.get('short_name')];

      _.each(indicators, function(indicator) {
        if (indicator && indicator.get('score')) {
          row.push(indicator.get('score'));
        } else {
          row.push('-');
        }
      });

      scoresForComparison.push(row);
    });

    return scoresForComparison;
  }
};

module.exports = IndicatorsPresenter;
