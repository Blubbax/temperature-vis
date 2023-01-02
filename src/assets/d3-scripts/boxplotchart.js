
function resizeBoxPlotChart() {
  var svg = d3.select("div#boxplot-visualization").select('svg');

  var width = parseInt(d3.select("div#boxplot-visualization").style('width'), 10)
  var height = parseInt(d3.select("div#boxplot-visualization").style('height'), 10)

  svg.attr("width", width)
    .attr("height", height);
}

function drawBoxPlotChart(data) {
  // inspired by https://d3-graph-gallery.com/graph/boxplot_show_individual_points.html

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 };

  var width = parseInt(d3.select("div#boxplot-visualization").style('width'), 10) - margin.left - margin.right;
  var height = parseInt(d3.select("div#boxplot-visualization").style('height'), 10) - margin.top - margin.bottom;

  d3.select("div#boxplot-visualization").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3.select("div#boxplot-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  // var sumstat = d3.group(data, d => d.Species) // nest function allows to group the calculation per level of a factor
  var sumstat = d3.rollup(data, d => {
    q1 = d3.quantile(d.map(function (g) { return g.temperature; }).sort(d3.ascending), .25);
    median = d3.quantile(d.map(function (g) { return g.temperature; }).sort(d3.ascending), .5);
    q3 = d3.quantile(d.map(function (g) { return g.temperature; }).sort(d3.ascending), .75);
    interQuantileRange = q3 - q1;
    min = q1 - 1.5 * interQuantileRange;
    max = q3 + 1.5 * interQuantileRange;
    return ({ q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max })
  }, d => d.month)

  // Show the X scale
  var x = d3.scaleBand()
    .range([0, width])
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([d3.min(data, function (d) { return +d.temperature; }) - 5, d3.max(data, function (d) { return +d.temperature; }) + 5])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function (d) { return (x(d[0])) })
    .attr("x2", function (d) { return (x(d[0])) })
    .attr("y1", function (d) { return (y(d[1].min)) })
    .attr("y2", function (d) { return (y(d[1].max)) })
    .attr("stroke", "black")
    .style("width", 40)

  // rectangle for the main box
  var boxWidth = 50
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function (d) { return (x(d[0]) - boxWidth / 2) })
    .attr("y", function (d) { return (y(d[1].q3)) })
    .attr("height", function (d) { return (y(d[1].q1) - y(d[1].q3)) })
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function (d) { return (x(d[0]) - boxWidth / 2) })
    .attr("x2", function (d) { return (x(d[0]) + boxWidth / 2) })
    .attr("y1", function (d) { return (y(d[1].median)) })
    .attr("y2", function (d) { return (y(d[1].median)) })
    .attr("stroke", "black")
    .style("width", 80)

  // Add individual points with jitter
  var jitterWidth = 20
  svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return (x(d.month) - jitterWidth / 2 + Math.random() * jitterWidth) })
    .attr("cy", function (d) { return (y(d.temperature)) })
    .attr("r", 4)
    .style("fill", "transparent")
    .attr("stroke", "black")


}
