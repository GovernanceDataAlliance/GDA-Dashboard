var _ = require('lodash');
var sinon = require('sinon');

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

    // it("appends a WHERE clause to remove countries without regions", function() {
    //   var paramsRegex = new RegExp("WHERE region > 0$");
    //   expect(url).toMatch(paramsRegex);
    // });
  });

  describe(".forIds", function() {
    var requests;

    beforeEach(function() {
      var xhr = sinon.useFakeXMLHttpRequest();
      requests = [];

      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    describe("given multiple IDs", function() {
      var request;

      beforeEach(function() {
        var collection = new Countries();
        collection.forIds(['GBR', 'ALB']);

        request = requests[0];
        request.respond(200, { "Content-Type": "application/json" }, "[{}]");
      });

    });
  });

  // describe(".groupByRegion", function() {
  //   var collection,
  //       groupedCollection;

  //   var africanCountries = [{
  //     region_name: 'Africa',
  //     name: 'Angola'
  //   }, {
  //     region_name: 'Africa',
  //     name: 'Madagascar'
  //   }];

  //   var oceanicCountries = [{
  //     region_name: 'Oceania',
  //     name: 'Kiribati'
  //   }];

  //   beforeEach(function() {
  //     collection = new Countries(africanCountries.concat(oceanicCountries));
  //     groupedCollection = collection.groupByRegion();
  //   });

  //   it("returns an object with 2 regions", function() {
  //     expect(_.size(groupedCollection)).toBe(2);
  //   });

  //   it("returns an object with African countries grouped together", function() {
  //     var african = groupedCollection['Africa'];
  //     expect(african).toBeDefined();
  //     expect(_.pluck(african, 'name')).toEqual(
  //       ['Angola', 'Madagascar']);
  //   });

  //   it("returns an object with Oceanic countries grouped together", function() {
  //     var oceania = groupedCollection['Oceania'];
  //     expect(oceania).toBeDefined();
  //     expect(oceania[0].name).toEqual('Kiribati');
  //   });
  // });

  // describe('.downloadRanksForIndicator', function() {
  //   describe('given an ID', function() {
  //     var ID = 'environmental_democracy_index',
  //         url;

  //     beforeEach(function() {
  //       var collection = new Countries({});
  //       url = collection.downloadRanksForIndicator(ID);
  //     });

  //     it('returns a CartoDB URL with format=csv', function() {
  //       var paramsRegex = new RegExp("\\?q=SELECT .*, rank\\(\\) OVER \\(PARTITION BY short_name ORDER BY score DESC\\) AS rank FROM indicator_data i JOIN world_borders c ON i.iso=c.iso3 WHERE i.short_name = '"+ID+"' &format=csv");
  //       expect(url.replace(/\n/gm," ").replace(/\s+/g,' ').trim()).
  //         toMatch(paramsRegex);
  //     });
  //   });
  // });

  // describe(".withRankForIndicator", function() {
  //   var requests;

  //   beforeEach(function() {
  //     var xhr = sinon.useFakeXMLHttpRequest();
  //     requests = [];

  //     xhr.onCreate = function (xhr) {
  //       requests.push(xhr);
  //     };
  //   });

  //   describe('given an indicator id', function() {
  //     var ID = 'environmental_democracy_index';
  //     var request;

  //     beforeEach(function() {
  //       collection = new Countries({});
  //       collection.withRankForIndicator(ID);

  //       request = requests[0];
  //       request.respond(200, { "Content-Type": "application/json" }, '[{}]');
  //     });

  //     it('sends a query to get all attributes', function() {
  //       var paramsRegex = new RegExp("\\?q=SELECT .*, rank\\(\\) OVER \\(PARTITION BY short_name ORDER BY score DESC\\) AS rank FROM indicator_data i JOIN world_borders c ON i.iso=c.iso3 WHERE i.short_name = '"+ID+"'");
  //       expect(request.url.replace(/\n/gm," ").replace(/\s+/g,' ').trim()).
  //         toMatch(paramsRegex);
  //     });
  //   });
  // });
});
