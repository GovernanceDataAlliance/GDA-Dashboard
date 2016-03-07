var Handlebars = require('handlebars');

/*
  Given a number, returns number with two decimals.
*/
Handlebars.registerHelper('round', function(options) {
  if (!isNaN(parseFloat(this.score))) {
    if (this.score % 1 != 0) {
      return parseFloat(this.score).toFixed(2);
    } else {
      return this.score;
    }
  } else {
    return this.score;
  }
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

Handlebars.registerHelper('equal', function(a, b, opts) {
  if(a == b)
    return opts.fn(this);
  else
    return opts.inverse(this);
});

Handlebars.registerHelper('unlessPercentage', function(options) {
  if (!this.units_abbr || this.units_abbr != '%') {
    return '<span class="max_score">/'+ options +'</span>'
  }
});
