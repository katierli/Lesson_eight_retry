export const CHART_COLORS = {
  revenue: '#7C9CFF',
  visitors: '#4ECDC4',
  conversion: '#FFB454',
  highlight: '#FF8A65',
}

export function withOpacity(hex: string, opacity: number) {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${alpha}`
}
