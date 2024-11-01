export function createAxis(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stepX: number,
  stepY: number
) {
  const axises = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  axises.classList.add('jsc-axis')
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  xAxis.setAttribute('x1', x1.toString())
  xAxis.setAttribute('y1', y2.toString())
  xAxis.setAttribute('x2', x2.toString())
  xAxis.setAttribute('y2', y2.toString())
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  yAxis.setAttribute('x1', x1.toString())
  yAxis.setAttribute('y1', y1.toString())
  yAxis.setAttribute('x2', x1.toString())
  yAxis.setAttribute('y2', y2.toString())
  axises.append(xAxis, yAxis)

  const splits = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  splits.classList.add('jsc-split')
  for (let i = x2; i > x1; i -= stepX) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', i.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', i.toString())
    line.setAttribute('y2', y2.toString())
    splits.appendChild(line)
  }
  for (let i = y2; i > y1; i -= stepY) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', i.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', i.toString())
    splits.appendChild(line)
  }
  return [ axises, splits ]
}
