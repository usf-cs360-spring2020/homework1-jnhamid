function drawPie(data){
  // set the dimensions and margins of the graph
  var width = 450
      height = 450
      margin = 40

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'my_dataviz'
  var svg = d3.select("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      console.log()
  var area = [...new Set(data.map(d => d.BoardingArea))];


  // Create dummy data
  var data = {a: 21105667, b: 11258276, c:15549687, d:26310441, e:19733977, f: 40137863, g:22977234}

  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(area)
    .range(["#1BA3C6", "#1FAE81", "#BCBD22", "#F88113", "#F43C63", "#D669BE", "#4F7CBA"])

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) {
		return a.key.localeCompare(b.key);
	});
  var data_ready = pie(d3.entries(data))

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 0.7)


}

d3.csv("piechart.csv").then(d => drawPie(d));
