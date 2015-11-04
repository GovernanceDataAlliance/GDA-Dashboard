var ViewManager = require('../../src/lib/view_manager.js');

var sinon = require('sinon');

describe('View Manager', function() {
  var viewManager;

  describe('.addView', function() {
    var view,
        viewName = 'show';

    beforeEach(function() {
      viewManager = new ViewManager({$el: {}});

      view = {};
      viewManager.addView(viewName, view);
    });

    it('stores the view in the manager', function() {
      expect(viewManager.get('views')[viewName]).toBe(view);
    });
  });

  describe('.showView', function() {
    var showSpy  = sinon.spy(),
        hideSpy  = sinon.spy(),
        eventSpy = sinon.spy(),
        elSpy    = sinon.spy(),
        delegateSpy = sinon.spy();

    var oldView = {
          view: {hide: hideSpy, el: {}},
          name: 'index'
        };

    var newView = {
          view: {show: showSpy, el: {}, delegateEvents: delegateSpy},
          name: 'show'
        };

    beforeEach(function() {
      viewManager = new ViewManager({$el: {html: elSpy}});

      viewManager.on('change:currentView', eventSpy);

      viewManager.addView(oldView.name, oldView.view);
      viewManager.addView(newView.name, newView.view);

      viewManager.showView(newView.name);
    });

    it('fires a change:currentView event', function() {
      expect(eventSpy.called).toBe(true);
    });

    it('replaces the element html with the view el', function() {
      expect(elSpy.called).toBe(true);
      expect(elSpy.calledWith(newView.view.el)).toBe(true);
    });

    it('calls .show on the new view', function() {
      expect(showSpy.called).toBe(true);
    });

    it('calls .delegateEvents on the new view', function() {
      expect(delegateSpy.called).toBe(true);
    });

    it('calls .hide on all other views', function() {
      expect(hideSpy.called).toBe(true);
    });
  });

  describe('.hasView', function() {
    var viewName = 'show';

    beforeEach(function() {
      viewManager = new ViewManager({$el: {}});
      viewManager.addView(viewName, {});
    });

    describe('given an existing view', function() {
      it('returns true', function() {
        expect(viewManager.hasView(viewName)).toBe(true);
      });
    });

    describe('given a non-existing view', function() {
      it('returns false', function() {
        expect(viewManager.hasView('fakename')).toBe(false);
      });
    });
  });

});
