var sinon = require('sinon');

var CountryView = require('../../../src/views/countries/country.js');

var Country = require('../../../src/models/country.js'),
    Indicators = require('../../../src/collections/indicators.js');

var responses = require('../../responses/cartodb_model.json');

describe('Country View', function() {
  var server;

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  describe('new', function() {
    it('throws an Exception if no ISO is supplied', function() {
      var countryView = function() { new CountryView() };
      expect(countryView).toThrow();
    });
  });

  describe(".setCountry", function() {
    var oldIso = 'GBR',
        newIso = 'ALB';

    describe("given a new ISO", function() {
      var view;
      var sandbox;
      var countryFetchSpy,
          indicatorsFetchSpy;
      var renderCountrySpy,
          renderIndicatorsSpy;

      beforeEach(function() {
        sandbox = sinon.sandbox.create();
        countryFetchSpy = sandbox.spy(Country.prototype, 'fetch');
        indicatorsFetchSpy = sandbox.spy(Indicators.prototype, 'forCountry');

        view = new CountryView({iso: oldIso});
        renderCountrySpy = sandbox.spy(view, 'renderCountry');
        renderIndicatorsSpy = sandbox.spy(view, 'renderIndicators');

        view.setCountry(newIso);

        server.respondWith(JSON.stringify(responses.success));
        server.respond();
      });

      afterEach(function() {
        sandbox.restore();
      });

      it("fetches the new country", function() {
        expect(countryFetchSpy.callCount).toBe(3);
      });

      it("re-fetches the indicators", function() {
        expect(indicatorsFetchSpy.callCount).toBe(2);
      });

      it("re-renders the country view", function() {
        expect(renderCountrySpy.callCount).toBe(1);
      });

      it("re-renders the indicators view", function() {
        expect(renderIndicatorsSpy.callCount).toBe(1);
      });
    });
  });
});
