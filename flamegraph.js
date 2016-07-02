'use strict'

const d3 = window.d3

module.exports = function initFlamegraph(graph, inspect) {
  const width = 1400
  const height = 800

  const svg = d3.select('.flamegraph').append('svg')
    .attr('width', width)
    .attr('height', height)

  function sumAllocs(d) {
    function add(acc, alloc) {
      return acc + (alloc.count * alloc.size)
    }
    return d.allocations.reduce(add, 0)
  }

  function getChildren(d) {
    return d.children
  }

  function getSize(d) {
    // hardcoded 100000 here .. in the realworld we'd have to determine that value
    return Math.max(sumAllocs(d) / 100000, 2.5)
  }

  const partition = d3.layout.partition()
    .size([ width, height ])
    .children(getChildren)
    .value(getSize)

  const color = d3.scale.category20()
  const nodes = partition.nodes(graph)

  svg.selectAll('.node')
      .data(nodes)
    .enter().append('rect')
      .attr('class', 'node')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.dx)
      .attr('height', d => d.dy)
      .style('fill', d => color((d.children ? d : d.parent).name))

    svg.selectAll('.label')
      .data(nodes.filter(d => d.dx > 6))
    .enter().append('text')
      .attr('class', 'label')
      .attr('dy', '.35em')
      .attr('transform', d => 'translate(' + (d.x + d.dx / 2) + ',' + (d.y + d.dy / 2) + ')')
      .text(d => d.name)
}
