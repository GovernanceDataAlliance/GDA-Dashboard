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

    var downloadbtn = e.currentTarget;
    var id = downloadbtn.getAttribute('data-indicator-id'),
      iso = downloadbtn.getAttribute('data-year') ? downloadbtn.getAttribute('data-iso') : this.viewOptions.iso,
      year = downloadbtn.getAttribute('data-year') ? downloadbtn.getAttribute('data-year') : 2015,
      categoryName = downloadbtn.getAttribute('data-category-name') ?
        downloadbtn.getAttribute('data-category-name') : 'global',
      categoryGroup = downloadbtn.getAttribute('data-category-group') ?
        downloadbtn.getAttribute('data-category-group') : null;

    new DownloadView({
      iso: iso,
      id: id,
      year: year,
      categoryName: categoryName,
      categoryGroup: categoryGroup
    }).show();

  },

  _print: function() {
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
