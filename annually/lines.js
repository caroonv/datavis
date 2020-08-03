var svg = d3.select('#linesvg')
const height = +svg.attr('height');
const width = +svg.attr('width');
const margin = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
var g = svg.append('g')
     .attr('transform', `translate(${margin.left} , ${margin.top})`);

colors_list = ['#ff4500', '#008000', '#0000ff'];
const strText1 = 'Usage trend seems to be consistent ';
const strText2 = ' and same over the years';
const annotations = [strText1, strText2];
var xAxis = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);
var yAxis = g.append('g').attr('class', 'myYaxis');

d3.csv('monthly_data_lines.csv', function(data) {
    var year_groups = d3.nest()
        .key(function(d) { return d.Year;})
        .entries(data);

    var xScale = d3.scaleBand()
        .domain(data.map(d => d.Month))
        .range([0, innerWidth]);
    xAxis.call(d3.axisBottom(xScale));

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Usage)])
        .range([innerHeight, 0]);
    yAxisG = yAxis.call(d3.axisLeft(yScale));
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 6)
        .attr('dy', '.5em')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .text('Usage kWh');

    var groups = year_groups.map(d => d.key);
    var colorScale = d3.scaleOrdinal().domain(groups).range(colors_list);

    svg.selectAll('.line')
        .data(year_groups)
        .enter()
        .append('path')
            .attr('fill', 'none')
            .attr('stroke', d => colorScale(d.key))
            .attr('stroke-width', 1.5)
            .attr('d', function(d){
                return d3.line()
                .x(d => xScale(d.Month)+xScale.bandwidth())
                .y(d => yScale(+d.Usage)+margin.bottom)
                (d.values)
        })

    var lineLegend = svg.selectAll('.lineLegend').data(groups)
        .enter().append('g')
        .attr('class','lineLegend')
        .attr('transform', function (d,i) {
                return 'translate(' + (innerWidth - margin.right) + ',' + ((i+2)*20)+')';
            });

    lineLegend.append('text').text(function (d) {return d;})
        .attr('transform', 'translate(15,9 )');

    lineLegend.append('rect')
        .style('fill', function (d, i) {return colorScale(d); })
        .attr('width', 10).attr('height', 10);

    svg.selectAll("line.horizontalGrid").data(yScale.ticks(4)).enter()
        .append("line")
            .attr(
            {
                "class":"horizontalGrid",
                "x1" : margin.right,
                "x2" : innerWidth,
                "y1" : function(d){ return yScale(d);},
                "y2" : function(d){ return yScale(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "black",
                "stroke-width" : "1px"
            });

    textG = g.append('g').attr('transform', 'translate(120,80)');
    textG.selectAll('myannotations')
        .data(annotations)
        .enter()
        .append('text')
            .attr('id', 'chartlabel')
            .attr('class', 'chartlabel')
            .style("fill", "black")
            .attr("text-anchor", "middle")
            .attr('x', 0)
            .attr('y', function(d,i) {return (i*11);})
            .text(d => d);

}); //d3.csv