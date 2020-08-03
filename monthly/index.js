const svg = d3.select('svg');
const height = +svg.attr('height');
const width = +svg.attr('width');
const margin = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const yAxisLabel = 'Usage kWh';

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

url = 'monthly_data.csv'
d3.csv(url, function(d) {
    return { Month : d3.timeParse('%m/%d/%Y')(d.Month), Total : d.Total }
    },
    function(data) {
        const xValue = d => d.Month;
        const yValue = d => +d.Total;

        const xScale = d3.scaleBand()
            .domain(data.map(xValue))
            .rangeRound([0, innerWidth], .05).padding(0.1);

        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b'));
        const xAxisG = g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis.ticks(null).tickSize(0))
            .selectAll('text')
                .style('text-anchor', 'middle');

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, yValue)])
            .range([innerHeight, 0]);

        const barHeight = d3.scaleLinear()
            .domain([0, d3.max(data, yValue)])
            .range([0, innerHeight]);

        const yAxis = d3.axisLeft(yScale);

        g.selectAll('rect').data(data)
            .enter().append('rect')
                .attr('x', d => xScale(xValue(d)))
                .attr('y', d => yScale(yValue(d)))
                .attr('width', xScale.bandwidth())
                .attr('height', d => barHeight(yValue(d)))
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout)
            .on('click', update_chart);

        var div = d3.select('#container').append('div')
            .attr('class', 'mytooltip')
            .style('display', 'none');

        function mouseover(){
            div.style('display', 'inline');
        }

        var formatMonth = d3.timeFormat('%B');
        function mousemove(){
            var d = d3.select(this).data()[0]
            d3.select(this).style('opacity', 1)
            var html_text = formatMonth(d.Month) + ', ' + d.Month.getFullYear()
                + '<br/> Energy Data Consumption: <b>' + d.Total + ' kWh</b>'
            div
                .html(html_text)
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }

        function mouseout(){
            div.style('display', 'none');
            d3.select(this).style('opacity', .4)
        }

        function update_chart(){
            var d = d3.select(this).data()[0]
            update_chart_lc(d.Month.getMonth(), d.Month.getFullYear());
        }

        const yAxisG = g.append('g').call(yAxis);
        yAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 6)
            .attr('dy', '.5em')
            .attr('fill', 'black')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'end')
            .text(yAxisLabel);

    });