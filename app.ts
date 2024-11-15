import { renderGauge } from './core/polar-coordinates-system/gauge'
import { createSVG } from './core/render'
import { renderDonut } from './core/polar-coordinates-system/donut'
import { createAxis } from './core/cartesian-coordinate-system/axis'
import { createLine } from './core/cartesian-coordinate-system/line'
import { createSpots } from './core/cartesian-coordinate-system/spots'
import { createTooltip, registerTooltip } from './core/tooltip'

const app = document.getElementById('app')!
const datamap = {
  A: 63.5,
  B: 32.5,
  C: 14,
}
const dataset1 = [[32,32], [64,16], [96,48], [128,112], [160,64], [192,96], [224,80]]
const dataset2 = [[32,64], [64,32], [96,16], [128,96], [160,80], [192,48], [224,112]]
const dataset3 = [[32,112], [64,64], [96,80], [128,16], [160,48], [192,32], [224,96]]

const tooltip = createTooltip()


const cartesian = createSVG('cartesian', 256, 128)
app.appendChild(cartesian)
cartesian.append(
  createLine(dataset1),
  createLine(dataset2),
  createLine(dataset3),
  createSpots(dataset1, 'circle'),
  createSpots(dataset2, 'square'),
  createSpots(dataset3, 'triangle'),
  ...createAxis(0, 0, 256, 128, 32, 16)
)
registerTooltip(cartesian, tooltip, showCartesianTooltip, hideTooltip)

// const pie = createSVG('pie', 256, 128)
// app.appendChild(pie)
// renderPie(pie, datamap, 60)
// registerTooltip(pie, tooltip, showPolarTooltip, hideTooltip)

const donut = createSVG('donut', 256, 128)
app.appendChild(donut)
renderDonut(donut, datamap, 52)
registerTooltip(donut, tooltip, showPolarTooltip, hideTooltip)

const gauge = createSVG('gauge', 256, 128)
app.appendChild(gauge)
renderGauge(gauge, datamap, 100)
registerTooltip(gauge, tooltip, showPolarTooltip, hideTooltip)

function hideTooltip(tooltip: HTMLElement) {
  tooltip.style.visibility = 'hidden'
}

function showCartesianTooltip(rect: DOMRect, key: string, val: number) {
  tooltip.style.left = `${rect.x + 16}px`
  tooltip.style.top = `${rect.y - 8}px`
  tooltip.textContent = `(${key}, ${val})`
  tooltip.style.visibility = 'visible'
}


function showPolarTooltip(rect: DOMRect, key: string, val: number) {
  tooltip.style.left = `${rect.x + rect.width / 2}px`
  tooltip.style.top = `${rect.y + rect.height / 2}px`
  tooltip.textContent = `${key}(${val}%)`
  tooltip.style.visibility = 'visible'
}

