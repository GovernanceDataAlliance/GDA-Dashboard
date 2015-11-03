var Backbone = require('backbone'),
    format = require('./format.js');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";

var CartoDBModel = Backbone.Model.extend({
  url: function() {
    return format(BASE_URL, this.user_name) + "?q=" + this._getQuery();
  },

  _getQuery: function() {
    var columns = "*";
    if (this.columns !== undefined && this.columns.length > 0) {
      columns = this.columns.join(", ");
    }

    var where = "";
    if (this.id !== undefined) {
      where = "WHERE id="+this.id;
    }

    return format("SELECT {0} FROM {1} {2}", columns, this.table, where);
  },

  parse: function(data) {
    return data.rows[0];
  }
});

module.exports = CartoDBModel;
