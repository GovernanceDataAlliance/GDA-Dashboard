var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var modalWindowtemplate = require('../../templates/common/modal_window_tpl.hbs');

/*
 * Creates modal infowindow.
 * It should recieve type option to generate template.
 * Default type: info
 * Available options:
 * - info-infowindow
 * - legend-infowindow
 * - share-infowindow
*/
var ModalWindowView = Backbone.View.extend({

  el: 'body',

  events: function() {
    if (window.ontouchstart) {
      return  {
        'touchstart .btn-close-modal': 'close',
        'touchstart .modal-background': 'close'
      };
    }
    return {
      'click .btn-close-modal': 'close',
      'click .modal-background': 'close'
    };
  },

  initialize: function(options) {
    this.type = options && options.type ? options.type : 'info-infowindow';
    this.data = options && options.data ? options.data : null;
    this.template = Handlebars.compile(modalWindowtemplate);

    this._setListeners();

    this.render();
  },

  _setListeners: function() {
    $(document).keyup(_.bind(this.onKeyUp, this));
  },

  render: function() {
    this.fixed = true;

    // Filters content depending on the data
    var innerContent = this.template({
      type: this.type,
      data: this.data
    });

    // Renders base template
    this.$el.append(this.template());

    // Adds filtered content to base template
    this.$('#content').append(innerContent);

    this.toogleState();
  },

  onKeyUp: function(e) {
    // press esc
    if (e.keyCode === 27) {
      this.close(e);
    }
  },

  close: function(e) {
    e && e.stopPropagation();
    this.fixed = false;

    $('.m-modal-window').remove();
    this.toogleState();
  },

  toogleState: function() {
    this.$el.toggleClass('is-inmobile', this.fixed);
    $('html').toggleClass('is-inmobile', this.fixed);
  }

});

module.exports = ModalWindowView;
