export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function createIdempotencyKey(prefix = 'idem'): string {
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 20)
  return `${prefix}_${random}`
}

export function createMerchantId(): string {
  return `merchant_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`
}

export function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value)
  }
  return Promise.reject(new Error('Clipboard unavailable'))
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
