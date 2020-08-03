const svg_lc = d3.select('#linesvg');
const height_lc = +svg_lc.attr('height');
const width_lc = +svg_lc.attr('width');
const margin_lc = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth_lc = width_lc - margin_lc.left - margin_lc.right;
const innerHeight_lc = height_lc - margin_lc.top - margin_lc.bottom;
const xAxisLabel_lc = 'Date';
const yAxisLabel_lc = 'Usage kWh';
const g_lc = svg_lc.append('g')
    .attr('transform', `translate(${margin_lc.left}, ${margin_lc.top})`);
const xScale_lc = d3.scaleTime().range([0, innerWidth_lc]);
const xAxisG_lc = g_lc.append('g').attr('transform', `translate(0, ${innerHeight_lc})`);
const yScale_lc = d3.scaleLinear().range([innerHeight_lc, 0]);
const yAxisG_lc = g_lc.append('g').attr('class', 'yAxis');
const strText1 = 'Usage trend for the month of ';
var current_month = 'January, 2019'
var url_lc = 'DailyData.csv';

function update_chart_lc(month, year) {
    d3.csv(url_lc, function(d) {
        return {USAGE_DATE : d3.timeParse("%m/%d/%Y")(d.USAGE_DATE), Total : +d.Total }
        },
        function(_data) {
            data = _data.filter(function(d) {
                return (d.USAGE_DATE.getMonth() == month && d.USAGE_DATE.getFullYear() == year)
            });
            var formatMonth = d3.timeFormat("%B"),
            mydate = new Date(year, month, 1);
            current_month = formatMonth(mydate) + ', ' + year;

            d3.select('#chartlabel').remove();
            svg_lc.append('text')
                    .attr('id', 'chartlabel')
                    .attr('class', 'chartlabel')
                    .style("fill", "black")
                    .attr("text-anchor", "middle")
                    .attr('x', 200)
                    .attr('y', 50)
                    .text(strText1 + current_month);

            const xValue = d => d.USAGE_DATE;
            const yValue = d => d.Total;

            xScale_lc.domain(d3.extent(data, xValue));
            xAxisG_lc.call(d3.axisBottom(xScale_lc));

            yScale_lc.domain([d3.min(data, yValue), d3.max(data, yValue)]);
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

            cline = g_lc.selectAll('.line-path').data([data], d => d.Total);
            cline
                .enter().append('path')
                .attr('class', 'line-path')
                .merge(cline)
                .attr('d', lineGenerator);

            points = g_lc.selectAll('circle').data(data);
            points
                .enter().append('circle')
                .merge(points)
                    .attr('cy', d => yScale_lc(yValue(d)))
                    .attr('cx', d => xScale_lc(xValue(d)))
                    .attr('r', 5);

            points.exit().remove();

            let totalLength = g_lc.select('.line-path').node().getTotalLength();
            g_lc.select('.line-path')
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(6000)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        });
}

update_chart_lc(0, 2019)
function getSelectedValues() {
    var selectedMonth = document.getElementById("months").value;
    var selectedYear = document.getElementById("years").value;
    update_chart(selectedMonth, selectedYear)
    update_chart_lc(selectedMonth, selectedYear)
}