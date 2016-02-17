var Backbone = require('backbone'),
    _ = require('lodash'),
    enquire = require('enquire.js'),
    Handlebars = require('handlebars');

var IndicatorView = require('./indicator.js');

var Indicators = require('../../collections/indicators.js'),
    IndicatorService = require('../../lib/services/indicator.js');

var template = Handlebars.compile(require('../../templates/countries/indicators-list.hbs'));

var IndicatorListView = Backbone.View.extend({

  el: '.js--indicators',

  events: {
    'click .read-more' : '_onExpandText',
    'click .read-less' : '_onShortText'
  },

  initialize: function(options) {
    options = options || {};
    this.indicators = IndicatorService.groupScoresById(options.indicators);

    this.indicatorsPerRow = 1;

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.indicatorsPerRow = 2;
      },this)
    });

    enquire.register("screen and (min-width:1024px)", {
      match: _.bind(function(){
        this.indicatorsPerRow = 3;
      },this)
    });
  },

  render: function() {
    this.$el.html(template);
    this.renderIndicators();
    this._shortDescription();
    return this;
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

  _scoreToString: function(indicator) {
    if (indicator.get('score') != undefined) {
      indicator.set('score', indicator.get('score').toString());
    }
  },

  renderIndicators: function() {
    var totalIndicators = this.indicators.length,
      totalGrid;

    if (this.indicatorsPerRow > 1) {
      totalGrid = Math.round(totalIndicators / this.indicatorsPerRow) * this.indicatorsPerRow;
    }

    this.indicators.each(function(indicator) {
      this._scoreToString(indicator);
      var indicatorView = new IndicatorView({
        'indicator': indicator
      });

      this.$('.js--indicators-list').append(indicatorView.render().el);
    }.bind(this));

    var rest = totalGrid - totalIndicators;

    for (var i = 0; i < rest; i++) {
      var indicatorView = new IndicatorView({
        'indicator': null
      });
      this.$('.js--indicators-list').append(indicatorView.render().el);
    }
  }
});

module.exports = IndicatorListView;
