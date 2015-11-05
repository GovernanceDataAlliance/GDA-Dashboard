var CountryView = require('../../../src/views/countries/country.js');

describe('Country View', function() {
  describe('new', function() {
    it('throws an Exception if no ISO is supplied', function() {
      var countryView = function() { new CountryView() };
      expect(countryView).toThrow();
    });
  });
});
