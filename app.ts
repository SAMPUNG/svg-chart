import { renderGauge } from './core/polar-coordinates-system/gauge'
import { createSVG } from './core/render'
import { renderDonut } from './core/polar-coordinates-system/donut'
import { renderPie } from './core/polar-coordinates-system/pie'
import { createAxis } from './core/cartesian-coordinate-system/axis'
import { createLine } from './core/cartesian-coordinate-system/line'
import { createMarker } from './core/cartesian-coordinate-system/marker'
import { createSpots } from './core/cartesian-coordinate-system/spots'

const app = document.getElementById('app')!
const datamap = {
  A: 63.5,
  B: 32.5,
  C: 14,
}
const dataset1 = [[32,32], [64,16], [96,48], [128,112], [160,64], [192,96], [224,80]]
const dataset2 = [[32,64], [64,32], [96,16], [128,96], [160,80], [192,48], [224,112]]
const dataset3 = [[32,112], [64,64], [96,80], [128,16], [160,48], [192,32], [224,96]]

const line = createSVG('line', 256, 128)
app.appendChild(line)
line.append(
  createMarker('circle', 4, 'circle'),
  createLine(dataset1, 'circle'),
  ...createAxis(0, 0, 256, 128, 32, 16)
)

const spots = createSVG('spots', 256, 128)
app.appendChild(spots)
spots.append(
  createSpots(dataset1, 'circle'),
  createSpots(dataset2, 'square'),
  createSpots(dataset3, 'triangle'),
  ...createAxis(0, 0, 256, 128, 32, 16)
)

const pie = createSVG('pie', 256, 128)
app.appendChild(pie)
renderPie(pie, datamap, 60)

const donut = createSVG('donut', 256, 128)
app.appendChild(donut)
renderDonut(donut, datamap, 52)

const gauge = createSVG('gauge', 256, 128)
app.appendChild(gauge)
renderGauge(gauge, datamap, 100)
