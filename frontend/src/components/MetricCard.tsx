import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AccentTone = 'brand' | 'mint' | 'cyan' | 'rose'

const ACCENTS: Record<AccentTone, { text: string; glow: string }> = {
  brand: { text: 'text-brand-500', glow: 'bg-brand-500/10' },
  mint: { text: 'text-mint-500', glow: 'bg-mint-500/10' },
  cyan: { text: 'text-cyanx-500', glow: 'bg-cyanx-500/10' },
  rose: { text: 'text-rosex-500', glow: 'bg-rosex-500/10' },
}

interface Props {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  tone?: AccentTone
  delay?: number
}

export function MetricCard({ label, value, hint, icon, tone = 'brand', delay = 0 }: Props) {
  const accent = ACCENTS[tone]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card card-hover group relative overflow-hidden p-5"
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-100',
          accent.glow,
        )}
      />
      <div className="relative flex items-start justify-between">
        <p className="label">{label}</p>
        {icon && <span className={cn('opacity-80', accent.text)}>{icon}</span>}
      </div>
      <div className="relative mt-3 font-display text-[1.7rem] font-bold leading-none tracking-tight text-mist-100">
        {value}
      </div>
      {hint && <div className="relative mt-2 text-xs text-mist-500">{hint}</div>}
    </motion.div>
  )
}
