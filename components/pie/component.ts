import { rotateCoordinates } from '~/core/polar-coordinates-system/calculate'
import type { EventDetail } from './types'

export class SVGPie extends HTMLElement {
  attributeChangedCallback(name: string, before?: string, after?: string) {
    switch (name) {
      case 'values': {
        this.render()
        break
      }
      default: {
        console.warn('[@jugar/svg-chart/pie] attribute change => ', name, before, after)
      }
    }
  }

  constructor() {
    super()
  }

  connectedCallback() {
    const r = this.radius
    this.svg.classList.add('jsc-chart', 'jsc-pie')
    this.svg.setAttribute('viewBox', `0 0 ${r * 2} ${r * 2}`)
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this.appendChild(this.svg)
    this.render()
  }

  dispatch(name: string, detail: EventDetail) {
    const event = new CustomEvent(name, { detail })
    this.dispatchEvent(event)
  }

  get labels(): string[] {
    const attr = this.getAttribute('values')
    if (attr === null) {
      return []
    }
    return attr.split(',')
  }
  set labels(vals: string[]) {
    this.setAttribute('values', vals.join(','))
  }

  static observedAttributes = ['values']

  get percentages(): number[] {
    return this.values.map((v) => v / this.total)
  }

  get radius(): number {
    return Number(this.getAttribute('r')) || 64
  }
  set radius(val: number) {
    this.setAttribute('r', val.toString())
    this.svg.setAttribute('viewBox', `0 0 ${val * 2} ${val * 2}`)
  }

  public render() {
    const r = this.radius
    this.svg.replaceChildren()
    this.svg.setAttribute('viewBox', `0 0 ${r * 2} ${r * 2}`)
    const rectSVG = this.svg.getBoundingClientRect()

    this.percentages.reduce(
      (start, percentage, index) => {
        const fan = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        fan.classList.add('jsc-dyeable', 'jsc-fan')
        this.svg.appendChild(fan)

        let d = `M${start.x} ${start.y}`
        const largeArcFlag = percentage > 0.5 ? 1 : 0
        const end = rotateCoordinates(start.x, start.y, r, r, percentage)
        d += `A${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
        d += `L${r} ${r}Z`
        fan.setAttribute('d', d)

        const rectFAN = fan.getBoundingClientRect()
        const left = rectFAN.x - rectSVG.x + rectFAN.width / 1.8
        const top = rectFAN.y - rectSVG.y + rectFAN.height / 1.8

        const label = this.labels[index]
        const value = this.values[index]
        const detail: EventDetail = {
          percentage,
          label,
          tooltip: this.tooltip,
          value,
        }

        fan.addEventListener('click', () => {
          this.dispatch('pick', detail)
        })

        fan.addEventListener('mouseleave', () => {
          this.dispatch('popaway', detail)

          const elm = this.tooltip
          if (elm === null) {
            return
          }
          elm.hidden = true
        })

        fan.addEventListener('mouseenter', () => {
          this.dispatch('popover', detail)

          const elm = this.tooltip
          if (elm === null) {
            return
          }

          elm.hidden = false
          elm.style.left = `${left}px`
          elm.style.top = `${top}px`
        })

        return end
      },
      { x: r, y: 0 }
    )
  }

  readonly svg: SVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )

  static get TAG_NAME() {
    return 'SVG_PIE'
  }

  get tooltip(): HTMLElement | null {
    for (let i = 0; i < this.children.length; i++) {
      const elm = this.children[i]
      if (elm.getAttribute('role') === 'tooltip') {
        return elm as HTMLElement
      }
    }
    return null
  }

  get total(): number {
    return this.values.reduce((acc, val) => acc + val, 0)
  }

  get values(): number[] {
    const attr = this.getAttribute('values')
    if (attr === null) {
      return []
    }
    return attr.split(',').map((v) => Number(v))
  }
  set values(vals: number[]) {
    this.setAttribute('values', vals.join(','))
    this.render()
  }
}
