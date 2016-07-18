var _ = require('lodash'),
  Handlebars = require('handlebars');

// returns a number with comma notation and 2 two decimals (if needed)
Handlebars.registerHelper('comma', function(number) {

  if (!isNaN(parseFloat(number))) {

    if (number % 1 != 0) {

      if (parseInt(number).toString().length > 3) {
        return parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } else {
        return parseFloat(number).toFixed(2);
      }

    } else {

      if (parseInt(number).toString().length > 3) {
        var d = parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        return d.split('.')[0];
      }
    }
  }

  return number;
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
  if (this.units_abbr != '%' && this.units != "yes/no" && this.short_name != "doing_business" && this.short_name != "illicit_financial_flows" ) {
    return '<span class="max_score">/'+ max_score +'</span>'
  }
});
