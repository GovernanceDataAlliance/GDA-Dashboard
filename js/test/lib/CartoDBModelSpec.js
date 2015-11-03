var sinon = require('sinon');

var CartoDBModel = require('../../lib/cartodb_model.js');

var responses = require('../responses/cartodb_model.json');

describe("CartoDBModel", function() {
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
    expect(CartoDBModel).toBeDefined();
  });

  describe('.fetch', function() {
    var Model = CartoDBModel.extend({
      user_name: 'ggddaa',
      table: 'indicators'
    });

    describe('given columns', function() {
      var model,
          request;

      beforeEach(function() {
        ColumnModel = Model.extend({ columns: ['que', 'es', 'eso'] });
        model = new ColumnModel({});
        model.fetch();

        request = requests[0];
        request.respond(200, { "Content-Type": "application/json" }, '{rows:[]}');
      });

      it('sends a SELECT <columns> query', function() {
        var paramsRegex = new RegExp("\\?q=SELECT que, es, eso FROM indicators");
        expect(request.url).toMatch(paramsRegex);
      });
    });

    describe("given an ID", function() {
      var model,
          request;

      var ID = 123;

      beforeEach(function() {
        model = new Model({id: ID});
        model.fetch();

        request = requests[0];
        request.respond(200, { "Content-Type": "application/json" },
          JSON.stringify(responses.success));
      });

      it('calls the CartoDB API', function() {
        var urlRegex = new RegExp("^http://ggddaa.cartodb.com/api/v2/sql");
        expect(request.url).toMatch(urlRegex);
      });

      it('sends a SELECT * query', function() {
        var paramsRegex = new RegExp("\\?q=SELECT \\* FROM indicators WHERE id="+ID);
        expect(request.url).toMatch(paramsRegex);
      });

      it('parses the JSON correctly', function() {
        expect(model.get('cartodb_id')).toBe(
          responses.success.rows[0].cartodb_id);
      });
    });
  });

});
