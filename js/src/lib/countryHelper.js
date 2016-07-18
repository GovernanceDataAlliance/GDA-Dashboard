var d3 = require('d3'),
  topojson = require('topojson');

var countryHelper = {

  draw: function(topology, c) {
    var country = topojson.feature(topology, topology.objects[c]);
    var width = 300,
        height = 300,
        el = '.js--country-silhouette';

    // if (!options.alerts) {
    //   width = 150;
    //   height = 150;
    //   el = el+" a";
    // }

    var svg = d3.select(el).append("svg:svg")
      .attr("width", width)
      .attr("height", height);

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
      .attr("d", path)
      .attr("class", 'country-shape');

    // if (options && options.alerts) {
    //   var forest = [];

    //   for(var i = 1; i < Object.keys(topology.objects).length; i++) {
    //     if (topology.objects[i].type === "Point") {
    //       forest.push(topojson.feature(topology, topology.objects[i]).geometry);
    //     }
    //   }

    //   svg.append("svg:g")
    //     .selectAll("circle")
    //     .data(forest)
    //     .enter()
    //     .append("svg:circle")
    //     .attr("class", "alert")
    //     .attr('cx', function(d){
    //       var coordinates = projection([d.coordinates[0], d.coordinates[1]])
    //       return coordinates[0]
    //     })
    //     .attr('cy', function(d){
    //       var coordinates = projection([d.coordinates[0], d.coordinates[1]])
    //       return coordinates[1]
    //     })
    //     .attr('r', 2)
    //     .style("fill", "#AAC600");
    // }

    return country;
  }
};

module.exports = countryHelper;