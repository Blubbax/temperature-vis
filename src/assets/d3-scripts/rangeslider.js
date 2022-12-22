
function drawRangeslider(data) {

  const defaultOptions = {
    'w': 400,
    'h': 150,
    'margin': {
      top: 20,
      bottom: 20,
      left: 30,
      right: 30,
    },
    bucketSize: 1,
    defaultRange: [0, 100],
    format: d3.format('.3s'),
  };

  const [min, max] = [d3.min(data, function (d) { return +d.year; }), d3.max(data, function (d) { return +d.year; })];
  const range = [min, max + 1]

  var histogram = histogram(data);


  // set width and height of svg
  const { w, h, margin, defaultRange, bucketSize, format } = { ...defaultOptions };

  // dimensions of slider bar
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  // create x scale
  const x = d3.scaleLinear()
    .domain(range)  // data space
    .range([0, width]);  // display space
  const y = d3.scaleLinear()
    .domain([0, d3.max(Object.values(histogram))])
    .range([0, height]);

  // create svg and translated g
  var svg = d3.select("div#rangeslider")
              .append("svg")
                  .attr("width", width)
                  .attr("height", height)
  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

  // draw histogram values
  g.append('g').selectAll('rect')
    .data(d3.range(range[0], range[1] + 1))
    .enter()
    .append('rect')
    .attr('x', d => x(d))
    .attr('y', d => height - y(histogram[d] || 0))
    .attr('width', width / (range[1] - range[0]))
    .attr('height', d => y(histogram[d] || 0)) //d => y(histogram[d] || 0))
    .style('fill', '#555');

  // draw background lines
  g.append('g').selectAll('line')
    .data(d3.range(range[0], range[1] + 1))
    .enter()
    .append('line')
    .attr('x1', d => x(d))
    .attr('x2', d => x(d))
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', '#ccc');

  // labels
  var labelMax = g.append('text')
    .attr('id', 'label-min')
    .attr('x', '-0.6em')
    .attr('y', height)
    .text(min);

  var labelMax = g.append('text')
    .attr('id', 'label-max')
    .attr('x', '-0.6em')
    .attr('y', 0)
    .text(max);

  var labelL = g.append('text')
    .attr('id', 'labelleft')
    .attr('x', 0)
    .attr('y', height + 5);

  var labelR = g.append('text')
    .attr('id', 'labelright')
    .attr('x', 0)
    .attr('y', height + 5);

  // define brush
  var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on('brush', function () {
      var s = d3.event.selection;
      // update and move labels
      labelL.attr('x', s[0]).text(format(Math.round(x.invert(s[0])) * bucketSize));
      labelR.attr('x', s[1]).text(format((Math.round(x.invert(s[1])) - 1) * bucketSize));
      // move brush handles
      handle
        .attr("display", null)
        .attr("transform", (d, i) => "translate(" + [s[i], - height / 4] + ")");
      // update view
      // if the view should only be updated after brushing is over,
      // move these two lines into the on('end') part below
      svg.node().value = s.map(d => bucketSize * Math.round(x.invert(d)));
      svg.node().dispatchEvent(new CustomEvent("input"));
    })
    .on('end', function () {
      if (!d3.event.sourceEvent) return;
      var d0 = d3.event.selection.map(x.invert);
      var d1 = d0.map(Math.round)
      d3.select(this).transition().call(d3.event.target.move, d1.map(x))
    });



  // append brush to g
  var gBrush = g.append("g")
    .attr("class", "brush")
    .call(brush);

  // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
  var brushResizePath = function (d) {
    var e = +(d.type == "e"),
      x = e ? 1 : -1,
      y = height / 2;
    return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
      "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
      "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
  }

  var handle = gBrush.selectAll(".handle--custom")
    .data([{ type: "w" }, { type: "e" }])
    .enter().append("path")
    .attr("class", "handle--custom")
    .attr("stroke", "#888")
    .attr("fill", '#eee')
    .attr("cursor", "ew-resize")
    .attr("d", brushResizePath);

  // override default behaviour - clicking outside of the selected area
  // will select a small piece there rather than deselecting everything
  // https://bl.ocks.org/mbostock/6498000
  gBrush.selectAll(".overlay")
    .each(function (d) { d.type = "selection"; })
    .on("mousedown touchstart", brushcentered);

  function brushcentered() {
    var dx = x(1) - x(0), // Use a fixed width when recentering.
      cx = d3.mouse(this)[0],
      x0 = cx - dx / 2,
      x1 = cx + dx / 2;
    d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
  }

  // select entire range
  //  gBrush.call(brush.move, range.map(x))

  // select default range
  gBrush.call(brush.move, defaultRange
    .map(d => width * (d / 100))
    .map(x.invert)
    .map(Math.round)
    .map(x));

  svg.append('style').text(style);
  return svg.node();
}