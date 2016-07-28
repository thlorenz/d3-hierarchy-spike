'use strict'

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, true, depth || 5, false))
}

const xhr = require('xhr')
const initFlamegraph = require('./flamegraph')
const initSunburst = require('./sunburst')
const initTree = require('./tree')
const initTreemap = require('./treemap')

const flamegraphEl = document.getElementById('flamegraph')
const sunburstEl = document.getElementById('sunburst')
const treeEl = document.getElementById('tree')
const treemapEl = document.getElementById('treemap')

const graph = './flat.json'

function refresh() {
  xhr({ uri: graph, json: true }, ongraph)
  function ongraph(err, res, graph) {
    if (err) return console.error(err)
    sunburstEl.innerHTML = ''
    flamegraphEl.innerHTML = ''
    treeEl.innerHTML = ''
    treemapEl.innerHTML = ''

    initFlamegraph({ graph, clazz: '.flamegraph' })
    initSunburst({ graph, clazz: '.sunburst' })
    initTree({ graph, clazz: '.tree' })
    initTreemap({ graph, clazz: '.treemap' })
    console.log('refreshed')
  }
}

document.getElementById('refresh')
  .addEventListener('click', refresh)
refresh()
