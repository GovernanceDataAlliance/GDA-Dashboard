var sinon = require('sinon');

var Backbone = require('backbone');
var Router = require('../../src/routers/indicators.js');

var IndicatorView = require('../../src/views/indicators/indicator.js');

describe('Indicator Router', function() {
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

    it('creates a IndicatorView and passes in the id', function() {
      var initSpy = spyOn(IndicatorView.prototype, 'initialize');

      router.navigate('#/'+id, {trigger: true});

      expect(initSpy).toHaveBeenCalled();
      expect(initSpy).toHaveBeenCalledWith({id: id});
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
