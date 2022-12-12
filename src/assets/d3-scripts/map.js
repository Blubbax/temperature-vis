
svgCreated = false;



function resizeMap() {
  var svg = d3.select("div#map-visualization").select('svg');

  var width = parseInt(this.figure.style('width'), 10)
  var height = parseInt(this.figure.style('height'), 10)

  svg.attr("width", width)
    .attr("height", height);
}

function drawMap(stationdata) {


  this.figure = d3.select("div#map-visualization");

  var width = parseInt(this.figure.style('width'), 10)
  var height = parseInt(this.figure.style('height'), 10)


  var svg;
  var g;
  if (svgCreated) {
    svg = this.figure
      .select("svg");
    g = svg.select("g");
  } else {
    svg = this.figure
      .append("svg")
    // .attr("width", width)
    // .attr("heigth", height);
    // .attr("viewBox", [0, 0, width, width])
    // .style("font", "18px sans-serif");
    g = svg.append("g");
    svgCreated = true;
  }

  svg.attr("width", width)
    .attr("height", height);

  // Map and projection
  const projection = d3.geoMercator()
    .center([10, 55])                // GPS of location to zoom on
    .scale(600)                       // This is like the zoom
    .translate([width / 2, height / 2])


  // Create data for circles:
  const markers = [
    { long: 9.083, lat: 42.149, group: "A", size: 34 }, // corsica
    { long: 7.26, lat: 43.71, group: "A", size: 14 }, // nice
    { long: 2.349, lat: 48.864, group: "B", size: 87 }, // Paris
    { long: -1.397, lat: 43.664, group: "B", size: 41 }, // Hossegor
    { long: 3.075, lat: 50.640, group: "C", size: 78 }, // Lille
    { long: -3.83, lat: 58, group: "C", size: 12 } // Morlaix
  ];

  // Load external data and boot
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {

    // // Filter data
    // data.features = data.features//.filter(d => d.properties.name == "France")

    // Create a color scale
    // const color = d3.scaleOrdinal()
    //   .domain(["A", "B", "C"])
    //   .range(["#402D54", "#D18975", "#8FD175"])

    // const color = d3.scaleSqrt([-100, 0, 100], ["blue", "white", "red"])
    const color = d3.scaleLinear().domain([-25,40]).range(["blue", "red"])

    // Add a scale for bubble size
    const size = d3.scaleLinear()
      .domain([0, 1200])  // What's in the data
      .range([4, 18])  // Size in pixel

    // Draw the map
    g.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("fill", "#b8b8b8")
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      .style("stroke", "black")
      .style("opacity", .3)

    // Add circles:
    svg
      .selectAll("myCircles")
      .data(stationdata)
      .join("circle")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", d => size(d.elevation))
      .style("fill", d => color(d.temperatures[0].temperature))
      .attr("stroke", d => color(d.temperatures[0].temperature))
      .attr("stroke-width", 3)
      .attr("fill-opacity", .9)

    var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function (event) {
        g.selectAll('path')
          .attr('transform', event.transform);
        svg.selectAll('circle')
          .attr('transform', event.transform);
      });

    svg.call(zoom);
  })

}
