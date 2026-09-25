import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ApiError, api } from '@/api/client'
import type { Currency, Payment } from '@/api/types'
import { useToast } from '@/hooks/useToasts'
import { createIdempotencyKey } from '@/lib/utils'
import { currencySymbol } from '@/lib/format'
import { CheckIcon, CopyIcon, LockIcon, RefreshIcon } from './Icons'
import { cn, copyToClipboard } from '@/lib/utils'

const CURRENCIES: Currency[] = ['INR', 'USD', 'EUR']

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (payment: Payment) => void
}

export function CreatePaymentPanel({ open, onClose, onCreated }: Props) {
  const { push } = useToast()
  const [merchantId, setMerchantId] = useState(
    () => localStorage.getItem('loompay.merchantId') ?? 'merchant_demo',
  )
  const [amount, setAmount] = useState('1500.00')
  const [currency, setCurrency] = useState<Currency>('INR')
  const [idempotencyKey, setIdempotencyKey] = useState(() => createIdempotencyKey())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Payment | null>(null)

  const amountMinor = useMemo(() => {
    const value = Number.parseFloat(amount)
    if (Number.isNaN(value)) return null
    return Math.round(value * 100)
  }, [amount])

  function regenerateKey() {
    setIdempotencyKey(createIdempotencyKey())
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (amountMinor === null || amountMinor <= 0) {
      setError('Enter a valid amount greater than zero.')
      return
    }
    if (!merchantId.trim()) {
      setError('Merchant ID is required.')
      return
    }

    localStorage.setItem('loompay.merchantId', merchantId.trim())
    setSubmitting(true)
    try {
      const payment = await api.createPayment({
        merchantId: merchantId.trim(),
        amount: amountMinor,
        currency,
        idempotencyKey,
      })
      onCreated(payment)
      setResult(payment)
      push({
        tone: 'success',
        title: 'Payment created',
        description: `${payment.orderId} · ${payment.status}`,
      })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 429
            ? `Rate limited. Retry in ${err.retryAfter ?? 10}s (5 requests / 10s per merchant).`
            : err.message
          : 'Unexpected error'
      setError(message)
      push({ tone: 'error', title: 'Payment failed', description: message })
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setResult(null)
    setError(null)
    setIdempotencyKey(createIdempotencyKey())
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={reset} />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-ink-700 bg-ink-900/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink-800 px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-mist-100">
                  {result ? 'Payment created' : 'Create payment'}
                </h2>
                <p className="mt-0.5 text-xs text-mist-500">
                  {result ? 'Order accepted by the orchestrator' : 'POST /api/v1/payments'}
                </p>
              </div>
              <button onClick={reset} className="btn-ghost !px-3 !py-2 text-xs">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative flex h-16 w-16 items-center justify-center rounded-full border border-mint-500/40 bg-mint-500/10 text-mint-500"
                    >
                      <span className="absolute inset-0 animate-pulse-ring rounded-full border border-mint-400/40" />
                      <CheckIcon className="h-7 w-7" />
                    </motion.div>
                    <p className="mt-4 font-display text-xl font-bold text-mist-100">
                      {result.status}
                    </p>
                    <p className="mt-1 font-mono text-xs text-mist-400">{result.orderId}</p>

                    <div className="mt-6 w-full space-y-2 rounded-2xl border border-ink-700 bg-ink-850/60 p-4 text-left">
                      <ResultRow label="Merchant" value={result.merchantId} />
                      <ResultRow label="Amount" value={`${currencySymbol(result.currency)}${(result.amount / 100).toFixed(2)}`} />
                      <ResultRow label="Currency" value={result.currency} />
                      <ResultRow label="Status" value={result.status} />
                      <ResultRow label="Created" value={new Date(result.createdAt).toLocaleString()} />
                    </div>

                    <p className="mt-4 text-2xs text-mist-600">
                      The idempotency lock has been released. Reusing this key returns the same order.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <Field label="Merchant ID" hint="Sent as X-Merchant-Id for rate limiting">
                      <input
                        className="input"
                        value={merchantId}
                        onChange={(e) => setMerchantId(e.target.value)}
                        placeholder="merchant_123"
                      />
                    </Field>

                    <Field label="Amount" hint="Major units; converted to minor (paise/cents)">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-mist-500">
                          {currencySymbol(currency)}
                        </span>
                        <input
                          className="input pl-8 font-mono"
                          value={amount}
                          inputMode="decimal"
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="1500.00"
                        />
                      </div>
                      {amountMinor !== null && amountMinor > 0 && (
                        <p className="mono mt-1.5 text-2xs text-mist-600">→ {amountMinor} minor units</p>
                      )}
                    </Field>

                    <Field label="Currency">
                      <div className="grid grid-cols-3 gap-2">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCurrency(c)}
                            className={cn(
                              'relative rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all',
                              currency === c
                                ? 'border-brand-400/60 bg-brand-500/10 text-mist-100'
                                : 'border-ink-600 bg-ink-850/60 text-mist-400 hover:border-ink-500',
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field
                      label="Idempotency key"
                      hint="Reuse to safely retry without double-charging"
                    >
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mist-600" />
                          <input
                            className="input pl-9 font-mono text-xs"
                            value={idempotencyKey}
                            onChange={(e) => setIdempotencyKey(e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(idempotencyKey)}
                          className="btn-ghost !px-3"
                          title="Copy"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={regenerateKey}
                          className="btn-ghost !px-3"
                          title="Regenerate"
                        >
                          <RefreshIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </Field>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-xl border border-rosex-500/40 bg-rosex-500/10 px-4 py-3 text-xs text-rosex-500"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-ink-800 px-6 py-4">
              {result ? (
                <div className="flex gap-3">
                  <button onClick={reset} className="btn-primary flex-1">
                    Create another
                  </button>
                  <button onClick={reset} className="btn-ghost">
                    Done
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary w-full"
                >
                  {submitting ? 'Creating…' : 'Create payment'}
                </button>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium text-mist-300">{label}</label>
        {hint && <span className="text-2xs text-mist-600">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-2xs uppercase tracking-wide text-mist-500">{label}</span>
      <span className="mono truncate text-xs text-mist-200">{value}</span>
    </div>
  )
}
