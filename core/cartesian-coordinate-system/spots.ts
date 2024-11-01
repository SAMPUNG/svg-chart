import type { DataSet, MarkerType } from '~/types/data'

export function createSpots(points: DataSet, type: MarkerType) {
  const spots = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  spots.classList.add('jsc-series', 'jsc-spots')

  let handler: (x: number, y: number) => SVGElement = createCircle
  switch (type) {
    case 'circle': {
      handler = createCircle
      break
    }
    case 'square': {
      spots.setAttribute('transform','translate(-2, -2)')
      handler = createSquare
      break
    }
    case 'triangle': {
      spots.setAttribute('transform','translate(-2, -2)')
      handler = createTriangle
      break
    }
  }
  for (let i = 0; i < points.length; i++) {
    const item = handler(points[i][0], points[i][1])
    item.addEventListener('mouseenter', () => {
      // tooltip.style.visibility = 'visible'
      const tip = document.createElement('div')
      tip.classList.add('jsc-tip')
      tip.style.position = 'absolute'
      const rect = item.getBoundingClientRect()
      tip.style.left = `${rect.x + 16}px`
      tip.style.top = `${rect.y - 8}px`
      tip.style.pointerEvents = 'none'

      tip.textContent = `(${points[i].join()})`
      document.body.appendChild(tip)
    })
    item.addEventListener('mouseleave', () => {
      // tooltip.style.visibility = 'hidden'
      const tip = document.querySelector('.jsc-tip')
      tip?.remove()
    })
    spots.appendChild(item)
  }

  return spots
}

function createCircle(x: number, y: number) {
  const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  )
  circle.classList.add('jsc-item', 'jsc-spot-circle')
  circle.setAttribute('r', '2')
  circle.setAttribute('cx', x.toString())
  circle.setAttribute('cy', y.toString())
  return circle
}

function createSquare(x: number, y: number) {
  const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  square.classList.add('jsc-item', 'jsc-spot-square')
  square.setAttribute('x', x.toString())
  square.setAttribute('y', y.toString())
  square.setAttribute('width', '4')
  square.setAttribute('height', '4')
  return square
}

function createTriangle(x: number, y: number) {
  const triangle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  )
  triangle.classList.add('jsc-item', 'jsc-spot-triangle')
  triangle.setAttribute(
    'd',
    `M${x},${y} l4 0 l-2 4z`
  )
  return triangle
}
