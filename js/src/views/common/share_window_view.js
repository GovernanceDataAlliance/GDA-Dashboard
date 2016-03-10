var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var infoWindowView = require('./infowindow_view.js'),
  DownloadView = require('./download_view.js'),
  ShareView = require('./share_view.js');

var shareTemplate = require('../../templates/common/share_window_tpl.hbs');

var ShareWindowView = infoWindowView.extend({

  template: Handlebars.compile(shareTemplate),

  events: {
    'click .js--download' : '_download',
    'click .js--print': '_print',
    'click .js--share': '_share'
  },

  initialize: function(options) {
    this.options = options || {};

    _.extend(this.events, this.constructor.__super__.events());

    // Templates
    this.infoWindowTemplate = Handlebars.compile(this.constructor.__super__.template({isBase: true}));

    // Views
    this.shareView = new ShareView();
    this.downloadView = new DownloadView({
      options: this.options
    });
  },

  _print: function() {
    window.print();
  },

  _cleanContent: function() {
    var content = document.querySelector('#toolbar-content');

    if (content.hasChildNodes()) {
      $('#toolbar-content').empty();
    }
  },

  _share: function() {
    this._cleanContent();
    this.shareView.setElement($('#toolbar-content'));
    this.shareView.render();
  },

  _download: function() {
    this._cleanContent();
    this.downloadView.setElement($('#toolbar-content'));
    this.downloadView.render();
    this.downloadView.delegateEvents();
  },

  render: function() {
    // take a look later..
    this.$el.append(this.infoWindowTemplate());
    this.$('#content').append(this.template());

    this.avoidScroll();

    // Share view by default
    this._share();
  },

  close: function() {
    this.constructor.__super__.close();
    this.undelegateEvents();
  }

});

module.exports = ShareWindowView;
