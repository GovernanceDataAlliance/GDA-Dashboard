var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var ShareView = require('./share_view.js'),
  DownloadView = require('./download_view.js');

var tpl = Handlebars.compile(require('../../templates/common/toolbar_utils_tpl.hbs'));

var ToolbarUtilsView = Backbone.View.extend({

  template: tpl,

  events: {
    'click .js--download' : '_download',
    'click .js--print': '_print',
    'click .js--share': '_share'
  },

  initialize: function(opts) {
    this.viewOptions = opts || {};

    if(!!opts.el) {
      this.setElement(opts.el);
    }
  },

  // TO-DO
  _download: function() {
    new DownloadView({
      iso: this.viewOptions.iso
    }).show();
  },

  _print: function() {
    window.print();
  },

  _share: function() {
    new ShareView().show();
  },

  render: function() {
    this.$el.html(this.template(this.viewOptions));
    return this;
  }

});

module.exports = ToolbarUtilsView;
