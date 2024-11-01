import { EventMode } from '~/types/data'

export function registerTooltip(elm: SVGElement, mode: EventMode) {
  const startup = mode === 'hard' ? 'click' : 'mouseover'
  const shutdown = mode === 'hard' ? 'blur' : 'mouseleave'

  const targets = elm.getElementsByClassName('jsc-target')

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i] as SVGElement
    target.addEventListener(startup, (evt: Event) => {
      const target = evt.target as SVGElement
      target.addEventListener(startup, createTooltip)
      target.addEventListener(shutdown, clearTooltips)
    })
  }
}

function clearTooltips() {
  const tooltips = document.getElementsByClassName('jsc-tooltips')
  for (let i = 0; i < tooltips.length; i++) {
    const tooltip = tooltips[i] as HTMLDivElement
    tooltip.remove()
  }
}

function createTooltip(evt: MouseEvent) {
  const target = evt.target as SVGElement
  const tooltip = document.createElement('div')
  tooltip.classList.add('jsc-tooltip')
  tooltip.style.left = `${evt.clientX}px`
  tooltip.style.top = `${evt.clientY}px`
  tooltip.style.position = 'absolute'

  const spanKey = document.createElement('span')
  spanKey.classList.add('jsc-tooltip-key')
  spanKey.innerText = target.dataset.key || ''

  const spanValue = document.createElement('span')
  spanValue.classList.add('jsc-tooltip-value')
  spanValue.innerText = target.dataset.value || ''
  tooltip.append(spanKey, spanValue)

  document.body.appendChild(tooltip)
}
