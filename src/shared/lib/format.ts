export function formatPrice(value: number): { integer: string; fraction: string } {
  const formatted = value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const sepIndex = formatted.lastIndexOf(',')
  return {
    integer: formatted.slice(0, sepIndex),
    fraction: formatted.slice(sepIndex),
  }
}
