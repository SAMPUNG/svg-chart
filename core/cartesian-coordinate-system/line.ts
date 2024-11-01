import type { DataSet } from '~/types/data'

export function createLine(points: DataSet, marker?: string) {
  const polyline = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polyline'
  )
  polyline.classList.add('jsc-series', 'jsc-line')
  if (marker) {
    const makrerLink = `url(#${marker})`
    polyline.setAttribute('marker-end', makrerLink)
    polyline.setAttribute('marker-mid', makrerLink)
    polyline.setAttribute('marker-start', makrerLink)
  }
  polyline.setAttribute('points', points.join(' '))
  return polyline
}
