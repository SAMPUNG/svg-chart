import { OnHideTooltip, OnShowTooltip } from '~/types/data'

export function registerTooltip(
  svg: SVGElement,
  tooltip: HTMLElement,
  onshow: OnShowTooltip,
  onhide: OnHideTooltip
) {
  const series = svg.getElementsByClassName('jsc-interactive')
  for (let i = 0; i < series.length; i++) {
    const target = series[i]
    target.addEventListener('mouseleave', () => {
      onhide(tooltip)
    })

    target.addEventListener('mouseenter', () => {
      const rect = target.getBoundingClientRect()
      const key = target.getAttribute('data-key') ?? ''
      const val = Number(target.getAttribute('data-value'))
      onshow(rect, key, val)
    })
  }
}

export function createTooltip() {
  const tooltip = document.createElement('div')
  tooltip.classList.add('jsc-tooltip')
  tooltip.style.visibility = 'hidden'
  document.body.appendChild(tooltip)
  return tooltip
}
