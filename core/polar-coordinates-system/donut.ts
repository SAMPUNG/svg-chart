import type { Coordinates, DataMap } from '~/types/data'
import { calculateArcEndPoint } from './calculate'

export function renderDonut(svg: SVGElement, data: DataMap, r: number) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.classList.add('jsc-donut')
  svg.appendChild(g)

  const cx = svg.viewBox.baseVal.width / 2
  const cy = svg.viewBox.baseVal.height / 2
  const points: Coordinates[] = [{ x: cx, y: cy - r }]
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)

  Object.entries(data).reduce((acc, [key, val], index) => {
    const percentage = val / total
    acc += percentage

    const start = points[index]
    const end = calculateArcEndPoint(cx, cy, r, acc)
    points.push(end)

    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    arc.classList.add('jsc-dyeable', 'jsc-interactive', 'jsc-arc', 'jsc-donut-arc')
    arc.setAttribute('data-key', key)
    arc.setAttribute('data-value', val.toString())
    g.appendChild(arc)

    let d = `M${start.x} ${start.y}`
    const largeArcFlag = percentage > 0.5 ? 1 : 0
    d += `A${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    arc.setAttribute('d', d)

    return acc
  }, 0)
}

