// @TODO: YOUR CODE HERE!
var xData = "poverty"
var yData = "healthcare"
var xTip = "% Poverty"
var yTip = "% Uninsured"

function makeResponsive() {

var svgArea = d3.select("#scatter").select("svg");

// clear svg is not empty
if (!svgArea.empty()) {
    svgArea.remove();
}

// https://stackoverflow.com/questions/4787527/
var svgWidth = document.getElementById("scatter").clientWidth;
var svgHeight = 800;

var margin = {
  top: 50,
  bottom: 120,
  right: 50,
  left: 105
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3.select("#scatter").append("svg")
    .attr("class", "img")
    .attr("height", svgHeight).attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
    // .attr("class", "chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then
    (function(USAdata)
    {
        // console.log(USAdata);
        console.log("Successful load of:", yData, "vs", xData)

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
        var xBubble = d3.scaleLinear()
            .domain(d3.extent(USAdata, d => d[xData]))
            .range([20, width-20]);
                
        var yBubble = d3.scaleLinear()
            .domain(d3.extent(USAdata, d => d[yData]))
            .range([height-20, 20]);
        
        var xAxis = d3.scaleLinear()
            .domain(d3.extent(USAdata, d => d[xData]))
            .range([0, width]);
                
        var yAxis = d3.scaleLinear()
            .domain(d3.extent(USAdata, d => d[yData]))
            .range([height, 0]);        
        
        var bottomAxis = d3.axisBottom(xAxis);
        var leftAxis = d3.axisLeft(yAxis);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
    
        chartGroup.append("g")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
        .data(USAdata)
        .enter()
        .append("circle")
        .attr("cx", d => xBubble(d[xData]))
        .attr("cy", d => yBubble(d[yData]))
        .attr("r", "15")
        .attr("class", "stateCircle")

        var circleLabels = chartGroup.selectAll("text")
        .data(USAdata)
        .enter()
        .append("text")
        .attr("x", d => xBubble(d[xData]))
        .attr("y", d => yBubble(d[yData]))
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
          ${d[xData]} ${xTip}<br>
          ${d[yData]} ${yTip}`); });

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
        var healthcareYlabel = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            // What is this?
            .attr("dy", "1em")
            .attr("class", "aText")
            .text("UNINSURED RATE (%)")
            .on("click", function() {
                yData = "healthcare";
                yTip = "% Uninsured";
                console.log("Loading:", yData);
            }
            )
            ;             
        var smokesYlabel = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+25)
            .attr("x", 0 - (height / 2))
            // What is this?
            .attr("dy", "1em")
            .attr("class", "aText")
            .text("SMOKERS (%)")
            .on("click", function() {
                yData = "smokes";
                yTip = "% Smokers";
                console.log("Loading:", yData);
            }
            )
            ;        
        var obesityYlabel = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+50)
            .attr("x", 0 - (height / 2))
            // What is this?
            .attr("dy", "1em")
            .attr("class", "aText")
            .text("OBESITY RATE (%)")
            .on("click", function() {
                yData = "obesity";
                yTip = "% Obesity";
                console.log("Loading:", yData);
            }
            )
            ;        
        var povertyXlabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
            .attr("class", "aText")
            .text("POVERTY RATE (%)")
            .on("click", function() {
                xData = "poverty";
                xTip = "% Poverty";
                console.log("Loading:", xData);
            }
            )
            ;
        var ageXlabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
            .attr("class", "aText")
            .text("MEDIAN AGE")
            .on("click", function() {
                xData = "age";
                xTip = "Median Age"
                console.log("Loading:", xData);
            }
            )
            ;
        var incomeXlabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
            .attr("class", "aText")
            .text("MEDIAN HOUSEHOLD INCOME ($)")
            .on("click", function() {
                xData = "income";
                xTip = "Median HH Income";
                console.log("Loading:", xData);
            }
            )
            ;
        
    }
    );
}
// When the browser loads, makeResponsive() is called.
makeResponsive();


// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
d3.select(window).on("click", makeResponsive);