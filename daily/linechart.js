const svg_lc = d3.select('#linechartsvg');
const height_lc = +svg_lc.attr('height');
const width_lc = +svg_lc.attr('width');
const margin_lc = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth_lc = width_lc - margin_lc.left - margin_lc.right;
const innerHeight_lc = height_lc - margin_lc.top - margin_lc.bottom;
const g_lc = svg_lc.append('g')
    .attr('transform', `translate(${margin_lc.left}, ${margin_lc.top})`);
const xScale_lc = d3.scaleBand().rangeRound([0, innerWidth_lc], .05).padding(0.1);
const yScale_lc = d3.scaleLinear().range([innerHeight_lc, 0]);
const xAxisG_lc = g_lc.append('g').attr('transform', `translate(0, ${innerHeight_lc})`);
const yAxisG_lc = g_lc.append('g').attr('class', 'yAxis');
const yAxisLabel_lc = 'Usage kWh';
const strText1 = 'Daily Usage trend for ';
var current_date = '01 January, 2019'

url_lc = 'usage-15min.csv'
function update_linechart(udate, umonth, uyear){
    d3.csv(url_lc, function(d) {
        return {USAGE_DATE: new Date(d.USAGE_DATE), USAGE_KWH: +d.USAGE_KWH}
    },
    function(_data) {
            data = _data.filter(function(d) {
                return (d.USAGE_DATE.getFullYear() == uyear && d.USAGE_DATE.getMonth() == umonth && d.USAGE_DATE.getDate() == udate)
            });
        const xValue = d => d.USAGE_DATE;
        const yValue = d => d.USAGE_KWH;

        var formatMonth = d3.timeFormat("%B"),
        mydate = new Date(uyear, umonth-1, udate);
        current_date = udate + ' ' + formatMonth(mydate) + ', ' + uyear;

        d3.select('#chartlabel').remove();
        svg_lc.append('text')
                .attr('id', 'chartlabel')
                .attr('class', 'chartlabel')
                .style("fill", "black")
                .attr("text-anchor", "middle")
                .attr('x', 200)
                .attr('y', 50)
                .text(strText1 + current_date);

        xScale_lc.domain(data.map(xValue));
        const xAxis = d3.axisBottom(xScale_lc).tickFormat(d3.timeFormat('%I:%M'));
        xAxisG_lc.call(xAxis.ticks(12).tickSize(0))
            .selectAll('text')
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style('text-anchor', 'end');

        yScale_lc.domain(d3.extent(data, yValue))
        yAxisG_lc.call(d3.axisLeft(yScale_lc));
        yAxisG_lc.append('text')
            .attr('class', 'axis-label')
            .attr('y', 6)
            .attr('dy', '.5em')
            .attr('fill', 'black')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'end')
            .text(yAxisLabel_lc);

        const lineGenerator = d3.line()
            .x(d => xScale_lc(xValue(d)))
            .y(d => yScale_lc(yValue(d)));

        cline = g_lc.selectAll('.line-path').data([data], d => d.USAGE_KWH);
        cline
            .enter().append('path')
            .attr('class', 'line-path')
            .merge(cline)
            .attr('d', lineGenerator(data));

        points = g_lc.selectAll('circle').data(data);
        points
            .enter().append('circle')
            .merge(points)
                .attr('cy', d => yScale_lc(yValue(d)))
                .attr('cx', d => xScale_lc(xValue(d)))
                .attr('r', 5);
            // .append('title')
            //     .text(d => 'Energy Usage: ' + d.USAGE_KWH + 'kWH at ' + d.USAGE_DATE.getHours() + ":" + d.USAGE_DATE.getMinutes());
        points.exit().remove();

        let totalLength = g_lc.select('.line-path').node().getTotalLength();
        g_lc.select('.line-path')
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition() // Call Transition Method
            .duration(6000) // Set Duration timing (ms)
            .ease(d3.easeLinear) // Set Easing option
            .attr('stroke-dashoffset', 0);
    });
}
update_linechart(1,1,2019);