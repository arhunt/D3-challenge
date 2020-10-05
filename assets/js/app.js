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
        
        // Select the circles and append with group for hover together.
        var circle = chartGroup.selectAll("circle")
            .data(USAdata).enter().append("g");

        // Main shape with color
        var circleShape = circle.append("circle")
            .attr("cx", d => xBubble(d[xData]))
            .attr("cy", d => yBubble(d[yData]))
            .attr("r", "15")
            .attr("class", "stateCircle")
        ;
        
        // State abbreviation in center
        var circleLabel = circle.append("text")
            .attr("x", d => xBubble(d[xData]))
            .attr("y", d => yBubble(d[yData]))
            .attr("dominant-baseline", "central")
            .attr("class", "stateText")
            .text(d => d.abbr)
        ;

        // Overlay shape for outline/hover
        var circleOutline = circle.append("circle")
            .attr("cx", d => xBubble(d[xData]))
            .attr("cy", d => yBubble(d[yData]))
            .attr("r", "15")
            .attr("class", "clearCircle")
        ;

        // Create tooltip
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
          return (`<strong>${d.state}</strong><br>
          ${d[xData]} ${xTip}<br>
          ${d[yData]} ${yTip}`); });

        chartGroup.call(toolTip);

        // Mouseover to show tooltip - outline is in CSS
        circle.on("mouseover", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            })
        ; 

        // Create axis labels
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
            })
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
            })
        ;
        var povertyXlabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
            .attr("class", "aText")
            .text("POVERTY RATE (%)")
            .on("click", function() {
                xData = "poverty";
                xTip = "% Poverty";
                console.log("Loading:", xData);
            })
        ;
        var ageXlabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
            .attr("class", "aText")
            .text("MEDIAN AGE")
            .on("click", function() {
                xData = "age";
                xTip = "Median Age"
                console.log("Loading:", xData);
            })
        ;
        var incomeXlabel = chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
            .attr("class", "aText")
            .text("MEDIAN HOUSEHOLD INCOME ($)")
            .on("click", function() {
                xData = "income";
                xTip = "Median HH Income";
                console.log("Loading:", xData);
            })
        ;
        
        if (xData === "income")
            incomeXlabel.classed("active", true);
            else incomeXlabel.classed("inactive", true);
        if (xData === "poverty")
            povertyXlabel.classed("active", true);
            else povertyXlabel.classed("inactive", true);
        if (xData === "age")
            ageXlabel.classed("active", true);
            else ageXlabel.classed("inactive", true);
        
        if (yData === "healthcare")
            healthcareYlabel.classed("active", true);
            else healthcareYlabel.classed("inactive", true);
        if (yData === "smokes")
            smokesYlabel.classed("active", true);
            else smokesYlabel.classed("inactive", true);
        if (yData === "obesity")
            obesityYlabel.classed("active", true);
            else obesityYlabel.classed("inactive", true);
        
        
        // var title = chartGroup.append("text")
        //     .attr("x", width/2)
        //     .attr("y", -25)
        //     .text("FIGURE:")
        // ;
    }
    );
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
d3.select(window).on("click", makeResponsive);