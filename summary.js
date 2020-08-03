const svg_s = d3.select('#summarysvg');
const height_s = +svg_s.attr('height');
const width_s = +svg_s.attr('width');
const margin_s = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth_s = width_s - margin_s.left - margin_s.right;
const innerHeight_s = height_s - margin_s.top - margin_s.bottom;
const xAxisLabel_s = 'Year';
const yAxisLabel_s = 'Usage kWh';
const g_s = svg_s.append('g')
    .attr('transform', `translate(${margin_s.left}, ${margin_s.top})`);
const strChartText1 = 'Full year consumption for past two '
const strChartText2 = 'years  has been consistent at '
const strChartText3 = 'approx 20,000 kWh'
annotations = [strChartText1, strChartText2, strChartText3]

url_s = 'data.csv'
d3.csv(url_s, function(d) {
    return {Year: d.Year, Total: +d.Total}
},
function(data) {
    const xValue = d => d.Year;
    const yValue = d => d.Total;

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight_s, 0]);

    const xScale = d3.scaleBand()
        .domain(data.map(xValue))
        .range([0, innerWidth_s])
        .padding(0.2);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    const barHeight = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([0, innerHeight_s]);

    g_s.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('x', d => xScale(xValue(d)))
            .attr('y', d => yScale(yValue(d)))
            .attr('fill', 'steelblue')
            .style('opacity', .4)
            .attr('width', xScale.bandwidth())
            .attr('height', d => barHeight(yValue(d)))
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

    var div = d3.select('#container').append('div')
        .attr('class', 'mytooltip')
        .style('display', 'none');

    function mouseover(){
        div.style('display', 'inline');
    }

    function mousemove(){
        var d = d3.select(this).data()[0]
        d3.select(this).style('opacity', 1)
        div
            .html(d.Year + '<br/>Energy Consumption: <b>' + d.Total + ' kWh</b>')
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
    }

    function mouseout(){
        div.style('display', 'none');
        d3.select(this).style('opacity', .4)
    }

    const yAxisG_s = g_s.append('g').call(yAxis);
    yAxisG_s.append('text')
        .attr('class', 'axis-label')
        .attr('y', 6)
        .attr('dy', '.5em')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .text(yAxisLabel_s);

    const xAxisG_s = g_s.append('g')
        .attr('transform', `translate(0, ${innerHeight_s})`)
        .call(xAxis)
        .selectAll('text')
            .attr('y', 6)
            .attr('x', 6)
            .style('text-anchor', 'middle');

    textG = g_s.append('g').attr('transform', 'translate(450,150) rotate(-30)');
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
});