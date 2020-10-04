// @TODO: YOUR CODE HERE!
console.log("This is app.js.")

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  bottom: 70,
  right: 50,
  left: 70
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight).attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then
    (function(USAdata)
    {
        console.log(USAdata);

        USAdata.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.healthcare = +data.healthcare;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;

        });
    
        // Figure out where this needs to be defined for changing the axes,
        // Perhaps as new functions feeding in the variable clicked on?
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(USAdata, d => d.poverty)-1,
                d3.max(USAdata, d => d.poverty)+1])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(USAdata, d => d.healthcare)-1,
                d3.max(USAdata, d => d.healthcare)+1])
            .range([height, 0]);
        
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
    
        chartGroup.append("g")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
        .data(USAdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "20")
        .attr("class", "stateCircle")

        var circleLabels = chartGroup.selectAll("text")
        .data(USAdata)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dominant-baseline", "central")
        .attr("class", "stateText")
        .text(d => d.abbr);
        // .html(function(d) { return (<p id="text">`${d.abbr}`</p>) } );

        var toolTip = d3.tip() // TypeError d3.tip not a function
        .attr("class", "tooltip")
        .offset([80, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
          return (`<strong>${d.state}</strong><br>
          ${d.poverty}% Poverty<br>
          ${d.healthcare}% Lack Healthcare`); });

        chartGroup.call(toolTip);

        circleLabels.on("mouseover", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            });
        
        // Putting this in while I figure out why all the labels aren't showing
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });
        
        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            // .attr("dy", "1em")  What is this?
            .attr("class", "axisText")
            .text("POPULATION LACKING HEALTHCARE (%)");
        
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
            .attr("class", "axisText")
            .text("POVERTY RATE (%)");
    }
    );
