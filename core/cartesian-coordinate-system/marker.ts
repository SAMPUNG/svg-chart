import type { MarkerType } from '~/types/data'

export function createMarker(id: string, size: number, type: MarkerType) {
  const marker = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'marker'
  )
  marker.classList.add('jsc-marker')
  marker.id = id
  const sizeStr = size.toString()
  marker.setAttribute('markerWidth', sizeStr)
  marker.setAttribute('markerHeight', sizeStr)
  const center = (size / 2).toString()
  marker.setAttribute('refX', center)
  marker.setAttribute('refY', center)
  marker.setAttribute('viewBox', `0 0 ${size} ${size}`)

  switch (type) {
    case 'circle': {
      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      )
      circle.classList.add('jsc-marker-circle')
      circle.setAttribute('cx', center)
      circle.setAttribute('cy', center)
      circle.setAttribute('r', center)
      marker.appendChild(circle)
      break
    }
    case 'triangle': {
      const triangle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      )
      triangle.classList.add('jsc-marker-triangle')
      triangle.setAttribute('d', `M 0,0 L ${size},${size / 2} L 0,${size} z`)
      marker.appendChild(triangle)
      break
    }
    case 'square': {
      const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      square.classList.add('jsc-marker-square')
      square.setAttribute('x', '0')
      square.setAttribute('y', '0')
      square.setAttribute('width', sizeStr)
      square.setAttribute('height', sizeStr)
      marker.appendChild(square)
      break
    }
  }

  const defs = document.createElementNS('http://www.w3.org/2000/svg','defs')
  defs.appendChild(marker)
  return defs
}
