import { describe, expect, test } from 'vitest'
import { renderPie } from '~/core/polar-coordinates-system/pie'
import { createSVG } from '~/core/render'

describe('render-pie', () => {
  test('render paths', () => {
    const svg = createSVG('svg-pie', 256, 128)
    const data = {
      A: 63.5,
      B: 32.5,
      C: 14,
    }
    renderPie(svg, data, 64)
    expect(svg.children.length).toBe(1)
    expect(svg.children[0].children.length).toBe(3)
  })
})
