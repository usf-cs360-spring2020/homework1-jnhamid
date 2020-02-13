function drawBar(data){

  // dataset = Array.from(map.values()).sort();
  //SVG attr
  var svgWidth = 960, svgHeight = 500, barPadding =5;

  var keys = data.columns.slice(1);

  var month = [...new Set(data.map(d => d.Month))];


  var svg = d3.select("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


  svg.append("text").attr("id", "charttitle")
   .attr("x",  svgWidth/3.9 )
   .attr("y", 25)
   .style("text-anchor", "middle")
   .text("Number of people flying out of sfo");

  let margin = {
  top:    15,
  right:  10,
  bottom: 30, // leave space for x-axis
  left:   60 // leave space for y-axis
};
// now we can calculate how much space we have to plot
let bounds = svg.node().getBoundingClientRect();
let plotWidth = bounds.width - margin.right - margin.left;
console.log(plotWidth)
let plotHeight = bounds.height - margin.top - margin.bottom;
// var barWidth = (plotWidth / dataset.length);
let plot = svg.append("g").attr("id", "plot");
plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
		.range([margin.left, plotWidth - margin.right])
		.padding(0.1)

var y = d3.scaleLinear()
		.rangeRound([plotHeight - margin.bottom, margin.top])

var xAxis = svg.append("g")
		.attr("transform", `translate(0,${plotHeight - margin.bottom})`)
		.attr("class", "x-axis")

var yAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.attr("class", "y-axis")

var z = d3.scaleOrdinal()
		.range(["steelblue", "darkorange"])
		.domain(keys);


var dataset = data.filter(f => f.Month)

		dataset.forEach(function(d) {
			d.total = d3.sum(keys, k => +d[k])
			return d
		})

    y.domain([0, d3.max(dataset, d => d3.sum(keys, k => +d[k]))]).nice();

		svg.selectAll(".y-axis")
			.call(d3.axisLeft(y).ticks(null, ".1s"))

    x.domain(dataset.map(d => d.Month));

		svg.selectAll(".x-axis")
			.call(d3.axisBottom(x).tickSizeOuter(0))

      var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(dataset), d => d.key);

      group.exit().remove()

      group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		var bars = svg.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => console.log(e.data.Month));
      bars.exit().remove()

	bars.enter().append("rect")
			.attr("width", x.bandwidth())
			.merge(bars)
			.attr("x", d => x(d.data.Month))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]))

}
d3.csv("test2.csv").then(d => drawBar(d));
