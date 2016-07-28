'use strict'

const d3 = window.d3

module.exports = function initFlamegraph(graph, inspect) {
  const labelMargin = 40
  const width = 1400
  const height = 800

  const svg = d3.select('.flamegraph').append('svg')
    .attr('width', width)
    .attr('height', height + labelMargin)

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

  const g = svg.selectAll('.node')
      .data(nodes)
      .enter()
        .append('g')

  g.append('rect')
    .attr('class', 'node')
    .attr('x', d => d.x)
    .attr('y', d => height - d.y - d.dy)
    .attr('width', d => d.dx)
    .attr('height', d => d.dy)
    .style('fill', d => color((d.children ? d : d.parent).name))
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

  // labels
  g.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('id', 'tip-flamegraph')
    .attr('x', 0)
    .attr('y', height + labelMargin / 2)
    .attr('font-size', '14px')
    .style('opacity', 0)
    .style('white-space', 'pre')

  function getLabel(d) {
    return `[${sumAllocs(d)}] (${d.name}) ${d.script_name}`
  }

  function mouseover(d) {
    d3.select(this)
      .transition()
      .duration(1000)
      .ease('elastic')
      .style('opacity', 0.3)
      .style('cursor', 'pointer')

    d3.select('#tip-flamegraph')
      .text(getLabel(d))
      .style('opacity', 0.9)
  }

  function mouseout(d) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('opacity', 1)

    d3.select('#tip-flamegraph').style('opacity', 0)
  }
}
