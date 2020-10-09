// @TODO: YOUR CODE HERE!
// var xData = "poverty"
// var yData = "healthcare"

// var xNewData = "poverty"
// var yNewData = "healthcare"

var xData_Global;
var yData_Global;

var xTip = "% Poverty"
var yTip = "% Uninsured"

function makeResponsive(xData, yData, xNewData, yNewData) {

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
            // console.log("Successful load of:", yData, "vs", xData)

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
            
            var x2Bubble = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[xNewData]))
                .range([20, width-20]);
                    
            var yBubble = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[yData]))
                .range([height-20, 20]);

            var y2Bubble = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[yNewData]))
                .range([height-20, 20]);
            
            var xAxis = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[xData]))
                .range([0, width]);
            
            var x2Axis = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[xNewData]))
                .range([0, width]);

            var yAxis = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[yData]))
                .range([height, 0]);
            
            var y2Axis = d3.scaleLinear()
                .domain(d3.extent(USAdata, d => d[yNewData]))
                .range([height, 0]);        
            
            var bottomAxis = d3.axisBottom(xAxis);
            var leftAxis = d3.axisLeft(yAxis);

            var bottom2Axis = d3.axisBottom(x2Axis);
            var left2Axis = d3.axisLeft(y2Axis);

            var bottomTicks = chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);
        
            var leftTicks = chartGroup.append("g")
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

            if (yNewData != yData || xNewData != xData)
                {
                circleShape.transition().duration(1000)
                .attr("cx", d => x2Bubble(d[xNewData]))
                .attr("cy", d => y2Bubble(d[yNewData]));
                circleLabel.transition().duration(1000)
                .attr("x", d => x2Bubble(d[xNewData]))
                .attr("y", d => y2Bubble(d[yNewData]));
                circleOutline.transition().duration(1000)
                .attr("cx", d => x2Bubble(d[xNewData]))
                .attr("cy", d => y2Bubble(d[yNewData]));
                leftTicks.transition().duration(1000)
                .call(left2Axis);
                bottomTicks.transition().duration(1000)
                .call(bottom2Axis);
                }

            yData = yNewData;
            xData = xNewData;

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
            circleOutline.on("mouseover", function(data) {
                toolTip.show(data, this);
            })
                // onmouseout event
                .on("mouseout", function(data, index) {
                toolTip.hide(data);
                })
                .on("click", function(data, index) {
                    toolTip.hide(data);
                })
            ; 

            // Create axis labels
            var axisLabels = chartGroup.selectAll("text")
                .data(USAdata).enter().append("g");

            var healthcareYlabel = chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                // What is this?
                .attr("dy", "1em")
                .attr("class", "aText")
                .attr("id", "healthcare")
                .text("UNINSURED RATE (%)")
                .on("click", function() {
                    makeResponsive(xData, yData, xData, "healthcare");
                    yNewData = "healthcare";
                    yTip = "% Uninsured";
                    console.log("Loading new Y:", yNewData);
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
                .attr("id", "smokes")
                .text("SMOKERS (%)")
                .on("click", function() {
                    makeResponsive(xData, yData, xData, "smokes");
                    yNewData = "smokes";
                    yTip = "% Smokers";
                    console.log("Loading new Y:", yNewData);
                })
            ;        
            var obesityYlabel = chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left+50)
                .attr("x", 0 - (height / 2))
                // What is this?
                .attr("dy", "1em")
                .attr("class", "aText")
                .attr("id", "obesity")
                .text("OBESITY RATE (%)")
                .on("click", function() {
                    makeResponsive(xData, yData, xData, "obesity");
                    yNewData = "obesity";
                    yTip = "% Obesity";
                    console.log("Loading new Y:", yNewData);
                })
            ;
            var povertyXlabel = chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
                .attr("class", "aText")
                .attr("id", "poverty")
                .text("POVERTY RATE (%)")
                .on("click", function() {
                    makeResponsive(xData, yData, "poverty", yData);
                    xNewData = "poverty";
                    xTip = "% Poverty";
                    console.log("Loading new X:", xNewData);
                })
            ;
            var ageXlabel = chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
                .attr("class", "aText")
                .attr("id", "age")
                .text("MEDIAN AGE")
                .on("click", function() {
                    makeResponsive(xData, yData, "age", yData);
                    xNewData = "age";
                    xTip = "Median Age"
                    console.log("Loading new X:", xNewData);
                })
            ;
            var incomeXlabel = chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
                .attr("class", "aText")
                .attr("id", "income")
                .text("MEDIAN HOUSEHOLD INCOME ($)")
                .on("click", function() {
                    makeResponsive(xData, yData, "income", yData);
                    xNewData = "income";
                    xTip = "Median HH Income";
                    console.log("Loading new X:", xNewData)
                })
            ;
                        
            if (xData === "income")
                incomeXlabel.classed("activex", true);
                else incomeXlabel.classed("inactive", true);
            if (xData === "poverty")
                povertyXlabel.classed("activex", true);
                else povertyXlabel.classed("inactive", true);
            if (xData === "age")
                ageXlabel.classed("activex", true);
                else ageXlabel.classed("inactive", true);
            
            if (yData === "healthcare")
                healthcareYlabel.classed("activey", true);
                else healthcareYlabel.classed("inactive", true);
            if (yData === "smokes")
                smokesYlabel.classed("activey", true);
                else smokesYlabel.classed("inactive", true);
            if (yData === "obesity")
                obesityYlabel.classed("activey", true);
                else obesityYlabel.classed("inactive", true);
            
            xDataGlobal = xData;
            yDataGlobal = yData;
        }
        );

}

// When the browser loads, makeResponsive() is called.
makeResponsive("poverty", "healthcare", "poverty", "healthcare");

// var selectedX;
// var selectedY;

// function values()
// {
//     selectedX = document.getElementsByClassName("activex")[0].id;
//     console.log(selectedX);

//     selectedY = document.getElementsByClassName("activey")[0].id
//     console.log(selectedY);

//     // return selectedX, selectedY;
// }

// window.onload = values;

// When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);

// d3.select(window).on("resize", function() {
//     setTimeout(()=>{
//         var selectedX = document.getElementsByClassName("activex")[0].id;
//         var selectedY = document.getElementsByClassName("activey")[0].id;
//         makeResponsive(selectedX, selectedY, selectedX, selectedY);
//     }, 1000);
// }
// );

// TA Benji for the ()=> win!
d3.select(window).on("resize",
    ()=> makeResponsive(xDataGlobal, yDataGlobal, xDataGlobal, yDataGlobal));