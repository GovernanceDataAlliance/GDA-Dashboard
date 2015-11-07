var Indicator = require('../../src/models/indicator.js');
var CONFIG = require('../../config.json');

describe("Indicator", function() {

  it('exists', function() {
    expect(Indicator).toBeDefined();
  });

  var indicator;
  beforeEach(function() {
    indicator = new Indicator();
  });

  it('has the correct CartoDB username', function() {
    var user_name = CONFIG.cartodb && CONFIG.cartodb.user_name;
    expect(indicator.user_name).toBe(user_name || "");
  });

  it('has the correct CartoDB table', function() {
    var table = CONFIG.cartodb && CONFIG.cartodb.indicator_config_table_name;
    expect(indicator.table).toBe(table || "");
  });

});
