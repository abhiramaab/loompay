import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MarkProps {
  size?: number
  className?: string
  animated?: boolean
}

export function LoomPayMark({ size = 36, className, animated = false }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="LoomPay"
    >
      <defs>
        <linearGradient id="mark-grad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="mark-grad-2" x1="14" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A5B4FC" />
          <stop offset="1" stopColor="#67E8F9" />
        </linearGradient>
        <linearGradient id="mark-grad-3" x1="20" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C7D2FE" />
          <stop offset="1" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>

      <rect x="1.5" y="1.5" width="61" height="61" rx="17" fill="#0B0B13" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="17"
        stroke="url(#mark-grad)"
        strokeOpacity="0.35"
        strokeWidth="1.25"
      />

      <motion.path
        d="M20 15.5 V45.5 H44"
        stroke="url(#mark-grad-2)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d="M25.5 15.5 V40 H44"
        stroke="url(#mark-grad-3)"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.72"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
      />
      <circle cx="44" cy="45.5" r="3.4" fill="url(#mark-grad)" />
      <circle cx="44" cy="45.5" r="6.6" stroke="url(#mark-grad)" strokeOpacity="0.32" strokeWidth="1.1" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
}

export function LoomPayLogo({ className, size = 34, showWordmark = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LoomPayMark size={size} />
      {showWordmark && (
        <span
          className="font-display text-[1.35rem] font-bold leading-none tracking-tight text-mist-100"
          style={{ letterSpacing: '-0.02em' }}
        >
          Loom<span className="text-gradient">Pay</span>
        </span>
      )}
    </div>
  )
}
