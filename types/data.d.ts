export interface Coordinates {
  x: number
  y: number
}

export type DataMap = Record<string, number>

export type DataSet = number[][]

export type MarkerType = 'circle' | 'square' | 'triangle'

export type OnHideTooltip = (tooltip: HTMLElement) => void
export type OnShowTooltip = (rect: DOMRect, key: string, value: number) => void
