interface EventDetail {
  label: string
  tooltip: HTMLElement | null
  value: number
}

export class SVGChart extends HTMLElement {
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

  get height() {
    return Number(this.getAttribute('height'))
  }
  set height(val: number) {
    this.setAttribute('height', val.toString())
    this.resize()
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

  get radius(): number {
    return Number(this.getAttribute('r')) || 64
  }
  set radius(val: number) {
    this.setAttribute('r', val.toString())
    this.svg.setAttribute('viewBox', `0 0 ${val * 2} ${val * 2}`)
  }

  render() {
    this.svg.replaceChildren()
    this.resize()

    this.values.forEach(
      (value, index) => {
        const fan = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        fan.classList.add('jsc-dyeable', 'jsc-fan')
        this.svg.appendChild(fan)

        const label = this.labels[index]
        const detail: EventDetail = {
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

          const rect = fan.getBoundingClientRect()
          elm.hidden = false
          elm.style.left = `${rect.x + rect.width / 2}px`
          elm.style.top = `${rect.y + rect.height / 2}px`
        })
      }
    )
  }

  resize() {
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
  }

  readonly svg: SVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )

  static get TAG_NAME() {
    return 'SVG_CHART'
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

  get width() {
    return Number(this.getAttribute('width'))
  }
  set width(val: number) {
    this.setAttribute('width', val.toString())
    this.resize()
  }
}
