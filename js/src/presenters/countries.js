var _ = require('lodash');

var CountriesPresenter = {
  forComparison: function(countries, order) {
    if (order !== undefined) {
      countries = _.map(order, function(id) {
        return _.findWhere(countries, {iso3: id});
      });
    }

    var expectedLength = 1;
    if (countries.length >= expectedLength) {
      return countries.map(function(c) { return c.name });
    }

    var paddedArray = [];
    var i = 0;
    for (; i<expectedLength; i++) {
      if (countries[i] !== undefined) {
        paddedArray.push(countries[i].name);
      } else {
        paddedArray.push('-');
      }
    }

    return paddedArray;
  }
};

module.exports = CountriesPresenter;
