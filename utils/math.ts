import { Coordinates } from '~/types/data'

/**
 * Get the centroid of an array of points (polygon)
 * @param points Array of points
 * @returns coordinates of the centroid
 */
export function getCentroid(points: Coordinates[]) {
  if (points.length === 0) {
    return { x: 0, y: 0 }
  }

  let xSum = 0
  let ySum = 0
  let area = 0

  for (let i = 0; i < points.length; i++) {
    const currentPoint = points[i]
    const nextPoint = points[(i + 1) % points.length]

    const partialArea =
      currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y
    area += partialArea

    xSum += (currentPoint.x + nextPoint.x) * partialArea
    ySum += (currentPoint.y + nextPoint.y) * partialArea
  }

  area *= 0.5

  const centroidX = xSum / (6 * area)
  const centroidY = ySum / (6 * area)

  return { x: centroidX, y: centroidY }
}

/**
 * Normalizes an array of numbers to a percentage (0 to 1)
 * @param values Array of numbers
 * @returns
 */
export function normalize(values: number[]): number[] {
  const total = values.reduce((acc, val) => acc + val, 0)
  return values.map((val) => val / total)
}

/**
 * Rotates a point around a center point by a given percentage
 * @param x X coordinate of the point to rotate
 * @param y Y coordinate of the point to rotate
 * @param cx X coordinate of the center point
 * @param cy Y coordinate of the center point
 * @param percentage Percentage of rotation (0 to 1)
 * @returns The rotated point
 */
export function rotate(
  x: number,
  y: number,
  cx: number,
  cy: number,
  percentage: number
): Coordinates {
  const radians = Math.PI * 2 * percentage
  return {
    x: cx + (x - cx) * Math.cos(radians) - (y - cy) * Math.sin(radians),
    y: cy + (x - cx) * Math.sin(radians) + (y - cy) * Math.cos(radians),
  }
}
