var IndicatorsPresenter = {
  forComparison: function(indicators) {
    var rawIndicators = indicators.map(function(i) { return i.toJSON() });

    return rawIndicators[0].map(function(col, i) {
      return rawIndicators.map(function(row) {
        return row[i];
      })
    });
  }
};

module.exports = IndicatorsPresenter;
