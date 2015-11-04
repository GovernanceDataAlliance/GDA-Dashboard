var sinon = require('sinon');

var Backbone = require('backbone');
var Router = require('../../src/routers/countries.js');

describe('Countries Router', function() {
  var router;

  beforeEach(function() {
    router = new Router();
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
        router.show();
      });

      router.navigate('#/'+ISO, {trigger: true});

      expect(updateHashSpy).toHaveBeenCalled();
      expect(show).toHaveBeenCalled();
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
