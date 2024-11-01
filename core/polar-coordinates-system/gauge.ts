import type { Coordinates, DataMap } from '~/types/data'
import { calculateArcEndPoint, rotateCoordinates } from './calculate'

function renderArcs(cx: number, cy: number, r: number, data: DataMap) {
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)
  const paths: SVGPathElement[] = []
  const points: Coordinates[] = []

  Object.entries(data).reduce((acc, [key, val], index) => {
    if (index === 0) {
      points.push({ x: cx - r, y: cy })
    }

    const percentage = val / total / 2
    acc += percentage

    const start = points[index]
    const prevEnd = calculateArcEndPoint(cx, cy, r, acc)
    const end = rotateCoordinates(prevEnd.x, prevEnd.y, cx, cy, -90) 
    points.push(end)

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.classList.add('jsc-series', 'jsc-arc', 'jsc-gauge-arc')
    path.setAttribute(
      'd',
      `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`
    )
    path.setAttribute('data-key', key)
    path.setAttribute('data-value', val.toString())
    paths.push(path)

    return acc
  }, 0)

  return paths
}

export function renderGauge(svg: SVGElement, data: DataMap, r: number) {
  const cx = svg.viewBox.baseVal.width / 2
  const cy = svg.viewBox.baseVal.height
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.classList.add('jsc-gauge')
  g.append(...renderArcs(cx, cy, r, data))

  svg.appendChild(g)
}

