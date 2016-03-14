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

  template: Handlebars.compile(modalWindowtemplate),

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

    this._setListeners();

    this.render();
  },

  _setListeners: function() {
    $(document).keyup(_.bind(this.onKeyUp, this));
  },

  _remove: function() {
    $(this.el).find('#infowindow-base').remove();
  },

  _setView: function() {
    switch(this.type) {
      case 'legend-infowindow':
        return { isLegend: true };

      case 'share-infowindow':
        return { isShare: true };

      default:
        return { isIndicator: true };
    }
  },

  render: function() {
    this.fixed = true;

    var params = _.extend({
      data: this.data
    }, this._setView());

    // Filters content depending on the data
    var innerContent = this.template(params);

    // Renders base template
    this.$el.append(this.template({
      isBase: true
    }));

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

    this._remove();
    this.toogleState();
    this._enableScroll();
  },

  toogleState: function() {
    $(this.el).toggleClass('is-inmobile', this.fixed);
    $('html').toggleClass('is-inmobile', this.fixed);
  },

  _enableScroll: function() {
    $('html').removeClass('is-inmobile');
    $('body').removeClass('is-inmobile');
  },

  avoidScroll: function() {
    $('html').addClass('is-inmobile');
    $('body').addClass('is-inmobile');
  },

});

module.exports = ModalWindowView;
