import type { Coordinates, DataMap } from '~/types/data'
import { calculateArcEndPoint, rotateCoordinates } from './calculate'

export function renderGauge(svg: SVGElement, data: DataMap, r: number) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.classList.add('jsc-gauge')
  svg.appendChild(g)

  const cx = svg.viewBox.baseVal.width / 2
  const cy = svg.viewBox.baseVal.height
  const points: Coordinates[] = [{ x: cx - r, y: cy }]
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)

  Object.entries(data).reduce((acc, [key, val], index) => {
    const percentage = val / total / 2
    acc += percentage

    const start = points[index]
    const prevEnd = calculateArcEndPoint(cx, cy, r, acc)
    const end = rotateCoordinates(prevEnd.x, prevEnd.y, cx, cy, -0.25) 
    points.push(end)

    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    arc.classList.add('jsc-dyeable', 'jsc-interactive', 'jsc-arc', 'jsc-gauge-arc')
    arc.setAttribute('data-key', key)
    arc.setAttribute('data-value', val.toString())
    g.appendChild(arc)

    let d = `M${start.x} ${start.y}`
    d += `A${r} ${r} 0 0 1 ${end.x} ${end.y}`
    arc.setAttribute('d', d)

    return acc
  }, 0)
}

