import { describe, expect, test } from 'vitest'
import { getPolygonCentroid } from '~/core/calculate'
import type { Coordinates } from '~/types/data'

describe('getPolygonCentroid', () => {
  test('should return { x: 0, y: 0 } when points array is empty', () => {
    const points: Coordinates[] = []
    const centroid = getPolygonCentroid(points)
    expect(centroid).toEqual({ x: 0, y: 0 })
  })

  test('should calculate centroid correctly for a simple polygon', () => {
    const points: Coordinates[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    const centroid = getPolygonCentroid(points)
    expect(centroid.x).toBeCloseTo(0.5, 5)
    expect(centroid.y).toBeCloseTo(0.5, 5)
  })
})
