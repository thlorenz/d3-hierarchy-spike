'use strict'

const d3 = window.d3

module.exports = function initTreemap(graph, inspect) {
  const labelMargin = 40
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

  function sumAllocs(d) {
    function add(acc, alloc) {
      return acc + (alloc.count * alloc.size)
    }
    return d.allocations.reduce(add, 0)
  }

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

  const color = d3.scale.category20()

  const svg = d3.select('.treemap').append('svg')
      .attr('width', width)
      .attr('height', height + labelMargin)
  const g = svg.selectAll('.node')
      .data(nodes)
      .enter()
        .append('g')

  g.append('rect')
    .attr('class', 'node')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style('fill', d => color(d.data.script_name))
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

  // labels
  g.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('id', 'tip-treemap')
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

    d3.select('#tip-treemap')
      .text(getLabel(d.data))
      .style('opacity', 0.9)
  }

  function mouseout(d) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('opacity', 1)

    d3.select('#tip-treemap').style('opacity', 0)
  }
}
