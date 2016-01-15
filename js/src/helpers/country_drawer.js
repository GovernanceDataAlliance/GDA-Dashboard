var d3 = require('d3'),
  topojson = require('topojson');

var countryHelper = {

  draw: function(topology, c) {
    var country = topojson.feature(topology, topology.objects[c]);
    var width = 300,
        height = 175,
        el = '.js--country-silhouette';

    var svg = d3.select(el).append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", 'svg-country-silhouette');

    var projection = d3.geo.mercator().scale(1).translate([0, 0]);
    var path = d3.geo.path().projection(projection);

    var b = path.bounds(country),
        s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    svg.append("svg:path")
      .data([country])
      .attr("d", path);

    return country;
  }
};

module.exports = countryHelper;