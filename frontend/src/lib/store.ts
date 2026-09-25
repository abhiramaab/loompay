import type { Payment } from '@/api/types'

/**
 * Session-local cache of payments created through this console.
 *
 * LoomPay's backend currently exposes only POST /payments and
 * GET /payments/{orderId}, so list/metric endpoints cannot be read yet.
 * This store keeps the console useful in the meantime and is the single
 * place to swap in a real GET /payments call once it lands.
 */
const KEY = 'loompay.session.payments'
const EVENT = 'loompay:payments-changed'

export function loadPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Payment[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function savePayment(payment: Payment): Payment[] {
  const current = loadPayments().filter((p) => p.orderId !== payment.orderId)
  const next = [payment, ...current].slice(0, 100)
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(EVENT))
  return next
}

export function upsertPayment(payment: Payment): Payment[] {
  return savePayment(payment)
}

export function clearPayments(): void {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function subscribePayments(listener: () => void): () => void {
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}
