import { Coordinates } from '~/types/data'

export function getPolygonCentroid(points: Coordinates[]) {
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
