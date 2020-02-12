function drawBar(data){

  dataset = Array.from(map.values()).sort();
  //SVG attr
  var svgWidth = 960, svgHeight = 500, barPadding =5;

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
var barWidth = (plotWidth / dataset.length);



let plot = svg.append("g").attr("id", "plot");
plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //yScaler..
  var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0,plotHeight]).nice();

  var yScale2 = d3.scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([plotHeight,0]).nice();

  var monthScale = d3.scaleTime()
  .domain([new Date("2019-01-01"), new Date("2019-09-31")])
  .rangeRound([0, plotWidth]);



  let xAxis = d3.axisBottom(monthScale);
  let yAxis = d3.axisLeft(yScale2);

  let xGroup = plot.append("g").attr("id", "x-axis");
  xGroup.call(xAxis);

  // notice it is at the top of our svg
  // we need to translate/shift it down to the bottom
  xGroup.attr("transform", "translate(0," + plotHeight + ")");


  let yGroup = plot.append("g").attr("id", "y-axis");
  yGroup.call(yAxis);
  // yGroup.attr("transform", "translate(0"+ "," + plotWidth + ")");

  let pairs = Array.from(map.entries());
  console.log(pairs);

  let bars = plot.selectAll("rect")
   .data(pairs, function(d) { return d[1]; });


   bars.enter().append("rect")
  // we will style using css
  .attr("class", "bar")
  // the width of our bar is determined by our band scale
  .attr("width", barWidth - barPadding)
  // we must now map our letter to an x pixel position
  // note the use of arrow functions here
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#Arrow_functions
  .attr("x", d => monthScale(d[0]))
  // and do something similar for our y pixel position
  .attr("y", d => yScale2(d[1]))
  // here it gets weird again, how do we set the bar height?
  .attr("height", d => plotHeight - yScale2(d[1]))
  .attr("transform", function(d, i){
    var translate = [(barWidth * (i) + 5), 0];
    return "translate("+translate+")";})
  .each(function(d, i, nodes) {
    console.log("Added bar for:", d[0]);
  });




//   var barChart = plot.selectAll("rect")
//     .data(dataset)
//     .enter()
//     .append("rect")
//     .attr("y", function(d){
//       return plotHeight - yScale(d);
//     })
//     .attr("height", function(d){
//       return yScale(d);
//     })
//     .attr("width", barWidth - barPadding )
//     .attr("transform", function(d, i){
//       var translate = [(barWidth * (i) + 5), 0];
//       return "translate("+translate+")";
//   });
}

//Maps for holding data
let mapI = new Map();
let mapD = new Map();
let map = new Map();

d3.csv("test.csv", function(data){
  if(map.has(data.Month)){
    passcount = map.get(data.Month)

    passcount += parseInt(data.Count)
    map.set(data.Month, passcount)

  }else {
    map.set(data.Month, parseInt(data.Count))
  }
}).then(function(){
  drawBar()});
