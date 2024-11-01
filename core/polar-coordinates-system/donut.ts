import type { Coordinates, DataMap } from '~/types/data'
import { calculateArcEndPoint } from './calculate'

function renderArcs(cx: number, cy: number, r: number, data: DataMap) {
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)
  const paths: SVGPathElement[] = []
  const starts: Coordinates[] = []

  Object.entries(data).reduce((acc, [key, val], index) => {
    if (index === 0) {
      starts.push({ x: cx, y: cy - r })
    }

    const percentage = val / total
    const largeArcFlag = percentage > 0.5 ? 1 : 0
    acc += percentage

    const start = starts[index]
    const end = calculateArcEndPoint(cx, cy, r, acc)
    starts.push(end)

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.classList.add('jsc-series', 'jsc-arc', 'jsc-donut-arc')
    path.setAttribute(
      'd',
      `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    )
    path.setAttribute('data-key', key)
    path.setAttribute('data-value', val.toString())
    paths.push(path)

    const far = calculateArcEndPoint(0, 0, 1, acc - percentage * 0.5)
    path.style.transform = `translate(${far.x}px, ${far.y}px)`

    return acc
  }, 0)

  return paths
}

export function renderDonut(svg: SVGElement, data: DataMap, r: number) {
  const cx = svg.viewBox.baseVal.width / 2
  const cy = svg.viewBox.baseVal.height / 2
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.classList.add('jsc-donut')
  g.append(...renderArcs(cx, cy, r, data))
  svg.appendChild(g)
}

