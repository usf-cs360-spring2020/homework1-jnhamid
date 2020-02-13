function drawPie(data){
  // set the dimensions and margins of the graph
  var width = 600
      height = 600
      margin = 90

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  var area = [...new Set(data.map(d => d.BoardingArea))];

  var formatComma = d3.format(",");

  var arc = d3.arc()
    	.innerRadius(0)
    	.outerRadius(radius)

  var svg = d3.select("#pieChart")
      .attr("width", width + 360)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  svg.append("text").attr("id", "charttitle")
   .attr("x",  55 )
   .attr("y", -250)
   .style("text-anchor", "middle")
   .text("Number of Passengers per Boarding Group 2017-2019");

      // Create dummy data
     var data = {A: 21105667, B: 11258276, C:15549687, D:26310441, E:19733977, F: 40137863, G:22977234}

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
var g=  svg
    .selectAll('.arc')
    .data(data_ready)
    .enter()
    .append('g');
    g.append("path")
    .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius))
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "transparent")
    .style("stroke-width", "1px");

    g.append("text")
       	.attr("transform", function(d) {
           var _d = arc.centroid(d);
           _d[0] *= 2.4;	//multiply by a constant factor
           _d[1] *= 2.4;	//multiply by a constant factor
           return "translate(" + _d + ")";
         })
         .attr("dy", ".60em")
         .style("text-anchor", "middle")
         .text(function(d) {
           return d.data.key;
         });
   g.append("text")
        .attr("id", 'pieLabel')
      	.attr("transform", function(d) {
          var _d = arc.centroid(d);
          _d[0] = (_d[0] * 2.5) ;	//multiply by a constant factor
          _d[1] = (_d[1] * 2.4);	//multiply by a constant factor
          return "translate(" + _d + ")";
        })
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .style("padding-top", "10px")
        .text(function(d) {
          return formatComma(d.data.value); });

   var size = 20
  var SVG = d3.select("#pieLegend")

  SVG.selectAll("mydots")
    .data(area)
    .enter()
    .append("rect")
      .attr("x", 100)
      .style("background", "red")
      .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d){ return color(d)})
   SVG.selectAll("mylabels")
    .data(area)
    .enter()
    .append("text")
      .attr("x", 100 + size*1.2)
      .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return area[d]})
      .text(function(d){
        return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

  SVG.append("text").attr("id","legendtitle")
   .attr("x", 70 + size*1.2)
   .attr("y", function(d,i){ return 90 + i*(size+5)})
   .style("text-anchor", "start")
   .text("Boarding Area");

}

d3.csv("piechart.csv").then(d => drawPie(d));
