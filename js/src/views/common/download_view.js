var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var indicators = require('../../collections/indicators');

var tpl = Handlebars.compile(require('../../templates/common/download_tpl.hbs'));

var DownloadView = Backbone.View.extend({

  template: tpl,

  defaults: {},

  events: {
    'click .btn-close-modal': 'hide',
    'click .modal-background': 'hide',
    'click .js--download-btn': '_getDownload',
    'click .js--cancel-btn': '_cancel'
  },

  el: 'body',

  initialize: function(settings) {
    var options = settings && settings.options ? settings.options : settings;
    this.options = _.extend(this.defaults, options);

    this.indicatorsCollection = new indicators();
  },

  render: function() {
    this.$el.append(this.template({
      csv: this._getCSV(),
      blogPermalink: '#'
    }));

    this.$el.find('.modal-container').removeClass('is-loading-share');
  },

  _getCSV: function() {
    return this.indicatorsCollection.downloadForCountry(this.options.iso);
  },

  _cancel: function(e) {
    e.preventDefault();
    this.hide();
  },

  show: function() {
    this.render();
  },

  hide: function() {
    this.$el.find('.m-modal-window').remove();
  }

});

module.exports = DownloadView;
