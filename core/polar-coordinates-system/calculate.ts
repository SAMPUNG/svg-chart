import type { Coordinates } from '~/types/data'

export function calculateArcEndPoint(
  cx: number,
  cy: number,
  r: number,
  percentage: number
): Coordinates {
  const radians = Math.PI * 2 * percentage
  return {
    x: cx + r * Math.sin(radians),
    y: cy - r * Math.cos(radians),
  }
}

export function rotateCoordinates(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
): Coordinates {
  const radians = (angle * Math.PI) / 180
  return {
    x: cx + (x - cx) * Math.cos(radians) - (y - cy) * Math.sin(radians),
    y: cy + (x - cx) * Math.sin(radians) + (y - cy) * Math.cos(radians),
  }
}
