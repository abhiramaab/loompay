import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ApiError, api } from '@/api/client'
import type { EntryType, Payment, PaymentStatus } from '@/api/types'
import { StatusBadge } from '@/components/StatusBadge'
import { CopyableId } from '@/components/CopyableId'
import { StateMachine } from '@/components/StateMachine'
import { Skeleton } from '@/components/Skeleton'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import {
  AlertIcon,
  ArrowLeftIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
  RefreshIcon,
} from '@/components/Icons'
import { formatDateTime, formatMinor, relativeTime } from '@/lib/format'
import { STATUS_META, statusMeta } from '@/lib/status'
import { cn } from '@/lib/utils'

interface TimelineStep {
  status: PaymentStatus
  label: string
  detail: string
  reached: boolean
  current: boolean
}

export function PaymentDetail() {
  const { orderId = '' } = useParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!orderId) return
    setLoading(true)
    setError(null)
    try {
      const result = await api.getPayment(orderId)
      setPayment(result)
      localStorage.setItem(
        'loompay.session.payments',
        JSON.stringify(upsert(localStorage.getItem('loompay.session.payments'), result)),
      )
    } catch (err) {
      // Fall back to the session cache if the backend has no such order.
      const cached = readCache(orderId)
      if (cached) {
        setPayment(cached)
      } else {
        setError(err instanceof ApiError ? err.message : 'Unable to load payment')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const timeline = payment ? buildTimeline(payment) : []
  const ledger = payment ? buildLedgerPreview(payment) : []

  return (
    <div>
      <Link
        to="/payments"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-mist-400 transition-colors hover:text-mist-100"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All payments
      </Link>

      {loading ? (
        <DetailSkeleton />
      ) : error || !payment ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rosex-500/40 bg-rosex-500/10 text-rosex-500">
            <AlertIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-mist-200">Order not found</p>
          <p className="mt-1 max-w-md text-xs text-mist-500">{error}</p>
          <button onClick={load} className="btn-ghost mt-5">
            <RefreshIcon className="h-4 w-4" />
            Retry
          </button>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="card relative overflow-hidden p-6"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="chip border-ink-600 bg-ink-850 text-2xs text-mist-300">
                    {payment.currency}
                  </span>
                  <StatusBadge status={payment.status} pulse />
                </div>
                <div className="mt-3">
                  <CopyableId value={payment.orderId} className="!text-sm" />
                </div>
                <div className="mt-4 font-display text-4xl font-bold tracking-tight text-mist-100">
                  <AnimatedNumber
                    value={payment.amount}
                    format={(v) => formatMinor(Math.round(v), payment.currency)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-mist-500">
                  {statusMeta(payment.status).description}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-xs sm:items-end">
                <DetailStat label="Merchant" value={payment.merchantId} />
                <DetailStat label="Created" value={formatDateTime(payment.createdAt)} />
                <DetailStat label="Age" value={relativeTime(payment.createdAt)} />
              </div>
            </div>

            <div className="relative mt-6 md:max-w-md">
              <button onClick={load} className="btn-ghost !py-2 text-xs">
                <RefreshIcon className="h-3.5 w-3.5" />
                Refresh from engine
              </button>
            </div>
          </motion.div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="card p-6"
            >
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-brand-500" />
                <p className="text-sm font-semibold text-mist-100">Lifecycle timeline</p>
              </div>
              <ol className="mt-5">
                {timeline.map((step, i) => (
                  <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < timeline.length - 1 && (
                      <span
                        className={cn(
                          'absolute left-[11px] top-6 h-full w-px',
                          step.reached ? 'bg-brand-500/40' : 'bg-ink-700',
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                        step.current
                          ? 'border-brand-400 bg-brand-500/20 text-brand-600'
                          : step.reached
                            ? 'border-mint-500/50 bg-mint-500/15 text-mint-500'
                            : 'border-ink-700 bg-ink-850 text-mist-600',
                      )}
                    >
                      {step.reached && !step.current ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <span className={cn('h-1.5 w-1.5 rounded-full', step.reached ? 'bg-current' : 'bg-mist-600')} />
                      )}
                      {step.current && (
                        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-400/50" />
                      )}
                    </span>
                    <div className="pt-0.5">
                      <p className={cn('text-xs font-semibold', step.reached ? 'text-mist-100' : 'text-mist-500')}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-2xs leading-relaxed text-mist-500">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center gap-2">
                <BookIcon className="h-4 w-4 text-cyanx-500" />
                <p className="text-sm font-semibold text-mist-100">Ledger preview</p>
              </div>
              <p className="mt-1 text-2xs text-mist-500">
                Projected double-entry rows for this order.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-ink-700">
                <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-ink-800 bg-ink-850/60 px-4 py-2.5 text-2xs uppercase tracking-wide text-mist-600">
                  <span>Account</span>
                  <span>Type</span>
                  <span className="text-right">Amount</span>
                </div>
                {ledger.map((row, i) => (
                  <motion.div
                    key={`${row.account}-${row.type}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-ink-800/60 px-4 py-3 last:border-0"
                  >
                    <span className="font-mono text-xs text-mist-200">{row.account}</span>
                    <span
                      className={cn(
                        'chip',
                        row.type === 'DEBIT'
                          ? 'border-rosex-500/40 bg-rosex-500/10 text-rosex-500'
                          : 'border-mint-500/40 bg-mint-500/10 text-mint-500',
                      )}
                    >
                      {row.type}
                    </span>
                    <span className="text-right font-mono text-xs text-mist-100">
                      {formatMinor(row.amount, payment.currency)}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-3 text-2xs text-mist-600">
                Debits equal credits — {formatMinor(
                  ledger.reduce((sum, r) => (r.type === 'DEBIT' ? sum + r.amount : sum), 0),
                  payment.currency,
                )}{' '}
                on each side.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="card mt-4 p-6"
          >
            <p className="text-sm font-semibold text-mist-100">State machine</p>
            <p className="mt-1 text-2xs text-mist-500">
              The order sits at <span className="text-mist-300">{payment.status}</span>. Illegal
              transitions are rejected by the domain layer.
            </p>
            <div className="mt-4 max-w-xl">
              <StateMachine active={payment.status} />
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 sm:justify-end">
      <span className="text-mist-600">{label}</span>
      <span className="mono text-mist-200">{value}</span>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  )
}

function buildTimeline(payment: Payment): TimelineStep[] {
  const order: PaymentStatus[] = ['CREATED', 'PROCESSING', 'SUCCESS']
  const terminal = payment.status
  const failed = terminal === 'FAILED'
  const steps: PaymentStatus[] = failed ? ['CREATED', 'PROCESSING', 'FAILED'] : order
  const currentIndex = steps.indexOf(terminal)

  return steps.map((status, i) => {
    const meta = STATUS_META[status]
    return {
      status,
      label: meta.label,
      detail: meta.description,
      reached: currentIndex === -1 ? true : i <= currentIndex,
      current: status === terminal,
    }
  })
}

function buildLedgerPreview(payment: Payment): Array<{ account: string; type: EntryType; amount: number }> {
  const success = payment.status === 'SUCCESS' || payment.status === 'REFUNDED'
  if (!success) {
    return [
      { account: 'merchant_receivable', type: 'DEBIT', amount: payment.amount },
      { account: 'gateway_clearing', type: 'CREDIT', amount: payment.amount },
    ]
  }
  return [
    { account: 'gateway_clearing', type: 'DEBIT', amount: payment.amount },
    { account: 'merchant_payable', type: 'CREDIT', amount: payment.amount },
  ]
}

function readCache(orderId: string): Payment | null {
  try {
    const raw = localStorage.getItem('loompay.session.payments')
    if (!raw) return null
    const list = JSON.parse(raw) as Payment[]
    return list.find((p) => p.orderId === orderId) ?? null
  } catch {
    return null
  }
}

function upsert(raw: string | null, payment: Payment): Payment[] {
  let list: Payment[] = []
  try {
    list = raw ? (JSON.parse(raw) as Payment[]) : []
  } catch {
    list = []
  }
  return [payment, ...list.filter((p) => p.orderId !== payment.orderId)]
}
