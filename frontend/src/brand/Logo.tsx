import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface MarkProps {
  size?: number
  className?: string
  animated?: boolean
  /** Render the rounded blue tile. When false, just the L is drawn. */
  tile?: boolean
  /** Stroke colour when `tile` is false. */
  tone?: 'blue' | 'current'
}

/**
 * LoomPay monogram: a single continuous "L" stroke — the thread — resting on a
 * rounded tile, with two woven weft lines crossing it.
 */
export function LoomPayMark({
  size = 36,
  className,
  animated = false,
  tile = true,
  tone = 'blue',
}: MarkProps) {
  const uid = useId().replace(/:/g, '')
  const blueId = `lp-blue-${uid}`
  const threadId = `lp-thread-${uid}`
  const stroke = tile ? '#FFFFFF' : tone === 'current' ? 'currentColor' : '#007AFF'
  const threadStroke = tile ? '#FFFFFF' : '#32ADE6'

  const draw = (delay: number) => ({
    initial: animated ? { pathLength: 0, opacity: 0 } : false,
    animate: animated ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { duration: 0.7, delay, ease: [0.65, 0, 0.35, 1] as const },
  })

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
        <linearGradient id={blueId} x1="18" y1="14" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A84FF" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
        <linearGradient id={threadId} x1="14" y1="20" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5AC8FA" />
          <stop offset="1" stopColor="#32ADE6" />
        </linearGradient>
      </defs>

      {tile && (
        <>
          <rect x="0.5" y="0.5" width="63" height="63" rx="18" fill={`url(#${blueId})`} />
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="18"
            fill={`url(#${threadId})`}
            fillOpacity="0.16"
          />
        </>
      )}

      <motion.path
        d="M22 18 V40.5 A5.5 5.5 0 0 0 27.5 46 H42"
        stroke={stroke}
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0)}
      />
      <motion.path
        d="M25.5 24 H39"
        stroke={threadStroke}
        strokeOpacity={tile ? 0.34 : 0.6}
        strokeWidth="2.1"
        strokeLinecap="round"
        {...draw(0.22)}
      />
      <motion.path
        d="M25.5 31 H36.5"
        stroke={threadStroke}
        strokeOpacity={tile ? 0.22 : 0.42}
        strokeWidth="2.1"
        strokeLinecap="round"
        {...draw(0.34)}
      />
      <motion.circle
        cx="42"
        cy="46"
        r="3.4"
        fill={stroke}
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: 0.6, type: 'spring', stiffness: 320, damping: 18 }}
      />
    </svg>
  )
}

interface LogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  /** Wordmark colour scheme. */
  variant?: 'default' | 'light'
}

export function LoomPayLogo({
  className,
  size = 34,
  showWordmark = true,
  variant = 'default',
}: LogoProps) {
  const isLight = variant === 'light'
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LoomPayMark size={size} />
      {showWordmark && (
        <span
          className={cn(
            'font-display text-[1.3rem] font-bold leading-none tracking-tight',
            isLight ? 'text-white' : 'text-mist-100',
          )}
          style={{ letterSpacing: '-0.03em' }}
        >
          Loom
          <span className={isLight ? 'text-brand-300' : 'text-brand-500'}>Pay</span>
        </span>
      )}
    </div>
  )
}
