var sinon = require('sinon');

var Backbone = require('backbone');
var Router = require('../../src/routers/indicators.js');

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

  describe("/<id>", function() {
    var id = 'id_of_indicator';

    it('triggers the "show" route', function () {
      var show = spyOn(router, 'show').and.callThrough();
      var updateHashSpy = spyOn(Backbone.history, '_updateHash').and.callFake(function (loc, frag) {
        expect(frag).toEqual('/'+id);
        router.show(frag);
      });

      router.navigate('#/'+id, {trigger: true});

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
