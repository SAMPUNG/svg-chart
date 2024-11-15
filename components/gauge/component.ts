import { rotateCoordinates } from '~/core/polar-coordinates-system/calculate'

interface EventDetail {
  percentage: number
  label: string
  value: number
}

export class SVGGauge extends HTMLElement {
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
    this.svg.classList.add('jsc-chart', 'jsc-gauge')
    this.svg.setAttribute('viewBox', `0 0 ${r * 2} ${r * 2}`)
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this.replaceChildren(this.svg)
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

  get popWith(): HTMLElement | null {
    const id = this.getAttribute('pop-with')
    if (id === null) {
      return null
    }
    return document.getElementById(id)
  }
  set popWith(id: string) {
    const elm = document.getElementById(id)
    if (elm === null) {
      console.warn('[@jugar/svg-chart/pie] invalid pop-with id => ', id)
      return
    }
    elm.hidden = true
    elm.classList.add('jsc-pop')
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

    this.percentages.reduce(
      (start, percentage, index) => {
        const fan = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        fan.classList.add('jsc-dyeable', 'jsc-arc')
        this.svg.appendChild(fan)

        let d = `M${start.x} ${start.y}`
        const end = rotateCoordinates(start.x, start.y, r, r, percentage - 0.25)
        d += `A${r} ${r} 0 0 1 ${end.x} ${end.y}`
        fan.setAttribute('d', d)

        const label = this.labels[index]
        const value = this.values[index]
        const detail: EventDetail = {
          percentage,
          label,
          value,
        }

        fan.addEventListener('click', () => {
          this.dispatch('pick', detail)
        })

        fan.addEventListener('mouseleave', () => {
          this.dispatch('popaway', detail)

          const elm = this.popWith
          if (elm === null) {
            return
          }
          elm.hidden = true
        })

        fan.addEventListener('mouseenter', () => {
          this.dispatch('popover', detail)

          const elm = this.popWith
          if (elm === null) {
            return
          }

          const rect = fan.getBoundingClientRect()
          elm.hidden = false
          elm.style.left = `${rect.x + rect.width / 2}px`
          elm.style.top = `${rect.y + rect.height / 2}px`
        })

        return end
      },
      { x: r, y: r }
    )
  }

  readonly svg: SVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )

  static get TAG_NAME() {
    return 'SVG_GAUGE'
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
