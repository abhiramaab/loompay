import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface MarkProps {
  size?: number
  className?: string
  animated?: boolean
  /**
   * Render the rounded blue tile behind the mark. When false the needle and
   * thread are drawn directly on a transparent background.
   */
  tile?: boolean
  /** Force a colour. Defaults to the brand gradient. */
  tone?: 'brand' | 'current'
}

/**
 * LoomPay monogram: a needle with a thread running through its eye.
 *
 * The needle is drawn as an outlined, tapered form so the eye is a genuine
 * opening — the mark stays transparent instead of sitting on a filled tile.
 * The thread passes through the eye and sweeps down into the foot of an "L",
 * so the mark reads as both a weaving tool and the initial.
 */
export function LoomPayMark({
  size = 36,
  className,
  animated = false,
  tile = false,
  tone = 'brand',
}: MarkProps) {
  const uid = useId().replace(/:/g, '')
  const threadGrad = `lp-thread-${uid}`
  const needleGrad = `lp-needle-${uid}`

  const isCurrent = tone === 'current'
  const needleStroke = tile ? '#FFFFFF' : isCurrent ? 'currentColor' : `url(#${needleGrad})`
  const threadStroke = tile ? 'rgba(255,255,255,0.9)' : isCurrent ? 'currentColor' : `url(#${threadGrad})`

  const draw = (delay: number, duration = 0.7) => ({
    initial: animated ? { pathLength: 0, opacity: 0 } : false,
    animate: animated ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
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
        <linearGradient id={needleGrad} x1="22" y1="42" x2="46" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#007AFF" />
          <stop offset="1" stopColor="#3D9BFF" />
        </linearGradient>
        <linearGradient id={threadGrad} x1="10" y1="12" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#32ADE6" />
          <stop offset="1" stopColor="#5AC8FA" />
        </linearGradient>
        <mask id={`${needleGrad}-mask`}>
          <rect x="0" y="0" width="64" height="64" fill="white" />
          <ellipse
            cx="23.2"
            cy="40.4"
            rx="1.25"
            ry="2.5"
            transform="rotate(-36.5 23.2 40.4)"
            fill="black"
          />
        </mask>
      </defs>

      {tile && (
        <>
          <rect x="0.5" y="0.5" width="63" height="63" rx="17" fill={`url(#${needleGrad})`} />
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="17"
            fill={`url(#${threadGrad})`}
            fillOpacity="0.18"
          />
        </>
      )}

      {/* Thread: passes through the eye, then sweeps down to form the L foot. */}
      <motion.path
        d="M9.5 10.5 C13 21 17.5 31 23.2 40.4 C26 46.5 31.5 50.5 38.5 51.6 C45.5 52.7 51.5 50.2 55 45.5"
        stroke={threadStroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...draw(0.1, 0.95)}
      />
      <motion.path
        d="M55 45.5 C56.8 43.8 57.8 42 58.2 40.2"
        stroke={threadStroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
        {...draw(1.0, 0.4)}
      />

      {/* Needle drawn over the thread, tapering to a sharp point (upper-right). */}
      <motion.path
        d="M20.6 45.8 L22.2 41.5 L42.6 13.7 L46.2 10.2 L44.9 15.1 L24.5 43.2 Z"
        fill={needleStroke}
        mask={`url(#${needleGrad}-mask)`}
        initial={animated ? { opacity: 0, scale: 0.94 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.45, delay: 0.35 }}
        style={{ transformOrigin: '33px 28px' }}
      />
    </svg>
  )
}

interface LogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  /** Colour scheme for the wordmark and mark. */
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
      <LoomPayMark
        size={size}
        tile={isLight}
        tone={isLight ? 'current' : 'brand'}
        className={isLight ? 'text-white' : undefined}
      />
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
