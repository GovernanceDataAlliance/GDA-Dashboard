var sinon = require('sinon');

var Indicators = require('../../src/collections/indicators.js');

var responses = require('../responses/indicators.json');

describe("Indicators", function() {
  var requests;

  beforeEach(function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  it('exists', function() {
    expect(Indicators).toBeDefined();
  });

  describe('.downloadForCountry', function() {
    describe('given an ISO code', function() {
      var ISO = 'GBR',
      url;

      beforeEach(function() {
        var collection = new Indicators({});
        url = collection.downloadForCountry(ISO);
      });

      it('returns a CartoDB URL with format=csv', function() {
        var paramsRegex = new RegExp("\\?q=SELECT .* FROM indicator_data AS d INNER JOIN indicator_config AS c ON d.short_name = c.short_name WHERE d.iso = '"+ISO+"' &format=csv");
        expect(url.replace(/\n/gm," ").replace(/\s+/g,' ').trim()).
          toMatch(paramsRegex);
      });
    });
  });

  // describe('.forCountry', function() {
  //   describe('given an ISO code', function() {
  //     var ISO = 'ALB';
  //     var request;

  //     beforeEach(function() {
  //       collection = new Indicators({});
  //       collection.forCountry(ISO);

  //       request = requests[0];
  //       request.respond(200, { "Content-Type": "application/json" },
  //         JSON.stringify(responses.success));
  //     });

  //     it('sends a JOIN query to get all attributes', function() {
  //       var paramsRegex = new RegExp("\\?q=SELECT .* FROM indicator_data d INNER JOIN indicator_config AS c ON d.short_name = c.short_name WHERE d.iso = '"+ISO+"'");
  //       expect(request.url.replace(/\n/gm," ").replace(/\s+/g,' ').trim()).
  //         toMatch(paramsRegex);
  //     });
  //   });
  // });
});
