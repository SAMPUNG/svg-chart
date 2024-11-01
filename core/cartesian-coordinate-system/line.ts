import type { DataSet } from '~/types/data'

export function createLine(points: DataSet) {
  const polyline = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polyline'
  )
  polyline.classList.add('jsc-series', 'jsc-line')
  polyline.setAttribute('points', points.join(' '))
  return polyline
}
