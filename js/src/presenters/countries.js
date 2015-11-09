var CountriesPresenter = {
  forComparison: function(countries) {
    var expectedLength = 3;
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
