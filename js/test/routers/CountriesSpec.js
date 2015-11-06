var sinon = require('sinon');

var Backbone = require('backbone');
var Router = require('../../src/routers/countries.js');
var CountryView = require('../../src/views/countries/country.js');

describe('Countries Router', function() {
  var router;

  beforeEach(function() {
    router = new Router({$el: {}});
    sinon.stub(router.views);

    Backbone.history.start();
  });

  afterEach(function() {
    Backbone.history.stop();
  });

  describe("/compare", function() {
    it('triggers the "compare" route', function () {
      var compare = spyOn(router, 'compare').and.callThrough();

      var updateHashSpy = spyOn(Backbone.history, '_updateHash').and.callFake(function (loc, frag) {
        expect(frag).toEqual('/compare');
        router.compare();
      });

      router.navigate('#/compare', {trigger: true});

      expect(updateHashSpy).toHaveBeenCalled();
      expect(compare).toHaveBeenCalled();
    });
  });

  describe("/<iso>", function() {
    var ISO = 'GBR';

    it('triggers the "show" route', function () {
      var show = spyOn(router, 'show').and.callThrough();
      var updateHashSpy = spyOn(Backbone.history, '_updateHash').and.callFake(function (loc, frag) {
        expect(frag).toEqual('/'+ISO);
        router.show(frag);
      });

      router.navigate('#/'+ISO, {trigger: true});

      expect(updateHashSpy).toHaveBeenCalled();
      expect(show).toHaveBeenCalled();
    });

    it('creates a CountryView and passes in the iso', function() {
      var initSpy = spyOn(CountryView.prototype, 'initialize');

      router.navigate('#/'+ISO, {trigger: true});

      expect(initSpy).toHaveBeenCalled();
      expect(initSpy).toHaveBeenCalledWith({iso: ISO});
    });
  });

  describe("/", function() {
    it('triggers the "index" route', function () {
      var index = spyOn(router, 'index').and.callThrough();

      var updateHashSpy = spyOn(Backbone.history, '_updateHash').and.callFake(function (loc, frag) {
        expect(frag).toEqual('/');
        router.index();
      });

      router.navigate('#/', {trigger: true});

      expect(updateHashSpy).toHaveBeenCalled();
      expect(index).toHaveBeenCalled();
    });
  });
});
