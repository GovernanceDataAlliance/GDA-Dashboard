var Backbone = require('backbone');

var SearchCollection = Backbone.Collection.extend({

  url: 'data/countries.json', 

  parse: function(data) {
    return data.rows;
  },
  
  getData: function() {
    var self = this;
    var fetchOptions;
    var query = 'SELECT initcap(s_name) as name, bbox, iso3 as iso FROM grpcountries_250k_polygon';

    fetchOptions = {
      dataType: 'json',
      data: {
        q: query,
        format: 'json'
      }
    };

    return this.fetch(fetchOptions);
  }
});

module.exports = SearchCollection;