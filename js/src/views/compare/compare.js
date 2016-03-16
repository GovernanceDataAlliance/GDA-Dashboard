var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  async = require('async'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars'),
  slick = require('slick-carousel-browserify');

var FunctionHelper = require('../../helpers/functions.js');

var InfoWindowModel = require('../../models/infowindow.js');

var Countries = require('../../collections/countries.js'),
  YearsCollection = require('../../collections/years.js'),
  IndicatorsNamesCollection = require('../../collections/indicator_configs.js'),
  IndicatorCollection = require('../../collections/indicators.js');

var CompareSelectorsView = require('./compare_selectors.js'),
  MobileSelectorView = require('./compare_mobile_selector.js'),
  ModalWindowView = require('../common/infowindow_view.js'),
  ShareWindowView = require('../common/share_window_view.js'),
  LegendView = require('../common/legend.js');

var template = Handlebars.compile(require('../../templates/compare/compare.hbs')),
  indicatorsTemplate = Handlebars.compile(require('../../templates/compare/compare-indicators.hbs')),
  countryScoresTemplate = Handlebars.compile(require('../../templates/compare/compare-country-scores.hbs'));

var templateMobile = Handlebars.compile(require('../../templates/compare/mobile/compare-mobile.hbs')),
  templateMobileSlide = Handlebars.compile(require('../../templates/compare/mobile/compare-mobile-slide.hbs')),
  templateMobileScores = Handlebars.compile(require('../../templates/compare/mobile/compare-country-scores-mobile.hbs'));


var CompareView = Backbone.View.extend({

  events: {
    'click .btn-info' : 'showModalWindow',
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function(options) {
    options = options || {};

    this._setView();

    // views
    this.infoWindowModel = new InfoWindowModel();

    this.shareWindowView = new ShareWindowView({
      noDownload: true
    });


    // collections
    this.indicatorCollection = new IndicatorCollection();
    this.indicatorsNamesCollection = new IndicatorsNamesCollection()


    if (this.mobile) {

      this.slides = [
        new MobileSelectorView(),
        new MobileSelectorView(),
        new MobileSelectorView()
      ];

      var promises = this.slides.map(function(slide) {
        return slide.getPromise();
      });

      $.when.apply($, promises).done(function() {
        this._setListeners();
        if (options) {
          this.setParams(options);
        }

      }.bind(this));

    } else {

      this.selectorsView = new CompareSelectorsView();
      this._setListeners();
      this.setParams(options);
    }
  },

  _setView: function() {
    enquire.register("screen and (max-width:767px)", {
      match: _.bind(function(){
        this.mobile = true;

        _.extend(this.events, {
          'click .btn-info': 'showModalWindow'
        });

      },this)
    });

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });
  },

  _setListeners: function() {
    Backbone.Events.on('breakpoints:loaded', this._onScroll.bind(this));

    if (!this.mobile) {
      this.listenTo(this.selectorsView.getCollection(), 'change', (this.getDataForCountry).bind(this));
    }

    if (this.mobile) {
      _.each(this.slides, function(slide) {
        this.listenTo(slide.status, 'change', (this.getDataForCountry).bind(this));
      }.bind(this));
    }
  },

  update: function(params) {
    this.setParams(params);
  },

  render: function() {

    if (this.mobile) {
      this.$el.html(templateMobile());
      this.renderSlides();
      this.calculateLimitPoint();

    } else {
      this.renderIndicatorNames();
      this.$el.html(template());
      this.calculateLimitPoint();
      this.renderComparesSelector();
    }

    this.renderLegend();

    return this;
  },

  _setScrollMobile: function() {
    var debouncedScroll = FunctionHelper.debounce(this._onScrollMobile, 10, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScrollMobile: function() {
    var posY = window.pageYOffset,
      arrows = $('.slick-arrow'),
      elem = $('.slick-next');

    var offset = elem.offset().left - elem.parent().offset().left;
    breakPoint = $('.m-comparison-table').height() + offset;

    if (posY >= breakPoint) {
      arrows.addClass('stop');
    } else {
      if (arrows.hasClass('stop')) {
        arrows.removeClass('stop');
      }
    }
  },

  /*
   * Render indicators names
   */
  renderSlides: function() {

    this.indicatorsNamesCollection.fetch().done(function(indicators) {

      var indicatorsOrdered = _.sortByOrder(indicators.rows, ['short_name']);

      _.each(this.slides, function(slide) {

        var order = slide.status.get('order');

        this.$('#compareSlider').append(templateMobileSlide({
          index: order
        }));

        this.$('#country-' + order + ' .country')
          .append(templateMobileScores({
            index: order,
            indicators: indicatorsOrdered
          }));

        slide.setElement(this.$('.selectors-' + order));

        slide.render();

      }.bind(this));

      this.calculateEndScrollPoint();
      this.initSlide();
      this._setScrollMobile();

    }.bind(this));
  },

  initSlide: function(){

    //swipe false to avoid strange behaviour on iOS.
    var slider = $('#compareSlider').slick({
      dots: true,
      useTransform: false,
      adaptiveHeight: true,
      swipe: false
    });

    this.currentSlide = 0;

    slider.on('afterChange', function(ev, slick, current){
      this.currentSlide = current;
      this._onScroll();
    }.bind(this));

  },

  renderIndicatorNames: function() {
    this.indicatorsNamesCollection.fetch().done(function(indicators) {

      this.$('.js--comparison-indicators').html(indicatorsTemplate({
        indicators: indicators.rows
      }));

      this.calculateEndScrollPoint();

    }.bind(this))
  },

  calculateEndScrollPoint: function() {
    this.breakPoints = this.breakPoints || {};
    this.$el.find('.js--compare-toolbar').ready(function() {
      this.breakPoints['endPoint'] = this.$el.find('.js--compare-toolbar').offset().top;
      Backbone.Events.trigger('breakpoints:loaded');
    }.bind(this));
  },

  calculateLimitPoint: function() {
    this.breakPoints = {};

    this.$el.find('.js--compare-selectors').ready(function() {
      if (this.mobile) {
        var selectorsHeight = this.$('.l-toolbar').height();
        this.breakPoints['startPoint'] = this.$el.find('#compareSlider').offset().top + selectorsHeight;
      } else {
        this.breakPoints['startPoint'] = this.$el.find('.js--compare-selectors').offset().top;
      }
    }.bind(this));

    this._setScroll();
  },

  _setScroll: function() {
    var debouncedScroll = FunctionHelper.debounce(this._onScroll, 10, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScroll: function() {
    var $bar = $('.-compare'),
        $content = $('.l-content'),
        barHeight = $bar.height(),
        contentHeight = $content.height(),
        posY = window.pageYOffset;

    if (posY >= this.breakPoints['startPoint']) {
      if (this.mobile) {
        $bar.removeClass('-fixed');
        $bar = this.$('#country-'+(this.currentSlide+1)+' .-compare');
      }
      $bar.addClass('-fixed');
      $content.addClass('-fixed');
    }

    if (posY >= this.breakPoints['endPoint'] && $bar.hasClass('-fixed')) {
      $bar.addClass('-hide-transition');
    }

    if (posY < this.breakPoints['endPoint'] && $bar.hasClass('-hide-transition')) {
      $bar.removeClass('-hide-transition');
    }

    if (posY > this.breakPoints['startPoint'] + barHeight && posY < this.breakPoints['startPoint'] + barHeight && $content.hasClass('-fixed') ||
      posY < this.breakPoints['startPoint'] && $content.hasClass('-fixed') ||
      posY > this.breakPoints['startPoint'] + contentHeight && $content.hasClass('-fixed')) {
      $bar.removeClass('-fixed');
      $content.removeClass('-fixed');
    }
  },

  renderLegend: function() {
    _.each(this.$('.js--legend'), function(legend) {
      new LegendView({ el: legend });
    });
  },

  // desktop - mobile
  getDataForCountry: function() {

    if (this.mobile) {
      var slideModel = arguments[0];

      var iso = slideModel.get('iso'),
        year = slideModel.get('year'),
        order = slideModel.get('order');

      this.indicatorCollection.forCountryAndYear(iso, year).done(function() {
        this.renderCountryScores(this.indicatorCollection.toJSON(), iso, order);
      }.bind(this));


    } else {

      var countryScores = this.selectorsView.getCollection();

      countryScores.forEach(function(countryModel) {
        var iso = countryModel.get('iso'),
        order = Number(countryModel.get('order')),
        year = countryModel.get('year');

        if (iso) {
          this.indicatorCollection.forCountryAndYear(iso, year).done(function() {
            this.renderCountryScores(this.indicatorCollection.toJSON(), iso, order);
          }.bind(this));
        }

      }.bind(this));

    }

  },

  // Desktop
  renderCountryScores: function(indicators, iso, order) {

    if (this.mobile) {
      
      this.$('#country-' + order + ' .country').html(templateMobileScores({
        content: true,
        indicators: indicators
      }));

      Backbone.Events.trigger('router:update', this.slides);

    } else {
      for (var i = 1 ; i <= 3; i++) {
        if (i == order) {
          iso = iso == 'no_data' ? null: iso;
          this.$('.js--country-' + order).html(countryScoresTemplate({
            iso: iso,
            scores: indicators
          }));
        } else {

          if (!$.trim(this.$('.js--country-' + i).html())) {
            this.$('.js--country-' + i).html(countryScoresTemplate({
              scores: indicators
            }));
          }
        }
      }
    }

    if (!$('.m-advise').hasClass('is-hidden')) {
      $('.m-advise').addClass('is-hidden');
    }

  },

  // Desktop
  renderComparesSelector: function() {
    this.selectorsView.setElement(this.$('.js--compare-selectors'));
    this.selectorsView.render();
  },


  // Mobile
  // renderCountrySelector: function(el, index) {
  //   el = el || '.js--compare-selectors';
  //
  //   _.each(this.slides, function(slide) {
  //
  //     console.log(slide);
  //
  //     // slide.setElement(this.$(el));
  //     slide.render();
  //
  //   }.bind(this));
  //
  //   // new MobileSelectorView({
  //   //   countries: this.countryIds,
  //   //   el: this.$(el),
  //   //   index: index
  //   // }).render();
  // },

  setParams: function(params) {
    if (!this.mobile) {
      this.selectorsView.setParams(params);
    } else {
      _.each(params, function(d, i) {
        var slide = this.slides[i];
          data = d.split(':');
        slide.status.set({
          iso: data[0],
          year: Number(data[1])
        });
      }.bind(this));
    }
  },

  showModalWindow: function(e) {
    var indicator = $(e.currentTarget).data('indicator');
    if (!indicator) {
      return;
    }

    this.infoWindowModel.getIndicator({
      indicator: indicator
    }).done(function() {

      new ModalWindowView({
        type: 'info-infowindow',
        data: this.infoWindowModel.toJSON()
      });

    }.bind(this));

  },

  _openShareWindow: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  show: function() {
    this.render();
  },

  hide: function() {}

});

module.exports = CompareView;
