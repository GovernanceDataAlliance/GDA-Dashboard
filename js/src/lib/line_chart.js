var d3 = require('d3'),
    $ = require('jquery');

var LineChartContext = require('./line_chart_context.js');

var svg, x, y, xKey, yKey, xAxis, yAxis;

var line = d3.svg.line()
  .interpolate('monotone')
  .x(function(d) { return x(d[xKey]); })
  .y(function(d) { return y(d[yKey]); });

var LineChart = function(options) {
  this.options = options;
  this.data = options.data;

  this.sizing = options.sizing;
  this.innerPadding = options.innerPadding;

  this.parentWidth = $(this.options.el).outerWidth();
  this.parentHeight = $(this.options.el).outerHeight();
  this.width = this.parentWidth - this.sizing.left - this.sizing.right,
  this.height = this.parentHeight - this.sizing.top - this.sizing.bottom;

  this._createEl();
  this._createDefs();
  this._createScales();

  $(window).resize(_.debounce(this.resize.bind(this), 100));
};

LineChart.prototype.offResize = function() {
  $(window).off('resize');
};

LineChart.prototype.resize = function() {
  this.offResize();
  $(this.options.el).find('svg').remove();
  new LineChart(this.options).render();
};

LineChart.prototype._createEl = function() {
  svg = d3.select(this.options.el)
    .append("svg")
      .attr('class', 'lineChart')
      .attr("width", this.parentWidth)
      .attr("height", this.parentHeight);
};

LineChart.prototype._createScales = function() {
  xKey = this.options.keys.x;
  yKey = this.options.keys.y;

  x = d3.time.scale().range([this.options.innerPadding.left, this.width - this.options.innerPadding.right]);
  x.domain(d3.extent(this.data.map(function(d) { return d[xKey]; })));

  y = d3.scale.linear().range([this.height - this.options.innerPadding.bottom, 10 + this.options.innerPadding.top]);
  y.domain([0, d3.max(this.data.map(function(d) { return d[yKey]; }))]);
};

LineChart.prototype._createDefs = function() {
  svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", this.width)
    .attr("height", this.height);
};

LineChart.prototype._drawAxes = function(group) {
  xAxis = d3.svg.axis().scale(x).orient("bottom");
  yAxis = d3.svg.axis().scale(y).tickSize(-this.width, 0).orient("left");

  group.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + this.height + ")")
    .call(xAxis);

  group.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text")
      .attr("y", -10)
      .attr("x", 5)
      .style("text-anchor", "start");
};

LineChart.prototype._drawLine = function(group) {
  group.append("path")
    .datum(this.data)
    .attr("class", "line")
    .attr("d", line);
};

LineChart.prototype._drawContext = function(group) {
  var contextGroup = svg.append("g").attr("class", "context")

  var context = new LineChartContext({
    el: this.options.el,
    data: this.data,
    group: contextGroup,
    sizing: {
      width: this.width,
      height: this.parentHeight
    },
    keys: this.options.keys,
    domain: {
      x: x.domain(),
      y: y.domain()
    },
    onBrush: function(newDomain) {
      x.domain(newDomain);
      group.select(".line").attr("d", line);
      group.select(".x.axis").call(xAxis);
    }
  });
  context.render();
};

LineChart.prototype.render = function() {
  var group = svg.append("g")
    .attr("class", "focus")
    .attr("transform",
      "translate(" + this.sizing.left + "," + this.sizing.top + ")");

  this._drawAxes(group);
  this._drawLine(group);
  this._drawContext(group);
};

module.exports = LineChart;
