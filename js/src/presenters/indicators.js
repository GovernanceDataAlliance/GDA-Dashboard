var _ = require('lodash');

var IndicatorsPresenter = {
  
  //We are not ussing this anymore
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
          row = [indicatorDefinition.get('product_name')];

      var i = 0;
      for (; i<3; i++) {
        var indicator = indicators[i];
        if (indicator && indicator.get('score')) {
          row.push(indicator.get('score'));
        } else {
          row.push('-');
        }
      };

      scoresForComparison.push(row);
    });

    return scoresForComparison;
  }

};

module.exports = IndicatorsPresenter;
