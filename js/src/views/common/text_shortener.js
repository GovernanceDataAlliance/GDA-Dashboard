var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');
    
var TextShortener = Backbone.View.extend({

  events: {
    'click .read-more' : '_onExpandText',
    'click .read-less' : '_onShortText'
  },

  initialize: function(options) {
    this._shortDescription()
  },

  _shortDescription: function() {
    var $descriptions = $('.description'),
      charLimit = 250,
      textShow, textHide, readMore, readLess;

    readMore = '<span class="read-more">continue reading</span>';
    readLess = '<span class="read-less">read less</span>';

    _.each($descriptions, function(d) {
      if ($(d).text().length > charLimit) {

        textShow = $(d).text().substr(0, charLimit) + '<span class="ellipsis">...</span>';
        textHide = $(d).text().substr(charLimit, $(d).text().length);

        var hiddenText = $(document.createElement('span')).html(textHide);
        $(hiddenText).addClass('is-hidden').append(readLess);

        $(d).html(textShow);
        $(d).append(readMore);
        $(d).append(hiddenText);
      }
    });
  },

  _onExpandText: function(e) {
    var $btn = $(e.currentTarget);
    $btn.parent().addClass('-expand');
    $btn.next('span').removeClass('is-hidden');
    $btn.parent().find('.ellipsis').addClass('is-hidden');
    $btn.addClass('is-hidden');
  },

  _onShortText: function(e) {
    var $btn = $(e.currentTarget),
    $description = $btn.closest('.description');

    $btn.parent().addClass('is-hidden');
    $description.removeClass('-expand');
    $description.find('.ellipsis').removeClass('is-hidden');
    $description.find('.read-more').removeClass('is-hidden');
  },

});

module.exports = TextShortener;
