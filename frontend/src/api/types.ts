export type Currency = 'INR' | 'USD' | 'EUR'

export type PaymentStatus = 'CREATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export type EntryType = 'DEBIT' | 'CREDIT'

export interface CreatePaymentRequest {
  merchantId: string
  amount: number
  currency: Currency
  idempotencyKey: string
}

export interface Payment {
  orderId: string
  merchantId: string
  amount: number
  currency: Currency
  status: PaymentStatus
  createdAt: string
}

export interface LedgerEntry {
  id?: number
  paymentOrderId: string
  account: string
  entryType: EntryType
  amount: number
  currency: Currency
  createdAt?: string
}

export interface PaymentAttempt {
  id?: number
  attemptedNumber: number
  provider: string
  providerTransactionId: string
  paymentStatus: PaymentStatus
  failureReason?: string
  createdAt?: string
}

export interface ApiErrorBody {
  status?: number
  error?: string
  message?: string
}

export class ApiError extends Error {
  status: number
  retryAfter?: number
  body?: ApiErrorBody

  constructor(message: string, status: number, retryAfter?: number, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.retryAfter = retryAfter
    this.body = body
  }
}
