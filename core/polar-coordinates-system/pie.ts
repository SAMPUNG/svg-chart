import type { Coordinates, DataMap } from '~/types/data'
import { calculateArcEndPoint } from './calculate'

export function renderPie(svg: SVGElement, data: DataMap, r: number) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.classList.add('jsc-pie')
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

    const fan = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    fan.classList.add('jsc-dyeable', 'jsc-interactive', 'jsc-fan')
    fan.setAttribute('data-key', key)
    fan.setAttribute('data-value', val.toString())
    g.appendChild(fan)

    let d = `M${start.x} ${start.y}`
    const largeArcFlag = percentage > 0.5 ? 1 : 0
    d += `A${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    d += `L${cx} ${cy}Z`
    fan.setAttribute('d', d)

    return acc
  }, 0)
}
