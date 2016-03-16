var _ = require('lodash'),
  Handlebars = require('handlebars');

// returns a number with comma notation and 2 two decimals (if needed)
Handlebars.registerHelper('comma', function(options) {

  if (!isNaN(parseFloat(this.score))) {

    if (this.score % 1 != 0) {

      if (parseInt(this.score).toString().length > 3) {
        return parseFloat(this.score).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } else {
        return parseFloat(this.score).toFixed(2);
      }

    } else {
      return this.score;
    }
  }

  return this.score;
});

Handlebars.registerHelper('beautifullStrign', function(options) {
  return options.replace('_', ' ');
});

Handlebars.registerHelper('ordinalNumber', function(number) {
  var sufix = 'th';

  if (number % 10 == 3 && number % 100 != 13 ) {
    sufix = 'rd';
  } else if (number % 10 == 2 && number % 100 != 12 ) {
    sufix = 'nd';
  } else if (number % 10 == 1 && number % 100 != 11 ) {
    sufix = 'st';
  }

  return number + sufix;
});


Handlebars.registerHelper('unlessPercentage', function(max_score) {
  if (this.units_abbr != '%' && this.units != "yes/no" && this.short_name != "doing_business") {
    return '<span class="max_score">/'+ max_score +'</span>'
  }
});
