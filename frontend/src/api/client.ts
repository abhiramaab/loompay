import { ApiError, type ApiErrorBody, type CreatePaymentRequest, type Payment } from './types'

export { ApiError } from './types'

const BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

function merchantHeader(): Record<string, string> {
  const merchantId = localStorage.getItem('loompay.merchantId')
  return merchantId ? { 'X-Merchant-Id': merchantId } : {}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...merchantHeader(),
        ...(init?.headers ?? {}),
      },
    })
  } catch {
    throw new ApiError('Cannot reach the LoomPay API. Is the backend running on :8081?', 0)
  }

  const text = await res.text()
  const data = text ? safeJson(text) : undefined

  if (!res.ok) {
    const body = (data ?? {}) as ApiErrorBody
    const retryAfter = res.headers.get('Retry-After')
    throw new ApiError(
      body.message ?? body.error ?? `Request failed with status ${res.status}`,
      res.status,
      retryAfter ? Number(retryAfter) : undefined,
      body,
    )
  }

  return data as T
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  createPayment(body: CreatePaymentRequest) {
    return request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  getPayment(orderId: string) {
    return request<Payment>(`/payments/${encodeURIComponent(orderId)}`)
  },
}

export interface ProbeResult {
  online: boolean
  latencyMs: number
  error?: string
}

export async function probeBackend(): Promise<ProbeResult> {
  const started = performance.now()
  try {
    const res = await fetch(`${BASE}/payments/__healthcheck__`, {
      headers: merchantHeader(),
    })
    const latencyMs = Math.round(performance.now() - started)
    if (res.status === 404 || res.status === 500 || res.ok) {
      return { online: true, latencyMs }
    }
    return { online: false, latencyMs, error: `Status ${res.status}` }
  } catch {
    return { online: false, latencyMs: Math.round(performance.now() - started), error: 'unreachable' }
  }
}
