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
    this.template = $(modalWindowtemplate);

    this.render();

    $(document).keyup(_.bind(this.onKeyUp, this));
  },

  appendCurrentConent: function() {
    var current = this.template.filter( '#'+ this.type ).html();
    var currentTpl = Handlebars.compile(current);

    this.$('#content').append(currentTpl({'data': this.data}));
  },

  render: function() {
     this.fixed = true;
    var base = this.template.filter('#infowindow-base').html();
    var baseTpl = Handlebars.compile(base);
    this.$el.append( baseTpl );

    this.appendCurrentConent();
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
