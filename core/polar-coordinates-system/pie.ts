import type { Coordinates, DataMap } from '~/types/data'
import { calculateArcEndPoint } from './calculate'
// import { getPolygonCentroid } from '../calculate'

export function renderPie(svg: SVGElement, data: DataMap, r: number) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.classList.add('jsc-pie')
  svg.appendChild(g)

  const cx = svg.viewBox.baseVal.width / 2
  const cy = svg.viewBox.baseVal.height / 2
  // const center = { x: cx, y: cy }
  const starts: Coordinates[] = []
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)

  // Render Fans
  Object.entries(data).reduce((acc, [key, val], index) => {
    if (index === 0) {
      starts.push({ x: cx, y: cy - r })
    }

    const percentage = val / total
    acc += percentage

    const start = starts[index]
    const end = calculateArcEndPoint(cx, cy, r, acc)
    starts.push(end)

    const fan = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    fan.classList.add('jsc-series', 'jsc-fan')
    g.appendChild(fan)
  
    let d = `M ${cx} ${cy}`
    d += `L ${start.x} ${start.y}`
    const largeArcFlag = percentage > 0.5 ? 1 : 0
    d += `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    d += `Z`
    fan.setAttribute('d', d)

    // const far = calculateArcEndPoint(0, 0, 1, acc - percentage * 0.5)
    // fan.style.transform = `translate(${far.x}px, ${far.y}px)`

    // const tooltip = document.createElementNS(
    //   'http://www.w3.org/2000/svg',
    //   'g'
    // )
    // tooltip.classList.add('jsc-tooltip')
    // svg.appendChild(tooltip)

    // const mask = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    // mask.classList.add('jsc-tooltip-mask')
    // const middle = calculateArcEndPoint(cx, cy, r * 2, acc - percentage * 0.5)
    // const centroid = getPolygonCentroid([start, center, end, middle])
    // mask.setAttribute('x', (centroid.x - 4).toString())
    // mask.setAttribute('y', (centroid.y - 8).toString())
    // mask.setAttribute('width', '45')
    // mask.setAttribute('height', '10')
    // tooltip.appendChild(mask)

    // const text = document.createElementNS(
    //   'http://www.w3.org/2000/svg',
    //   'text'
    // )
    // text.classList.add('jsc-tooltip-text')
    // text.textContent = `${key}(${val}%)`
    // text.setAttribute('x', centroid.x.toString())
    // text.setAttribute('y', centroid.y.toString())
    // tooltip.appendChild(text)

    fan.addEventListener('mouseenter', () => {
      // tooltip.style.visibility = 'visible'
      const tip = document.createElement('div')
      tip.classList.add('jsc-tip')
      const rect = fan.getBoundingClientRect()
      console.dir(fan)
      tip.style.left = `${rect.x + rect.width / 2}px`
      tip.style.top = `${rect.y + rect.height / 2}px`

      tip.textContent = `${key}(${val}%)`
      document.body.appendChild(tip)
    })
    fan.addEventListener('mouseleave', () => {
      // tooltip.style.visibility = 'hidden'
      const tip = document.querySelector('.jsc-tip')
      tip?.remove()
    })

    return acc
  }, 0)
}
