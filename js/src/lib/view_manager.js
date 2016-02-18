var _ = require('lodash'),
    Backbone = require('backbone');

var ViewManager = Backbone.Model.extend({
  defaults: {
    views: {}
  },

  initialize: function(options) {
    this.$el = options.$el;
  },

  addView: function(viewName, view) {
    var views = this.get('views');
    views[viewName] = view;

    this.set('views', views);
  },

  getView: function(viewName) {
    return this.get('views')[viewName];
  },

  showView: function(viewName) {
    var view = this.get('views')[viewName];
    if (view !== undefined) {
      this.set('currentView', view);

      view.show();
      this.$el.html(view.el);
      // this._hideViewsExcept(viewName);
      view.delegateEvents();
    }
  },

  hasView: function(viewName) {
    return (this.get('views')[viewName] !== undefined);
  },

  // _hideViewsExcept: function(viewName) {
  //   var views = this.get('views');
  //   _.each(views, function(view, key) {
  //     if (key !== viewName) {
  //       view.hide();
  //     }
  //   });
  // }
});


module.exports = ViewManager;
