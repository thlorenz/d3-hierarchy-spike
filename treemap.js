'use strict'

const d3 = window.d3

module.exports = function initTreemap(graph, inspect) {
  const width = 600
  const height = 800

  function getChildren(d) {
    return d.children
  }

  const root = d3.hierarchy(graph, getChildren)

  var treemap = d3.treemap()
      .size([width, height])
      .round(true)
      .padding(2)

  function sumRoot(d) {
    function add(acc, alloc) {
      return acc + (alloc.count * alloc.size)
    }
    return d.allocations.reduce(add, 0)
  }

  const nodes = treemap(root
      .sum(sumRoot)
      .sort((a, b) => b.height - a.height || b.depth - a.depth)
    )
    .descendants()

  if (typeof window === 'undefined') {
    inspect(nodes)
  } else {
    const color = d3.scale.category20()

    const svg = d3.select('.treemap').append('svg')
        .attr('width', width)
        .attr('height', height)
    svg.selectAll('.node')
        .data(nodes)
      .enter().append('rect')
        .attr('class', 'node')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('label', d => d.data.script_name + ':' + d.data.name)
        .style('fill', d => color(d.data.script_name))

    svg.selectAll('.label')
        .data(nodes)
      .enter().append('text')
        .attr('class', 'label')
        .attr('dy', '.35em')
        .attr('transform', d => 'translate(' + (d.x0) + ',' + (d.y0 + (d.y1 - d.y0) / 2) + ')')
        .text(d => d.data.script_name + ':' + d.data.name)
  }
}
