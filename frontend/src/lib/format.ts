import type { Currency } from '@/api/types'

const CURRENCY_META: Record<Currency, { symbol: string; locale: string; minor: number }> = {
  INR: { symbol: '\u20B9', locale: 'en-IN', minor: 2 },
  USD: { symbol: '$', locale: 'en-US', minor: 2 },
  EUR: { symbol: '\u20AC', locale: 'de-DE', minor: 2 },
}

export function isCurrency(value: string): value is Currency {
  return value === 'INR' || value === 'USD' || value === 'EUR'
}

/** Backend stores amounts in minor units (paise/cents). */
export function minorToMajor(amount: number): number {
  return amount / 100
}

export function formatMinor(amount: number, currency: Currency): string {
  const meta = CURRENCY_META[currency] ?? CURRENCY_META.USD
  return new Intl.NumberFormat(meta.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: meta.minor,
    maximumFractionDigits: meta.minor,
  }).format(minorToMajor(amount))
}

export function formatMinorCompact(amount: number, currency: Currency): string {
  const meta = CURRENCY_META[currency] ?? CURRENCY_META.USD
  return new Intl.NumberFormat(meta.locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(minorToMajor(amount))
}

export function currencySymbol(currency: Currency): string {
  return CURRENCY_META[currency]?.symbol ?? '$'
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '\u2014'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

export function relativeTime(iso?: string): string {
  if (!iso) return '\u2014'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const delta = Date.now() - date.getTime()
  const abs = Math.abs(delta)
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60_000, 'second'],
    [3_600_000, 'minute'],
    [86_400_000, 'hour'],
    [2_592_000_000, 'day'],
  ]
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (abs < 60_000) {
    const seconds = Math.round(delta / 1000)
    return rtf.format(-seconds, 'second')
  }
  for (const [limit, unit] of units) {
    const divisor = unit === 'second' ? 1000 : unit === 'minute' ? 60_000 : unit === 'hour' ? 3_600_000 : 86_400_000
    if (abs < limit) {
      return rtf.format(-Math.round(delta / divisor), unit)
    }
  }
  return rtf.format(-Math.round(delta / 86_400_000), 'day')
}

export function shortId(id: string, size = 8): string {
  if (id.length <= size + 4) return id
  return `${id.slice(0, size)}\u2026${id.slice(-4)}`
}
