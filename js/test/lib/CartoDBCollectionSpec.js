var sinon = require('sinon');

var CartoDBCollection = require('../../lib/cartodb_collection.js');

var responses = require('../responses/cartodb_collection.json');

describe("CartoDBCollection", function() {
  var server,
      requests;

  beforeEach(function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  it('exists', function() {
    expect(CartoDBCollection).toBeDefined();
  });

  describe('.fetch', function() {
    var Collection = CartoDBCollection.extend({
      user_name: 'ggddaa',
      table: 'indicators'
    });

    describe("given no columns", function() {
      var collection,
          request;

      beforeEach(function() {
        collection = new Collection({});
        collection.fetch();

        request = requests[0];
        request.respond(200, { "Content-Type": "application/json" },
          JSON.stringify(responses.success));
      });

      it('calls the CartoDB API', function() {
        var urlRegex = new RegExp("^http://ggddaa.cartodb.com/api/v2/sql");
        expect(request.url).toMatch(urlRegex);
      });

      it('sends a SELECT * query', function() {
        var paramsRegex = new RegExp("\\?q=SELECT \\* FROM indicators");
        expect(request.url).toMatch(paramsRegex);
      });

      it('parses the JSON correctly', function() {
        expect(collection.length).toBe(1);
        expect(collection.first().get('cartodb_id')).toBe(
          responses.success.rows[0].cartodb_id);
      });
    });

    describe('given columns', function() {
      var collection,
          request;

      beforeEach(function() {
        Collection = Collection.extend({ columns: ['que', 'es', 'eso'] });
        collection = new Collection({});
        collection.fetch();

        request = requests[0];
        request.respond(200, { "Content-Type": "application/json" }, '{}');
      });

      it('sends a SELECT <columns> query', function() {
        var paramsRegex = new RegExp("\\?q=SELECT que, es, eso FROM indicators");
        expect(request.url).toMatch(paramsRegex);
      });
    });
  });

});
