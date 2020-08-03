var svg = d3.select('#stackedsvg')
const height = +svg.attr('height');
const width = +svg.attr('width');
const margin = {top: 25, right: 25, left: 50, bottom: 25};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
var g = svg.append('g')
    .attr('transform', `translate(${margin.left} , ${margin.top})`);
var color_list = ['#e41a1c','#377eb8','#4daf4a'];
const strText1_1 = 'More energy was used in early months';
const strText1_2 = ' of summer in 2018 than in 2019 ';
const strText1_3 = ' or 2020';
const annotations = [strText1_1, strText1_2, strText1_3]

d3.csv('monthly_stacked.csv', function(data) {
    var subgroups = data.columns.slice(1)
    var groups = d3.map(data, function(d){return(d.Month)}).keys()

    var x = d3.scaleBand()
        .domain(groups)
        .range([0, innerWidth])
        .padding([0.2])
    g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d['2018']}) ])
        .range([innerHeight, 0]);
    g.append('g')
        .call(d3.axisLeft(y))
    .append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.5em')
        .style('text-anchor', 'end')
        .text('Usage kWh');        ;

    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    var colorScale = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])

    var u = g.selectAll('rect')
      .data(data)
    g.append('g')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
            .attr('transform', function(d) { return `translate(${x(d.Month)}, 0)`; })
        .selectAll('rect')
        .data(function(d) {
            return subgroups.map(function(key) {
                return {key: key, value: d[key]};
            });
        })
        .enter().append('rect')
            .attr('x', d => xSubgroup(d.key))
            .attr('y', d => y(d.value))
            .attr('width', xSubgroup.bandwidth())
            .attr('height', d => innerHeight - y(d.value))
            .attr('fill', d => colorScale(d.key));

    var lineLegend = svg.selectAll('.lineLegend').data(subgroups)
        .enter().append('g')
        .attr('class','lineLegend')
        .attr('transform', function (d,i) {
                return 'translate(' + (innerWidth - margin.right) + ',' + ((i+2)*20)+')';
            });

    lineLegend.append('text').text(function (d) {return d;})
        .attr('transform', 'translate(15,9)');

    lineLegend.append('rect')
        .style('fill', function (d, i) {return colorScale(d); })
        .attr('width', 10).attr('height', 10);

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