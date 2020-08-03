const svg = d3.select('#barchartsvg');
const height = +svg.attr('height');
const width = +svg.attr('width');
const margin = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const yAxisLabel = 'Usage kWh';

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const dailyAverageAnon = [
  {
    note: {
      label: '2018 Energy Usage Summary',
      title: 'Daily Average',
      align: 'middle',
      wrap: 200,
      padding: 10,
    },
     color: ['#69b3a2'],
    x: 250,
    y: 150,
    dy: 50,
    dx: 50
  }
]

const monthlyTotalAnon = [
  {
    note: {
      label: 'Total for the month of',
      title: 'Monthly Total',
      align: 'middle',
      wrap: 200,
      padding: 10,
    },
     color: ['#69b3a2'],
    x: 450,
    y: 150,
    dy: 50,
    dx: 50
  }
]

var url = 'DailyData.csv'
const xScale = d3.scaleBand().rangeRound([0, innerWidth], .05).padding(0.1);
const xAxisG = g.append('g').attr('transform', `translate(0, ${innerHeight})`);
const yScale = d3.scaleLinear().range([innerHeight, 0]);
const yAxis = g.append('g').attr('class', 'yAxis');

function update_chart(month, year) {
    d3.csv(url, function(d) {
        return {USAGE_DATE : d3.timeParse("%m/%d/%Y")(d.USAGE_DATE), Total : +d.Total }
        },
        function(_data) {
            data = _data.filter(function(d) {
                return (d.USAGE_DATE.getMonth() == month && d.USAGE_DATE.getFullYear() == year)
            });
            const xValue = d => d.USAGE_DATE;
            const yValue = d => +d.Total;

            xScale.domain(data.map(xValue));
            var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%d'));

            xAxisG.call(xAxis.ticks(null).tickSize(0))
                .selectAll('text')
                    .style('text-anchor', 'middle');

            xAxisG.transition().duration(1000);//.call(d3.axisBottom(xScale));

            yScale.domain([0, d3.max(data, yValue)]);
            yAxisG = yAxis.call(d3.axisLeft(yScale));

            const barHeight = d3.scaleLinear()
                .domain([0, d3.max(data, yValue)])
                .range([0, innerHeight]);

            yAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('y', 6)
                .attr('dy', '.5em')
                .attr('fill', 'black')
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'end')
                .text(yAxisLabel);
            yAxisG.transition().duration(1000);

            var bars = g.selectAll('rect').data(data);
            bars.enter().append('rect')
                .merge(bars)
                    .attr('x', d => xScale(xValue(d)))
                    .attr('y', d => yScale(yValue(d)))
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => barHeight(yValue(d)))
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseout', mouseout)
                .on('click', update_chart);
            bars.exit().remove();

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
                var html_text = d.USAGE_DATE.getMonth()+1 + "/"
                    + d.USAGE_DATE.getDate() + "/" + d.USAGE_DATE.getFullYear()
                    + '<br/> Energy Consumption: <b>' + d.Total + ' kWh</b>'
                div
                    .html(html_text)
                    .style('left', (d3.event.pageX - 34) + 'px')
                    .style('top', (d3.event.pageY - 12) + 'px');
            }

            function mouseout(){
                div.style('display', 'none');
                d3.select(this).style('opacity', .3)
            }

            function update_chart(){
                var d = d3.select(this).data()[0]
                update_linechart(d.USAGE_DATE.getDate(), d.USAGE_DATE.getMonth(), d.USAGE_DATE.getFullYear());
            }

        }); //d3.csv
} //update_chart

update_chart(0, 2019);
function getSelectedValues() {
    var selectedMonth = document.getElementById("months").value;
    var selectedYear = document.getElementById("years").value;
    update_chart(selectedMonth, selectedYear)
}
