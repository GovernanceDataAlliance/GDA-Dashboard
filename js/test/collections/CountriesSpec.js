var _ = require('lodash');

var Countries = require('../../src/collections/countries.js');

describe("Countries", function() {
  it('exists', function() {
    expect(Countries).toBeDefined();
  });

  describe(".url", function() {
    var url;

    beforeEach(function() {
      var collection = new Countries();
      url = collection.url();
    });

    it("appends a WHERE clause to remove countries without regions", function() {
      var paramsRegex = new RegExp("WHERE region > 0$");
      expect(url).toMatch(paramsRegex);
    });
  });

  describe(".groupByRegion", function() {
    var collection,
        groupedCollection;

    var africanCountries = [{
      region_name: 'Africa',
      name: 'Angola'
    }, {
      region_name: 'Africa',
      name: 'Madagascar'
    }];

    var oceanicCountries = [{
      region_name: 'Oceania',
      name: 'Kiribati'
    }];

    beforeEach(function() {
      collection = new Countries(africanCountries.concat(oceanicCountries));
      groupedCollection = collection.groupByRegion();
    });

    it("returns an object with 2 regions", function() {
      expect(_.size(groupedCollection)).toBe(2);
    });

    it("returns an object with African countries grouped together", function() {
      var african = groupedCollection['Africa'];
      expect(african).toBeDefined();
      expect(_.pluck(african, 'name')).toEqual(
        ['Angola', 'Madagascar']);
    });

    it("returns an object with Oceanic countries grouped together", function() {
      var oceania = groupedCollection['Oceania'];
      expect(oceania).toBeDefined();
      expect(oceania[0].name).toEqual('Kiribati');
    });
  });
});
