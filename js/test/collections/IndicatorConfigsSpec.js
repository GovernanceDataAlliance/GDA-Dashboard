var sinon = require('sinon');

var IndicatorConfigs = require('../../src/collections/indicator_configs.js');

var responses = require('../responses/indicator_configs.json');

describe("IndicatorConfigs", function() {
  var requests;

  beforeEach(function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  it('exists', function() {
    expect(IndicatorConfigs).toBeDefined();
  });

  describe('.fetch', function() {
    var request;

    beforeEach(function() {
      collection = new IndicatorConfigs();
      collection.fetch();

      request = requests[0];
      request.respond(200, { "Content-Type": "application/json" },
        JSON.stringify(responses.success));
    });

    it('sends a query to get all Indicator definitions', function() {
      var paramsRegex = new RegExp("\\?q=SELECT \\* FROM indicator_config");
      expect(request.url).toMatch(paramsRegex);
    });
  });
});
