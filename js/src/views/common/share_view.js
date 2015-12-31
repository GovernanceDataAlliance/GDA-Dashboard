var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash');
    $ = require('jquery');

var sharetemplate = Handlebars.compile(require('../../templates/common/share_tpl.hbs'));

var ShareView = Backbone.View.extend({

  events: {
    'click .btn-close-modal': 'hide',
    'click .modal-background': 'hide',
    'click .btn-copy': 'copyUrl'
  },

  el: 'body',

  initialize: function(settings) {
    var options = settings && settings.options ? settings.options : settings;
    this.options = _.extend(this.defaults, options);

    this.setListeners();
  },

  setListeners: function() {
    Backbone.Events.on('share:show', this.show, this);
    Backbone.Events.on('share:hide', this.hide, this);
  },

  render: function() {
    var url = window.location.href;
    var html = sharetemplate({
      url: url,
      link: url
    });

    this.$el.append(html);
    this.$el.find('.modal-container').removeClass('is-loading-share');
  },

  show: function() {
    this.render();
  },

  hide: function() {
    this.$el.find('.m-modal-window').remove();
  },

  copyUrl: function() {
    var $parent = this.$el.find('.m-share .content.active');
    var $url = $parent.find('.url');
    var $btn = $parent.find('.btn-copy');
    var parentId = $parent[0].id;
    $url.select();

    try {
      var successful = document.execCommand('copy');
      $btn.html('copied');
    } catch(err) {}
  }

});

module.exports = ShareView;