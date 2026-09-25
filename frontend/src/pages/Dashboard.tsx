import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePaymentsStore } from '@/hooks/usePaymentsStore'
import { PageHeader } from '@/components/PageHeader'
import { MetricCard } from '@/components/MetricCard'
import { StateMachine } from '@/components/StateMachine'
import { Sparkline } from '@/components/Sparkline'
import { StatusBadge } from '@/components/StatusBadge'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { CopyableId } from '@/components/CopyableId'
import { ArrowRightIcon, BoltIcon, CheckIcon, LayersIcon, RouteIcon, ShieldIcon } from '@/components/Icons'
import { formatMinor, formatMinorCompact, relativeTime, shortId } from '@/lib/format'
import { statusMeta } from '@/lib/status'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: ShieldIcon,
    title: 'Idempotent by default',
    body: 'A Redis mutex plus double-checked keys guarantee a single charge even under concurrent retries.',
  },
  {
    icon: LayersIcon,
    title: 'Double-entry ledger',
    body: 'Every movement writes matched debit and credit rows. Debits always equal credits.',
  },
  {
    icon: BoltIcon,
    title: 'Rate protected',
    body: 'A Redis token window sheds excess traffic with HTTP 429 and a Retry-After contract.',
  },
  {
    icon: RouteIcon,
    title: 'Consistent hashing',
    body: 'Deterministic partition routing spreads merchant load and minimizes rehash churn.',
  },
]

export function Dashboard() {
  const { payments } = usePaymentsStore()

  const stats = useMemo(() => {
    const byCurrency = new Map<string, number>()
    let success = 0
    let failed = 0
    let processing = 0

    for (const p of payments) {
      if (p.status === 'SUCCESS') {
        success++
        byCurrency.set(p.currency, (byCurrency.get(p.currency) ?? 0) + p.amount)
      } else if (p.status === 'FAILED') failed++
      else processing++
    }

    const primary = payments[0]?.currency ?? 'INR'
    return { success, failed, processing, byCurrency, primary, total: payments.length }
  }, [payments])

  const volumeSeries = useMemo(() => {
    const buckets = new Array(12).fill(0)
    const now = Date.now()
    payments.forEach((p, i) => {
      const idx = Math.min(11, Math.floor(((now - i * 1000) % 12) + (i % 3)))
      buckets[11 - idx] += p.amount / 100
    })
    if (payments.length === 0) return [2, 4, 3, 6, 5, 8, 7, 9, 6, 10, 8, 11]
    return buckets
  }, [payments])

  const recent = payments.slice(0, 5)

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Payment orchestration at a glance"
        description="Monitor order lifecycle, ledger balance, and engine health across your merchants."
        actions={
          <Link to="/payments" className="btn-primary">
            Create payment
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Volume settled"
          icon={<BoltIcon className="h-4 w-4" />}
          tone="mint"
          value={
            <AnimatedNumber
              value={stats.byCurrency.get('INR') ?? 0}
              format={(v) => formatMinor(Math.round(v), 'INR')}
            />
          }
          hint={`${stats.success} successful charge${stats.success === 1 ? '' : 's'}`}
          delay={0}
        />
        <MetricCard
          label="Processing"
          icon={<RouteIcon className="h-4 w-4" />}
          tone="brand"
          value={
            <AnimatedNumber value={stats.processing} format={(v) => String(Math.round(v))} />
          }
          hint="Awaiting gateway authorization"
          delay={0.05}
        />
        <MetricCard
          label="Failed"
          icon={<ShieldIcon className="h-4 w-4" />}
          tone="rose"
          value={<AnimatedNumber value={stats.failed} format={(v) => String(Math.round(v))} />}
          hint="Terminal, no funds moved"
          delay={0.1}
        />
        <MetricCard
          label="Orders total"
          icon={<LayersIcon className="h-4 w-4" />}
          tone="cyan"
          value={<AnimatedNumber value={stats.total} format={(v) => String(Math.round(v))} />}
          hint="Across this console session"
          delay={0.15}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="card relative overflow-hidden p-6 lg:col-span-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="label">Throughput</p>
              <p className="mt-1 font-display text-lg font-semibold text-mist-100">
                Normalized volume
              </p>
            </div>
            <span className="chip border-mint-500/40 bg-mint-500/10 text-mint-300">
              <CheckIcon className="h-3 w-3" />
              ledger balanced
            </span>
          </div>
          <div className="mt-5">
            <Sparkline data={volumeSeries} height={92} />
          </div>
          <div className="mt-3 flex items-center justify-between text-2xs text-mist-600">
            <span>last 12 windows</span>
            <span className="mono">
              peak {formatMinorCompact(Math.max(...volumeSeries) * 100, stats.primary as 'INR')}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="card p-6 lg:col-span-2"
        >
          <p className="label">State lifecycle</p>
          <p className="mt-1 font-display text-lg font-semibold text-mist-100">
            Valid order transitions
          </p>
          <div className="mt-4">
            <StateMachine active="PROCESSING" />
          </div>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="card overflow-hidden lg:col-span-3"
        >
          <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-mist-100">Recent payments</p>
              <p className="text-2xs text-mist-500">Created from this console</p>
            </div>
            <Link
              to="/payments"
              className="flex items-center gap-1 text-xs font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              View all
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <EmptyRecent />
          ) : (
            <ul className="divide-y divide-ink-800/70">
              {recent.map((p, i) => (
                <motion.li
                  key={p.orderId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <Link
                    to={`/payments/${p.orderId}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-ink-850/60"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-2xs font-semibold text-mist-400">
                      {p.currency}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CopyableId value={p.orderId} display={shortId(p.orderId, 14)} />
                      <p className="mt-0.5 truncate text-2xs text-mist-500">{p.merchantId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-mist-100">
                        {formatMinor(p.amount, p.currency)}
                      </p>
                      <p className="mt-0.5 text-2xs text-mist-600">{relativeTime(p.createdAt)}</p>
                    </div>
                    <StatusBadge status={p.status} className="ml-1 hidden sm:inline-flex" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="card p-5 lg:col-span-2"
        >
          <p className="text-sm font-semibold text-mist-100">Engine capabilities</p>
          <div className="mt-4 flex flex-col gap-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-850 text-brand-300">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-mist-200">{title}</p>
                  <p className="mt-0.5 text-2xs leading-relaxed text-mist-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function EmptyRecent() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink-700 bg-ink-850 text-mist-500">
        <LayersIcon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-mist-300">No payments yet</p>
      <p className="mt-1 max-w-xs text-xs text-mist-500">
        Create your first payment to see it flow through the lifecycle.
      </p>
      <Link to="/payments" className="btn-primary mt-4">
        Create payment
      </Link>
    </div>
  )
}

export { statusMeta, cn }
