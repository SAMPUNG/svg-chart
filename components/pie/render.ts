import { rotateCoordinates } from '~/core/polar-coordinates-system/calculate'
import { EventDetail } from './types'

export function renderPie(svg: SVGElement, values: number[], r: number, labels: string[]) {
  const total = values.reduce((a, b) => a + b, 0)
  const percentages = values.map((v) => v / total)

  percentages.reduce(
    (start, percentage, index) => {
      const fan = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      fan.classList.add('jsc-dyeable', 'jsc-arc')
      svg.appendChild(fan)

      let d = `M${start.x} ${start.y}`
      const end = rotateCoordinates(start.x, start.y, r, r, percentage - 0.25)
      d += `A${r} ${r} 0 0 1 ${end.x} ${end.y}`
      fan.setAttribute('d', d)

      const root = svg.parentElement as HTMLElement
      function dispatch(name: string, detail: EventDetail) {
        const event = new CustomEvent(name, { detail })
        root.dispatchEvent(event)
      }

      const label = labels[index]
      const value = values[index]
      const detail: EventDetail = {
        percentage,
        label,
        tooltip: root.getElementsByTagName('div')[0],
        value,
      }

      fan.addEventListener('click', () => {
        dispatch('pick', detail)
      })

      fan.addEventListener('mouseleave', () => {
        dispatch('popaway', detail)
        if (detail.tooltip === null) {
          return
        }
        detail.tooltip.hidden = true
      })

      fan.addEventListener('mouseenter', () => {
        dispatch('popover', detail)
        if (detail.tooltip === null) {
          return
        }
        const rect = fan.getBoundingClientRect()
        detail.tooltip.hidden = false
        detail.tooltip.style.left = `${rect.x + rect.width / 2}px`
        detail.tooltip.style.top = `${rect.y + rect.height / 2}px`
      })

      return end
    },
    { x: r, y: r }
  )
}
