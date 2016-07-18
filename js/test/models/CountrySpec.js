var Country = require('../../src/models/country.js');
var CONFIG = require('../../config.json');

describe("Country", function() {

  it('exists', function() {
    expect(Country).toBeDefined();
  });

  var country;
  beforeEach(function() {
    country = new Country();
  });

  it('has the correct CartoDB username', function() {
    var user_name = CONFIG.cartodb && CONFIG.cartodb.user_name;
    expect(country.user_name).toBe(user_name || "");
  });

  it('has the correct CartoDB table', function() {
    var table = CONFIG.cartodb && CONFIG.cartodb.country_join;
    expect(country.table).toBe(table || "");
  });

});
