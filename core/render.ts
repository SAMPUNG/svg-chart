export function createSVG(id: string, width: number, height: number) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('jsc-chart')
  svg.id = id
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return svg
}
