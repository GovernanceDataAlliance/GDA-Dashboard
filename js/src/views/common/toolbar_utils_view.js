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

  _avoidScroll: function() {
    $('html').addClass('is-inmobile');
    $('body').addClass('is-inmobile');
  },

  _download: function(e) {
    this._avoidScroll();

    var $downloadbtn = $(e.currentTarget);
    var id = $downloadbtn.data('indicator-id'),
      year = $downloadbtn.data('year') || 2015,
      categoryName = $downloadbtn.data('category-name') ? $downloadbtn.data('category-name') : 'global',
      categoryGroup = $downloadbtn.data('category-group');

    new DownloadView({
      iso: this.viewOptions.iso,
      id: id,
      year: year,
      categoryName: categoryName,
      categoryGroup: categoryGroup
    }).show();
  },

  _print: function() {
    // console.log('print')
    // Backbone.Events.trigger('print:start');
    window.print();
  },

  _share: function() {
    this._avoidScroll();
    new ShareView().show();
  },

  render: function() {
    this.$el.html(this.template(this.viewOptions));
    return this;
  }

});

module.exports = ToolbarUtilsView;
