import { motion } from 'framer-motion'
import type { PaymentStatus } from '@/api/types'
import { statusMeta } from '@/lib/status'
import { cn } from '@/lib/utils'

export function StatusBadge({
  status,
  pulse = false,
  className,
}: {
  status: PaymentStatus
  pulse?: boolean
  className?: string
}) {
  const meta = statusMeta(status)
  const isActive = status === 'PROCESSING'

  return (
    <span className={cn('chip', meta.chip, className)}>
      <span className="relative flex h-2 w-2 items-center justify-center">
        {(pulse || isActive) && (
          <span className={cn('absolute inline-flex h-2 w-2 rounded-full opacity-70', meta.dot, 'animate-pulse-ring')} />
        )}
        <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', meta.dot)} />
      </span>
      {meta.label}
    </span>
  )
}

export function StatusDot({ status }: { status: PaymentStatus }) {
  const meta = statusMeta(status)
  return <span className={cn('inline-block h-2 w-2 rounded-full', meta.dot)} />
}

export function StatusBadgeAnimated({ status }: { status: PaymentStatus }) {
  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
    >
      <StatusBadge status={status} pulse />
    </motion.div>
  )
}
