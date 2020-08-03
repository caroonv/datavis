var svg_yr = d3.select('#yearsvg')
const height_yr = +svg_yr.attr('height');
const width_yr = +svg_yr.attr('width');
const margin_yr = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth_yr = width_yr - margin_yr.left - margin_yr.right;
const innerHeight_yr = height_yr - margin_yr.top - margin_yr.bottom;
var g_yr = svg_yr.append('g')
    .attr('transform', `translate(${margin_yr.left} , ${margin_yr.top})`);

var xScale_yr = d3.scaleBand()
    .range([0, innerWidth_yr])
    .padding(0.2);
var xAxis_yr = g_yr.append('g')
    .attr('transform', `translate(0, ${innerHeight_yr})`);

var yScale_yr = d3.scaleLinear()
    .range([innerHeight_yr, 0]);
var yAxis_yr = g_yr.append('g')
    .attr('class', 'myYaxis');

function update_chart(selectedVar) {

  d3.csv('monthly_data.csv', function(data) {
    xScale_yr.domain(data.map(d => d.Month))
    xAxis_yr.transition().duration(1000).call(d3.axisBottom(xScale_yr))

    yScale_yr.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxisG = yAxis_yr.call(d3.axisLeft(yScale_yr));
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 6)
        .attr('dy', '.5em')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .text('Usage kWh');
    yAxisG.transition().duration(1000);

    var bars = g_yr.selectAll('rect')
        .data(data)

    bars.enter().append('rect')
    .merge(bars)
        .attr('class', 'datarect')
        .attr('x', function(d) { return xScale_yr(d.Month); })
        .attr('y', function(d) { return yScale_yr(d[selectedVar]); })
        .attr('width', xScale_yr.bandwidth())
        .attr('height', function(d) { return innerHeight_yr - yScale_yr(d[selectedVar]); })
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
    bars.transition().duration(1000);

    var div = d3.select('#container').append('div')
        .attr('class', 'mytooltip')
        .style('display', 'none');

    function mouseover(){
        div.style('display', 'inline');
    }
    var formatMonth = d3.timeFormat("%B");
    function mousemove(){
        var d = d3.select(this).data()[0]
        d3.select(this).style('opacity', 1)
        var html_text = d.Month + '<br/> Energy Consumption: <b>' + d[selectedVar] + ' kWh</b>'
        div
            .html(html_text)
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
    }

    function mouseout(){
        div.style('display', 'none');
        d3.select(this).style('opacity', .3)
    }

    var totalLabels = g_yr.selectAll('.total').data(data);
    totalLabels.enter().append('text')
        .merge(totalLabels)
            .attr('class', 'total')
            .attr("y", d => yScale_yr(d[selectedVar]) - 5)
            .attr("x", d => xScale_yr(d.Month))
            .text(function(d) {
                if (d[selectedVar] > 0) {
                    return d[selectedVar] + 'kWh';
                }
            });

    totalLabels.exit().remove();
    }); //d3.csv
} //function update()

update_chart('2018')
function getSelectedYear() {
    var selectedValue = document.getElementById("years").value;
    update_chart(selectedValue)
}